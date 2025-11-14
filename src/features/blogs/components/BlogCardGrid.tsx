import type { Blog } from '@/payload-types'
import { BlogCard } from './BlogCard'

export function BlogCardGrid({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No blog posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

