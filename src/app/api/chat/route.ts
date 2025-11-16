import { groq } from '@ai-sdk/groq'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { retrieveRelevantChunks, buildRAGContext } from '@/lib/rag'
import { z } from 'zod'

export const maxDuration = 30

const chatRequestSchema = z.object({
  messages: z.array(z.any()).min(1, 'At least one message is required'),
  blogSlug: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validationResult = chatRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          details: validationResult.error.issues,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const { messages, blogSlug } = validationResult.data as {
      messages: UIMessage[]
      blogSlug?: string
    }

    const payload = await getPayload({ config: configPromise })

    // Resolve blog ID from slug if provided
    let blogId: string | number | undefined
    if (blogSlug) {
      const blogs = await payload.find({
        collection: 'blogs',
        where: {
          slug: {
            equals: blogSlug,
          },
        },
        limit: 1,
      })
      blogId = blogs.docs[0]?.id
    }

    const lastMessage = messages[messages.length - 1]

    // Extract text from last message parts
    const lastMessageText = lastMessage.parts
      .filter((part) => part.type === 'text')
      .map((part) => (part.type === 'text' ? part.text : ''))
      .join('')

    if (!lastMessageText) {
      return new Response('Last message must contain text content', { status: 400 })
    }

    // Retrieve relevant chunks using RAG
    const relevantChunks = await retrieveRelevantChunks(
      payload,
      lastMessageText,
      blogId,
      5, // top 5 most relevant chunks
    )

    // Build context from retrieved chunks
    const context = buildRAGContext(relevantChunks)

    // Build system prompt with context
    const systemPrompt = blogSlug
      ? `You are a helpful AI assistant that answers questions about a specific blog post. Use the following context from the blog post to answer questions accurately. If the answer cannot be found in the context, say so politely.

Context from the blog post:
${context}

Instructions:
- Answer questions based on the provided context
- Be concise and helpful
- If you don't know the answer based on the context, say "I don't have enough information in the blog post to answer that question."
- Maintain a friendly and conversational tone`
      : `You are a helpful AI assistant that answers questions about blog posts. Use the following context from relevant blog posts to answer questions accurately. If the answer cannot be found in the context, say so politely.

Context from relevant blog posts:
${context}

Instructions:
- Answer questions based on the provided context
- Be concise and helpful
- If you don't know the answer based on the context, say "I don't have enough information in the blog posts to answer that question."
- Maintain a friendly and conversational tone`

    // Use free Groq Llama model via AI SDK
    // Using llama-3.3-70b-versatile (replacement for deprecated llama-3.1-70b-versatile)
    // Alternative: llama-3.1-8b-instant for faster responses
    // API key is automatically read from GROQ_API_KEY environment variable
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error('Error in chat API:', error)
    const errorMessage = error?.message || error?.toString() || 'Unknown error'
    const errorStack = error?.stack

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
