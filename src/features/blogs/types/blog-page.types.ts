import { Media } from '@/payload-types'

export type BlogMetadataProps = {
  publishDate: string
  publishDateRaw: string
  author: { email: string } | null
  className?: string
}

export type BlogBannerProps = {
  bannerImage: Media | null
  title: string
  publishDate: string
  publishDateRaw: string
  author: { email: string } | null
}
