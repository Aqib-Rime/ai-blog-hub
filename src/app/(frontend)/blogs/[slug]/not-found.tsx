import Link from 'next/link'
import { Container } from '@/components/Container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="pt-16 pb-16">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}

