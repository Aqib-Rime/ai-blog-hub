import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@/features/navbar/navbar'
import type { Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'AI Blog Hub',
  description:
    'AI Blog Hub is a powerful platform for creating, publishing, and exploring blogs, enhanced with integrated AI chat features to help you get instant answers and inspiration.',
  keywords: ['AI', 'blog', 'chatbot', 'writing', 'platform', 'technology', 'content creation'],
  creator: 'AI Blog Hub Team',
  openGraph: {
    title: 'AI Blog Hub',
    description: 'Create, share, and interact with AI-powered blogs.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  )
}
