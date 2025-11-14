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
        <div className="flex items-center gap-2">
          <Button variant="outline">Login</Button>
          <Button>Sign up</Button>
        </div>
      </Container>
    </nav>
  )
}

const AIBlogHubLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-blocks"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 4a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z" />
      <path d="M3 14h12a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h3a2 2 0 0 1 2 2v12" />
    </svg>
  )
}
