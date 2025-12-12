import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Container } from '@/components/Container'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { AuthorSection, BlogBanner } from '@/features/blogs/components'
import { extractTypedField, formatPublishDate } from '@/features/blogs/lib'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { cn } from '@/lib/utils'
import { cacheTag, cacheLife } from 'next/cache'

// ============================================================================
// REUSABLE FUNCTIONS
// ============================================================================

// Cached version for published blogs (used in static generation)
async function getCachedBlogBySlug(slug: string, depth: number = 2) {
  'use cache: remote'
  cacheLife('max')
  cacheTag('blogs', `blog-${slug}`)

  const payload = await getPayload({ config: configPromise })

  const blogs = await payload.find({
    collection: 'blogs',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    depth,
    limit: 1,
    draft: false,
  })

  return blogs.docs[0] || null
}

// Non-cached version for draft mode
async function getDraftBlogBySlug(slug: string, depth: number = 2) {
  const payload = await getPayload({ config: configPromise })

  const blogs = await payload.find({
    collection: 'blogs',
    where: {
      slug: { equals: slug },
    },
    depth,
    limit: 1,
    draft: true,
  })

  return blogs.docs[0] || null
}

// Wrapper function to choose between cached and draft versions
async function getBlogBySlug(
  slug: string,
  options: { isDraftMode?: boolean; depth?: number } = {},
) {
  const { isDraftMode = false, depth = 2 } = options

  if (isDraftMode) {
    return getDraftBlogBySlug(slug, depth)
  }

  return getCachedBlogBySlug(slug, depth)
}

async function getPublishedBlogs() {
  'use cache'
  cacheLife('max')
  cacheTag('blogs')

  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true },
  })
  return blogs.docs
}

// ============================================================================
// PAGE EXPORTS
// ============================================================================

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs()

  // If no blogs exist, return a placeholder to ensure the dynamic route works
  if (blogs.length === 0) {
    return [{ slug: 'placeholder' }]
  }

  return blogs.map((blog) => ({ slug: blog.slug }))
}

export async function generateMetadata(props: PageProps<'/blogs/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const blog = await getBlogBySlug(params.slug, { depth: 1 })

  if (!blog) {
    return { title: 'Blog Post Not Found' }
  }

  const bannerImage = extractTypedField<{ url?: string | null }>(blog.bannerImage)
  const description = `Read ${blog.title} on AI Blog Hub`

  return {
    title: blog.title,
    description,
    openGraph: {
      title: blog.title,
      description,
      images: bannerImage?.url ? [bannerImage.url] : [],
      type: 'article',
      publishedTime: blog.publishDate,
    },
  }
}

export default async function BlogPostPage(props: PageProps<'/blogs/[slug]'>) {
  'use cache: remote'
  cacheLife('max')

  const params = await props.params

  cacheTag('blogs', `blog-${params.slug}`)

  const { isEnabled: isDraftMode } = await draftMode()
  const blog = await getBlogBySlug(params.slug, { isDraftMode })

  if (!blog) {
    notFound()
  }

  const bannerImage = extractTypedField<{ url?: string | null; alt?: string | null }>(
    blog.bannerImage,
  )
  const author = extractTypedField<{ email: string }>(blog.author)
  const publishDate = formatPublishDate(blog.publishDate)

  return (
    <article className="pt-16 flex-1 flex flex-col">
      {isDraftMode && <RefreshRouteOnSave />}
      <BlogBanner
        bannerImage={bannerImage}
        title={blog.title}
        publishDate={publishDate}
        publishDateRaw={blog.publishDate || ''}
        author={author}
      />

      <div
        className={cn(
          'flex-1 bg-size-[30px_30px]',
          'bg-[radial-gradient(var(--color-neutral-300)_1px,transparent_1px)]',
          'dark:bg-[radial-gradient(var(--color-neutral-700)_1px,transparent_1px)]',
        )}
      >
        <Container className={cn('max-w-3xl flex-1 mt-8')}>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <RichText data={blog.content} />
          </div>

          {author && blog.authorSocialLinks && (
            <AuthorSection author={author} socialLinks={blog.authorSocialLinks} />
          )}
        </Container>
      </div>
    </article>
  )
}
