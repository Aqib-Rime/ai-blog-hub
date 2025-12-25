'use client'

import { createAuthClient } from 'better-auth/react'
import { toast } from 'sonner'
import { env } from '@/env'

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.')
      }
    },
  },
})

export const { signUp, signIn, signOut, useSession } = authClient
