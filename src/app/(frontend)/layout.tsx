import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Blog Hub',
  description:
    'AI Blog Hub is a powerful platform for creating, publishing, and exploring blogs, enhanced with integrated AI chat features to help you get instant answers and inspiration.',
  keywords: ['AI', 'blog', 'chatbot', 'writing', 'platform', 'technology', 'content creation'],
  creator: 'AI Blog Hub Team',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'AI Blog Hub',
    description: 'Create, share, and interact with AI-powered blogs.',
    type: 'website',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}
