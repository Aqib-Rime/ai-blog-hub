import type { BasePayload, Payload } from 'payload'
import { extractTextFromLexical, chunkText, generateEmbeddings } from './embeddings'
import { sql } from '@payloadcms/db-postgres'
import { blog_embeddings } from '@/payload-generated-schema'
import { ensurePgvectorEnabled } from './pgvector-setup'

/**
 * Upsert embeddings for a blog post
 */
export async function upsertBlogEmbeddings(
  payload: BasePayload,
  blogId: string | number,
  content: any, // Lexical rich text content
): Promise<void> {
  try {
    // Extract plain text from Lexical content
    const plainText = extractTextFromLexical(content)

    if (!plainText || plainText.length === 0) {
      console.warn(`No text content found for blog ${blogId}`)
      return
    }

    // Chunk the text
    const chunks = chunkText(plainText, 800, 200)

    if (chunks.length === 0) {
      console.warn(`No chunks created for blog ${blogId}`)
      return
    }

    // Generate embeddings for all chunks
    const embeddings = await generateEmbeddings(chunks)

    // Delete existing embeddings for this blog
    await payload.delete({
      collection: 'blog-embeddings',
      where: {
        blog: {
          equals: blogId,
        },
      },
    })

    // Insert new embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const embedding = embeddings[i]

      try {
        // Store embedding - if embedding column is vector type, convert array to vector format
        // Otherwise store as JSON
        const vectorArrayString = `[${embedding.join(',')}]`
        await payload.create({
          collection: 'blog-embeddings',
          data: {
            blog: typeof blogId === 'string' ? Number(blogId) : blogId,
            chunkIndex: i,
            content: chunk,
            embedding: embedding, // Store as JSON or vector depending on column type
          },
        })

        // If embedding column is vector type, update it using Drizzle table references with raw SQL
        try {
          // Ensure pgvector extension is enabled
          await ensurePgvectorEnabled(payload)

          const numericBlogId = typeof blogId === 'string' ? Number(blogId) : blogId
          await payload.db.drizzle.execute(
            sql`
              UPDATE ${blog_embeddings}
              SET ${blog_embeddings.embedding} = ${sql.raw(`'${vectorArrayString}'`)}::vector
              WHERE ${blog_embeddings.blog} = ${numericBlogId}
              AND ${blog_embeddings.chunkIndex} = ${i}
              AND ${blog_embeddings.id} = (
                SELECT ${blog_embeddings.id} FROM ${blog_embeddings}
                WHERE ${blog_embeddings.blog} = ${numericBlogId}
                AND ${blog_embeddings.chunkIndex} = ${i}
                ORDER BY ${blog_embeddings.id} DESC
                LIMIT 1
              )
            `,
          )
        } catch (vectorError: any) {
          // If embedding column is not vector type or update fails, that's okay
          // The JSON value was already stored above
          console.warn(
            `Could not update embedding as vector for chunk ${i} of blog ${blogId}:`,
            vectorError.message,
          )
        }
      } catch (chunkError) {
        console.error(`Error creating chunk ${i} for blog ${blogId}:`, chunkError)
        // Continue with next chunk instead of failing completely
        continue
      }
    }

    console.log(`Successfully upserted ${chunks.length} embeddings for blog ${blogId}`)
  } catch (error) {
    console.error(`Error upserting embeddings for blog ${blogId}:`, error)
    throw error
  }
}

/**
 * Delete embeddings for a blog post
 */
export async function deleteBlogEmbeddings(
  payload: Payload,
  blogId: string | number,
): Promise<void> {
  try {
    await payload.delete({
      collection: 'blog-embeddings',
      where: {
        blog: {
          equals: blogId,
        },
      },
    })
    console.log(`Successfully deleted embeddings for blog ${blogId}`)
  } catch (error) {
    console.error(`Error deleting embeddings for blog ${blogId}:`, error)
    throw error
  }
}
