import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Container } from '@/components/Container'
import { BlogCardGrid } from '@/features/blogs/components'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'

export default async function HomePage() {
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

  return (
    <div className="pt-16 pb-16">
      <BackgroundRippleEffect />
      <Container>
        <div className="mt-8 mb-4">
          <h1 className="text-4xl font-bold mb-2 relative z-10 w-fit">Latest Blog Posts</h1>
          <p className="text-muted-foreground relative z-10 w-fit">
            Discover insights, stories, and ideas from our community
          </p>
        </div>
        <BlogCardGrid blogs={blogs.docs} />
      </Container>
    </div>
  )
}
