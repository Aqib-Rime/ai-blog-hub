import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Container } from '@/components/Container'
import Image from 'next/image'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { AuthorSection } from '@/features/blogs/components'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'

// Cache the function to fetch published blogs
const getPublishedBlogs = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 1000, // Adjust limit as needed
    select: {
      slug: true,
    },
  })
  return blogs.docs
})

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export async function generateMetadata(props: PageProps<'/blogs/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const payload = await getPayload({ config: configPromise })

  const blogs = await payload.find({
    collection: 'blogs',
    where: {
      slug: {
        equals: params.slug,
      },
      _status: {
        equals: 'published',
      },
    },
    depth: 1,
    limit: 1,
  })

  const blog = blogs.docs[0]

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  const bannerImage = typeof blog.bannerImage === 'object' ? blog.bannerImage : null

  return {
    title: blog.title,
    description: `Read ${blog.title} on AI Blog Hub`,
    openGraph: {
      title: blog.title,
      description: `Read ${blog.title} on AI Blog Hub`,
      images: bannerImage?.url ? [bannerImage.url] : [],
      type: 'article',
      publishedTime: blog.publishDate,
    },
  }
}

export default async function BlogPostPage(props: PageProps<'/blogs/[slug]'>) {
  const params = await props.params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const blogs = await payload.find({
    collection: 'blogs',
    where: {
      slug: {
        equals: params.slug,
      },
      ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
    },
    depth: 2,
    limit: 1,
    draft: isDraftMode,
  })

  const blog = blogs.docs[0]

  if (!blog) {
    notFound()
  }

  const bannerImage = typeof blog.bannerImage === 'object' ? blog.bannerImage : null
  const author = typeof blog.author === 'object' ? blog.author : null
  const publishDate = blog.publishDate ? format(new Date(blog.publishDate), 'MMMM d, yyyy') : ''

  return (
    <article className="pt-16 pb-16">
      {isDraftMode && <RefreshRouteOnSave />}
      {bannerImage?.url ? (
        <div className="relative w-full h-[200px] md:h-[300px] mb-8">
          <Image
            src={bannerImage.url}
            alt={bannerImage.alt || blog.title}
            fill
            className="object-cover"
            priority
          />
          {/* Black gradient overlay from bottom */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          {/* Header content overlaid on image */}
          <div className="absolute bottom-0 inset-x-0">
            <div className="py-4 md:py-6">
              <Container className="max-w-3xl">
                <header>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{blog.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/90">
                    {publishDate && (
                      <time dateTime={blog.publishDate} className="text-sm">
                        {publishDate}
                      </time>
                    )}
                    {author && typeof author === 'object' && (
                      <div className="flex items-center gap-2 text-sm">
                        <span>by</span>
                        <span className="font-medium">{author.email}</span>
                      </div>
                    )}
                  </div>
                </header>
              </Container>
            </div>
          </div>
        </div>
      ) : (
        <header className="mb-8">
          <Container className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {publishDate && <time dateTime={blog.publishDate}>{publishDate}</time>}
              {author && typeof author === 'object' && (
                <div className="flex items-center gap-2">
                  <span>by</span>
                  <span className="font-medium text-foreground">{author.email}</span>
                </div>
              )}
            </div>
          </Container>
        </header>
      )}

      <Container className="max-w-3xl">
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <RichText data={blog.content} />
        </div>

        {author && typeof author === 'object' && blog.authorSocialLinks && (
          <AuthorSection author={author} socialLinks={blog.authorSocialLinks} />
        )}
      </Container>
    </article>
  )
}
