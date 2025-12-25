'use client'

import type { Blog } from '@/payload-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { format } from 'date-fns'
import Link from 'next/link'
import type { Route } from 'next'
import posthog from 'posthog-js'

export function BlogCard({ blog }: { blog: Blog }) {
  const thumbnailImage = typeof blog.thumbnailImage === 'object' ? blog.thumbnailImage : null
  const author = typeof blog.author === 'object' ? blog.author : null
  const publishDate = blog.publishDate ? format(new Date(blog.publishDate), 'MMM d, yyyy') : ''

  const handleClick = () => {
    // PostHog: Track blog card click
    posthog.capture('blog_card_clicked', {
      blog_slug: blog.slug,
      blog_title: blog.title,
      blog_id: blog.id,
      author_email: author?.email,
      publish_date: blog.publishDate,
    })
  }

  return (
    <Link className="relative z-10" href={`/blogs/${blog.slug}` as Route} onClick={handleClick}>
      <Card className="overflow-hidden hover:shadow-lg p-0 transition-shadow cursor-pointer h-full flex flex-col">
        {thumbnailImage?.url && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={thumbnailImage.url}
              alt={thumbnailImage.alt || blog.title}
              fill
              className="object-cover object-bottom"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
          <CardDescription>
            {publishDate && <span>{publishDate}</span>}
            {author && typeof author === 'object' && author.email && (
              <span className="ml-2">by {author.email}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {/* You can add a description field or extract text from content */}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
