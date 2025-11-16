'use client'

import { usePathname } from 'next/navigation'
import { ChatWidget } from './ChatWidget'

export function ChatWidgetWrapper() {
  const pathname = usePathname()

  // Extract slug from pathname if on blog page (/blogs/[slug])
  const blogMatch = pathname?.match(/^\/blogs\/([^/]+)$/)
  const blogSlug = blogMatch ? blogMatch[1] : undefined

  return <ChatWidget blogSlug={blogSlug} />
}
