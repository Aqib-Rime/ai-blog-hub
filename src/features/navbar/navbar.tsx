import { Container } from '@/components/Container'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border/40">
      <Container className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <AIBlogHubLogo />
          <h2 className="text-xl font-bold mt-1">AI Blog HUB</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Login</Button>
          <Button>Sign up</Button>
        </div>
      </Container>
    </nav>
  )
}

const AIBlogHubLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        fill="none"
        aria-label="AI Blog Hub Logo"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* Modern geometric A shape */}
        <path d="M20 8L28 32H24L22.5 27H17.5L16 32H12L20 8Z" fill="url(#logoGradient)" />
        <path d="M20 12L16.5 24H23.5L20 12Z" fill="white" fillOpacity="0.9" />
        {/* Blog/document element */}
        <rect
          x="24"
          y="14"
          width="8"
          height="10"
          rx="1"
          fill="url(#logoGradient)"
          fillOpacity="0.2"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
        />
        <line
          x1="26"
          y1="17"
          x2="30"
          y2="17"
          stroke="url(#logoGradient)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="26"
          y1="19.5"
          x2="30"
          y2="19.5"
          stroke="url(#logoGradient)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="26"
          y1="22"
          x2="29"
          y2="22"
          stroke="url(#logoGradient)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
