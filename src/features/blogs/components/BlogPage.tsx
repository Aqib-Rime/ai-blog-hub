import { Container } from '@/components/Container'
import { Blog, Media, User } from '@/payload-types'
import { AuthorSection } from './AuthorSection'
import { extractTypedField, formatPublishDate } from '../lib/blog-helpers'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { BlogBanner } from './BlogPageComponents'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/lib/utils'
import { draftMode } from 'next/headers'

export async function BlogPage({ blog }: { blog: Blog }) {
  const { isEnabled: isDraftMode } = await draftMode()
  const publishDate = formatPublishDate(blog.publishDate)

  return (
    <article className="pt-16 flex-1 flex flex-col">
      {isDraftMode && <RefreshRouteOnSave />}
      <BlogBanner
        bannerImage={blog.bannerImage as Media}
        title={blog.title}
        publishDate={publishDate}
        publishDateRaw={blog.publishDate || ''}
        author={{
          email: (blog.author as User).email,
        }}
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

          {blog.author && (
            <AuthorSection
              author={{ email: (blog.author as User).email }}
              socialLinks={blog.authorSocialLinks as Blog['authorSocialLinks']}
            />
          )}
        </Container>
      </div>
    </article>
  )
}
