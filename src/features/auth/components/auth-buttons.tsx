'use client'

import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { UserMenu } from './user-menu'

export function AuthButtons() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (session?.user) {
    return <UserMenu />
  }

  return (
    <>
      <Button variant="outline" asChild>
        <Link href="/auth/sign-in">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </>
  )
}
