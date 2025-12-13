import { getPayload } from '@/lib/payload'
import { headers as requestHeaders } from 'next/headers'
import type { User as PayloadUser } from '@/payload-types'

// Extract the inferred types from payload-auth
type PayloadWithBetterAuth = Awaited<ReturnType<typeof getPayload>>
type InferredSession = PayloadWithBetterAuth['betterAuth']['$Infer']['Session']
type InferredUser = InferredSession['user']

// Combine better-auth inferred user with Payload's custom fields
// This picks custom Payload fields (like bh-roles) that aren't in the inferred type
type PayloadCustomFields = Omit<PayloadUser, keyof InferredUser>
type FullUser = InferredUser & PayloadCustomFields

// Session type with the combined user type
export type BetterAuthSession = Omit<InferredSession, 'user'> & {
  user: FullUser
}

export const getSession = async () => {
  const payload = await getPayload()
  const headers = await requestHeaders()
  const session = await payload.betterAuth.api.getSession({ headers })
  // The session user includes Payload custom fields at runtime
  return session as BetterAuthSession | null
}

export const getCurrentUser = async () => {
  const payload = await getPayload()
  const headers = await requestHeaders()
  const { user } = await payload.auth({ headers })
  // payload.auth() returns the full Payload user with all fields
  return user as FullUser | null
}

// Re-export types for convenience
export type { FullUser, InferredSession, InferredUser }
