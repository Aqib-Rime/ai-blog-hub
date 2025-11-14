import Link from 'next/link'
import { Github, Linkedin, Twitter, Globe } from 'lucide-react'
import type { Route } from 'next'

export function AuthorSection({
  author,
  socialLinks,
}: {
  author: { email: string }
  socialLinks: {
    twitter?: string | null
    linkedin?: string | null
    github?: string | null
    website?: string | null
  }
}) {
  const hasSocialLinks =
    socialLinks.twitter || socialLinks.linkedin || socialLinks.github || socialLinks.website

  if (!hasSocialLinks) return null

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-semibold mb-4">About the Author</h2>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="font-medium text-lg">{author.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {socialLinks.twitter && (
            <Link
              href={socialLinks.twitter as Route}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Link>
          )}
          {socialLinks.linkedin && (
            <Link
              href={socialLinks.linkedin as Route}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          )}
          {socialLinks.github && (
            <Link
              href={socialLinks.github as Route}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
          )}
          {socialLinks.website && (
            <Link
              href={socialLinks.website as Route}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Website"
            >
              <Globe className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

