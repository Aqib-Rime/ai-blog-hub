import { sql } from '@payloadcms/db-postgres'
import { BasePayload } from 'payload'

let pgvectorEnabled = false

/**
 * Ensure pgvector extension is enabled in the database
 */
export async function ensurePgvectorEnabled(payload: BasePayload): Promise<void> {
  if (pgvectorEnabled) {
    return
  }

  try {
    // Try to enable pgvector extension
    await payload.db.drizzle.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`)
    pgvectorEnabled = true
    console.log('pgvector extension enabled')
  } catch (error: any) {
    // If extension can't be enabled (e.g., not installed), log warning
    console.warn('Could not enable pgvector extension:', error.message)
    throw new Error(
      'pgvector extension is required but could not be enabled. Please ensure pgvector is installed in your PostgreSQL database.',
    )
  }
}
