import { Container } from '@/components/Container'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { BlogMetadataProps, BlogBannerProps } from '../types/blog-page.types'

export function BlogMetadata({ publishDate, publishDateRaw, author, className }: BlogMetadataProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      {publishDate && (
        <time dateTime={publishDateRaw} className="text-sm">
          {publishDate}
        </time>
      )}
      {author && (
        <div className="flex items-center gap-2 text-sm">
          <span>by</span>
          <span className="font-medium">{author.email}</span>
        </div>
      )}
    </div>
  )
}

export function BlogBanner({ bannerImage, title, publishDate, publishDateRaw, author }: BlogBannerProps) {
  if (bannerImage?.url) {
    return (
      <div className="relative w-full h-[200px] md:h-[300px]">
        <Image
          src={bannerImage.url}
          alt={bannerImage.alt || title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0">
          <div className="py-4 md:py-6">
            <Container className="max-w-3xl">
              <header>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{title}</h1>
                <BlogMetadata
                  publishDate={publishDate}
                  publishDateRaw={publishDateRaw}
                  author={author}
                  className="text-white/90"
                />
              </header>
            </Container>
          </div>
        </div>
      </div>
    )
  }

  return (
    <header>
      <Container className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <BlogMetadata
          publishDate={publishDate}
          publishDateRaw={publishDateRaw}
          author={author}
          className="text-muted-foreground"
        />
      </Container>
    </header>
  )
}
