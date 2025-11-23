import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { upsertBlogEmbeddings, deleteBlogEmbeddings } from '@/lib/blog-embeddings'
import { revalidateBlog } from '@/features/blogs/lib'

export const afterChangeHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  const isPublished = doc._status === 'published'
  const wasPublished = previousDoc?._status === 'published' && doc._status !== 'published'

  // Revalidate cached blog data using cache tags
  if (isPublished) {
    revalidateBlog(doc.slug)
  }
  if (wasPublished) {
    revalidateBlog(previousDoc.slug)
  }

  // Generate embeddings when blog is published or updated
  if (isPublished && doc.content && doc.id) {
    try {
      await upsertBlogEmbeddings(req.payload, doc.id, doc.content)
    } catch (error) {
      console.error('Error generating embeddings for blog:', error)
      // Don't throw - allow the blog to be saved even if embeddings fail
    }
  } else if (wasPublished && doc.id) {
    // Delete embeddings if blog is unpublished
    try {
      await deleteBlogEmbeddings(req.payload, doc.id)
    } catch (error) {
      console.error('Error deleting embeddings for blog:', error)
    }
  }
}

export const afterDeleteHook: CollectionAfterDeleteHook = async ({ doc, req }) => {
  // Revalidate cached blog data when blog is deleted
  if (doc._status === 'published' && doc.slug) {
    revalidateBlog(doc.slug)
  }

  // Delete embeddings when blog is deleted
  if (doc.id) {
    try {
      await deleteBlogEmbeddings(req.payload, doc.id)
    } catch (error) {
      console.error('Error deleting embeddings for blog:', error)
    }
  }
}
