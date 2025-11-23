import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'
import { upsertBlogEmbeddings, deleteBlogEmbeddings } from '@/lib/blog-embeddings'

export const afterChangeHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  const isPublished = doc._status === 'published'
  const wasPublished = previousDoc?._status === 'published' && doc._status !== 'published'

  // Revalidate homepage if status changed (published/unpublished) or if blog is published
  if (isPublished) {
    revalidatePath('/')
    revalidatePath(`/blogs/${doc.slug}`)
  }
  if (wasPublished) {
    revalidatePath('/')
    revalidatePath(`/blogs/${previousDoc.slug}`)
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
  // Only revalidate if the deleted blog was published
  if (doc._status === 'published' && doc.slug) {
    revalidatePath(`/blogs/${doc.slug}`)
    // Revalidate the homepage to remove it from listing
    revalidatePath('/')
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
