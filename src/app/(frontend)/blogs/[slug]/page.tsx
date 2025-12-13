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
  const params = blogs.docs.map((blog) => ({ slug: blog.slug }))
  if (params.length === 0) {
    return [{ slug: '_placeholder' }]
  }
  return params
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
  'use cache'
  cacheLife('max')

  const { slug } = await props.params

  cacheTag(`blog-page-${slug}`)

  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: slug } },
    limit: 1,
    draft: (await draftMode()).isEnabled,
  })

  if (blogs.docs.length === 0) {
    notFound()
  }

  return <BlogPage blog={blogs.docs[0]} />
}
