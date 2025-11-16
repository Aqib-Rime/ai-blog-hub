import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '@/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

/**
 * Extract plain text from Lexical rich text JSON structure
 */
export function extractTextFromLexical(lexicalData: any): string {
  if (!lexicalData || typeof lexicalData !== 'object') {
    return ''
  }

  let text = ''

  // Handle root node
  if (lexicalData.root) {
    text = extractTextFromNode(lexicalData.root)
  } else if (lexicalData.children) {
    // Handle direct children array
    text = lexicalData.children
      .map((child: any) => extractTextFromNode(child))
      .join(' ')
  }

  return text.trim()
}

/**
 * Recursively extract text from a Lexical node
 */
function extractTextFromNode(node: any): string {
  if (!node) return ''

  // If node has text property, return it
  if (node.text) {
    return node.text
  }

  // If node has children, recursively process them
  if (node.children && Array.isArray(node.children)) {
    return node.children.map((child: any) => extractTextFromNode(child)).join(' ')
  }

  return ''
}

/**
 * Chunk text into smaller pieces with overlap
 */
export function chunkText(
  text: string,
  chunkSize: number = 800,
  overlap: number = 200,
): string[] {
  if (!text || text.length === 0) {
    return []
  }

  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    let chunk = text.slice(start, end)

    // Try to break at sentence boundaries if not at the end
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.')
      const lastNewline = chunk.lastIndexOf('\n')
      const breakPoint = Math.max(lastPeriod, lastNewline)

      if (breakPoint > chunkSize * 0.5) {
        // Only break if we're at least halfway through the chunk
        chunk = chunk.slice(0, breakPoint + 1)
        start += breakPoint + 1
      } else {
        start = end - overlap
      }
    } else {
      start = end
    }

    chunks.push(chunk.trim())
  }

  return chunks.filter((chunk) => chunk.length > 0)
}

/**
 * Generate embedding for a text chunk using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const result = await model.embedContent(text)
    const embedding = result.embedding.values

    if (!embedding || embedding.length === 0) {
      throw new Error('Failed to generate embedding')
    }

    return embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

/**
 * Generate embeddings for multiple text chunks
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  // Process in batches to avoid rate limits
  const batchSize = 10
  const embeddings: number[][] = []

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const batchEmbeddings = await Promise.all(
      batch.map((text) => generateEmbedding(text)),
    )
    embeddings.push(...batchEmbeddings)
  }

  return embeddings
}

