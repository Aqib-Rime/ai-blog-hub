import { revalidateTag } from 'next/cache'

/**
 * Revalidates cached blog data after blog changes.
 *
 * Use this function in Payload CMS hooks (afterChange, afterDelete) to
 * invalidate the Next.js cache when blogs are created, updated, or deleted.
 *
 * @param slug - Optional blog slug to revalidate specific blog. If not provided, revalidates all blogs.
 *
 * @example
 * // In Payload collection config hooks:
 * afterChange: [
 *   ({ doc }) => {
 *     revalidateBlog(doc.slug)
 *   }
 * ]
 *
 * @example
 * // To revalidate all blogs:
 * afterDelete: [
 *   () => {
 *     revalidateBlog()
 *   }
 * ]
 */
export function revalidateBlog(slug?: string) {
  if (slug) {
    // Revalidate specific blog and the blogs list
    revalidateTag(`blog-${slug}`, 'max')
    revalidateTag('blogs', 'max')
  } else {
    // Revalidate all blogs
    revalidateTag('blogs', 'max')
  }
}
