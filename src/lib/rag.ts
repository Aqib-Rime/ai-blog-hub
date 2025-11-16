import type { Payload } from 'payload'
import { generateEmbedding } from './embeddings'
import { sql } from '@payloadcms/db-postgres'
import { blog_embeddings } from '@/payload-generated-schema'
import { ensurePgvectorEnabled } from './pgvector-setup'

export interface RelevantChunk {
  content: string
  chunkIndex: number
  blogId: string | number
  similarity: number
}

/**
 * Retrieve relevant blog chunks using vector similarity search
 */
export async function retrieveRelevantChunks(
  payload: Payload,
  query: string,
  blogId?: string | number,
  topK: number = 5,
): Promise<RelevantChunk[]> {
  try {
    // Ensure pgvector extension is enabled
    await ensurePgvectorEnabled(payload)

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)
    // Format vector as PostgreSQL array literal: '[1,2,3]'::vector
    const vectorArrayString = `[${queryEmbedding.join(',')}]`

    // Use Drizzle table references with raw SQL for vector operations
    // Convert JSONB embedding to vector: embedding::text::vector
    // Using cosine distance: 1 - cosine_similarity
    const numericBlogId = blogId ? (typeof blogId === 'string' ? Number(blogId) : blogId) : null

    const querySQL = sql`
      SELECT 
        ${blog_embeddings.id},
        ${blog_embeddings.blog},
        ${blog_embeddings.chunkIndex},
        ${blog_embeddings.content},
        1 - ((${blog_embeddings.embedding}::text::vector) <=> ${sql.raw(`'${vectorArrayString}'`)}::vector) as similarity
      FROM ${blog_embeddings}
      WHERE ${blog_embeddings.embedding} IS NOT NULL
      ${numericBlogId ? sql`AND ${blog_embeddings.blog} = ${numericBlogId}` : sql``}
      ORDER BY similarity DESC
      LIMIT ${topK}
    `

    // Execute the query
    const result = await payload.db.drizzle.execute(querySQL)

    // Map results to RelevantChunk format
    const chunks: RelevantChunk[] = result.rows.map((row: any) => ({
      content: row.content,
      chunkIndex: Number(row.chunk_index),
      blogId: row.blog_id,
      similarity: parseFloat(row.similarity) || 0,
    }))

    return chunks
  } catch (error) {
    console.error('Error retrieving relevant chunks:', error)
    throw error
  }
}

/**
 * Build context string from relevant chunks for RAG
 */
export function buildRAGContext(chunks: RelevantChunk[]): string {
  if (chunks.length === 0) {
    return ''
  }

  const contextParts = chunks.map(
    (chunk, index) => `[Chunk ${chunk.chunkIndex + 1}]\n${chunk.content}`,
  )

  return contextParts.join('\n\n---\n\n')
}
