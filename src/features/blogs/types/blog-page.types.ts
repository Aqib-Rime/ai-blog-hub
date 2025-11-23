export type BlogMetadataProps = {
  publishDate: string
  publishDateRaw: string
  author: { email: string } | null
  className?: string
}

export type BlogBannerProps = {
  bannerImage: { url?: string | null; alt?: string | null } | null
  title: string
  publishDate: string
  publishDateRaw: string
  author: { email: string } | null
}
