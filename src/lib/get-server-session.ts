import { getPayload } from '@/lib/payload'
import { headers as requestHeaders } from 'next/headers'

export const getSession = async () => {
  const payload = await getPayload()
  const headers = await requestHeaders()
  type Session = (typeof payload.betterAuth.$Infer)['Session']
  const session = (await payload.betterAuth.api.getSession({ headers })) as Session
  return session
}

export const getCurrentUser = async () => {
  const payload = await getPayload()
  const headers = await requestHeaders()
  const { user } = await payload.auth({ headers })
  return user
}
