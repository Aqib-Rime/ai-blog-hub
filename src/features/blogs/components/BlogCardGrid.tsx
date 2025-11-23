import { BlogCard } from './BlogCard'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cacheLife, cacheTag } from 'next/cache'

export async function BlogCardGrid() {
  'use cache'
  cacheLife('max')
  cacheTag('blogs')

  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    limit: 20,
    where: {
      _status: {
        equals: 'published',
      },
    },
    depth: 2,
  })
  if (blogs.docs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No blog posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.docs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}
