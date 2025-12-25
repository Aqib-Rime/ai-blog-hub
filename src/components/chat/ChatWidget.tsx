'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChatDialog } from './ChatDialog'
import { cn } from '@/lib/utils'
import posthog from 'posthog-js'

interface ChatWidgetProps {
  blogSlug?: string
}

export function ChatWidget({ blogSlug }: ChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Floating Chat Button - Fixed to viewport */}
      {!open && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-none">
          <Button
            onClick={() => {
              setOpen(true)
              // PostHog: Track chat opened
              posthog.capture('chat_opened', {
                blog_slug: blogSlug || null,
                context: blogSlug ? 'blog_page' : 'global',
              })
            }}
            className={cn(
              'size-14 rounded-full shadow-lg',
              'bg-primary hover:bg-primary/90 text-primary-foreground',
              'transition-all duration-300 ease-in-out',
              'hover:scale-110 active:scale-95',
              'flex items-center justify-center',
              'group relative pointer-events-auto',
            )}
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            {/* Pulse animation ring */}
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
          </Button>
        </div>
      )}

      {/* Chat Dialog */}
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            // PostHog: Track chat closed
            posthog.capture('chat_closed', {
              blog_slug: blogSlug || null,
              context: blogSlug ? 'blog_page' : 'global',
            })
          }
          setOpen(isOpen)
        }}
      >
        <DialogContent className="max-w-2xl h-[85vh] sm:h-[80vh] flex flex-col p-0 gap-0 max-h-[calc(100vh-2rem)]">
          <DialogHeader className="px-4 sm:px-6 py-4 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MessageCircle className="h-5 w-5" />
              AI Assistant
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0">
            <ChatDialog blogSlug={blogSlug} onClose={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
