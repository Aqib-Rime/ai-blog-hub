import { BlogPage } from '@/features/blogs/components/BlogPage'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true },
  })
  return blogs.docs.map((blog) => ({ slug: blog.slug }))
}

export async function generateMetadata(props: PageProps<'/blogs/[slug]'>): Promise<Metadata> {
  'use cache'
  cacheLife('max')

  const params = await props.params

  cacheTag(`blog-page-metadata-${params.slug}`)

  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: params.slug } },
    limit: 1,
    draft: false,
  })

  if (blogs.docs.length === 0) {
    return { title: 'Blog Post Not Found' }
  }

  const blog = blogs.docs[0]

  return {
    title: blog.title,
  }
}

export default async function BlogPostPage(props: PageProps<'/blogs/[slug]'>) {
  const params = await props.params
  const { isEnabled: isDraftMode } = await draftMode()

  return <BlogContent isDraftMode={isDraftMode} slug={params.slug} />
}

async function BlogContent({ isDraftMode, slug }: { isDraftMode: boolean; slug: string }) {
  'use cache'
  cacheLife('max')
  cacheTag(`blog-page-${slug}`)

  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: slug } },
    limit: 1,
    draft: isDraftMode,
  })

  if (blogs.docs.length === 0) {
    notFound()
  }

  return <BlogPage blog={blogs.docs[0]} isDraftMode={isDraftMode} />
}
