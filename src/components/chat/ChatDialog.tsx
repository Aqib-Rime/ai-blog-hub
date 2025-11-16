'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat, type UIMessage } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Loader2, Bot, User, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'

interface ChatDialogProps {
  blogSlug?: string
  onClose?: () => void
}

export function ChatDialog({ blogSlug, onClose }: ChatDialogProps) {
  const [input, setInput] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        blogSlug,
      },
    }),
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: blogSlug
              ? "Hi! I'm here to help answer questions about this blog post. What would you like to know?"
              : "Hi! I'm here to help answer questions about our blog posts. What would you like to know?",
          },
        ],
      },
    ],
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const renderMessageContent = (textParts: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')
            const codeId = `${node?.position?.start?.line || Math.random()}`

            return !inline && match ? (
              <div className="relative group my-4">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b text-xs">
                  <span className="text-muted-foreground">{match[1]}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(codeString, codeId)}
                  >
                    {copiedCode === codeId ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <SyntaxHighlighter
                  style={theme === 'dark' ? oneDark : oneLight}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-b-lg"
                  customStyle={{ margin: 0 }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            )
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-border border border-border rounded-lg">
                  {children}
                </table>
              </div>
            )
          },
          thead({ children }) {
            return <thead className="bg-muted">{children}</thead>
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-border">{children}</tbody>
          },
          tr({ children }) {
            return <tr>{children}</tr>
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                {children}
              </th>
            )
          },
          td({ children }) {
            return <td className="px-4 py-2 text-sm text-foreground">{children}</td>
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>
          },
          ul({ children }) {
            return <ul className="my-2 ml-6 list-disc space-y-1">{children}</ul>
          },
          ol({ children }) {
            return <ol className="my-2 ml-6 list-decimal space-y-1">{children}</ol>
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-2 border-l-4 border-primary pl-4 italic">
                {children}
              </blockquote>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                {children}
              </a>
            )
          },
          h1({ children }) {
            return <h1 className="mb-2 mt-4 text-2xl font-bold">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="mb-2 mt-4 text-xl font-bold">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="mb-2 mt-4 text-lg font-semibold">{children}</h3>
          },
          hr() {
            return <hr className="my-4 border-border" />
          },
        }}
      >
        {textParts}
      </ReactMarkdown>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-3 sm:px-4 py-4 sm:py-6" ref={scrollAreaRef}>
        <div className="flex flex-col gap-3 sm:gap-4 min-h-full pb-4">
          {messages.map((message: UIMessage) => {
            const textParts = message.parts
              .filter((part) => part.type === 'text')
              .map((part) => (part.type === 'text' ? part.text : ''))
              .join('')

            const isUser = message.role === 'user'

            return (
              <div
                key={message.id}
                className={cn('flex gap-3 w-full', isUser ? 'justify-end' : 'justify-start')}
              >
                {!isUser && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 max-w-[80%] shadow-sm',
                    isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                  )}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{textParts}</div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {renderMessageContent(textParts)}
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            )
          })}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex gap-3 justify-start">
              <div className="shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-destructive" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-destructive/10 text-destructive text-sm">
                {error.message || 'An error occurred. Please try again.'}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-3 sm:p-4 bg-background shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              blogSlug ? 'Ask a question about this blog...' : 'Ask a question about our blogs...'
            }
            className="flex-1 min-h-[56px] sm:min-h-[60px] max-h-[120px] resize-none text-sm sm:text-base"
            disabled={status !== 'ready'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            rows={1}
          />
          <Button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            size="icon"
            className="size-[56px] sm:size-[60px] rounded-xl shrink-0"
          >
            {isLoading ? (
              <Loader2 className="size-4 sm:size-5 animate-spin" />
            ) : (
              <Send className="size-4 sm:size-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
