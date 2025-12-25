import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@/features/navbar/navbar'
import type { Metadata, Viewport } from 'next'
import { env } from '@/env'
import { ThemeProvider } from '@/components/theme-provider'
import { ChatWidgetWrapper } from '@/components/chat/ChatWidgetWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL),
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative bg-background flex flex-col min-h-screen antialiased">
            <Navbar />
            {children}
          </main>
          <ChatWidgetWrapper />
        </ThemeProvider>
      </body>
    </html>
  )
}
