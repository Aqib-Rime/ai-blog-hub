import { toNextJsHandler } from 'better-auth/next-js'
import { getPayload } from '@/lib/payload'

const handler = async (request: Request) => {
  const payload = await getPayload()
  const { POST, GET } = toNextJsHandler(payload.betterAuth)

  if (request.method === 'GET') {
    return GET(request)
  }
  return POST(request)
}

export { handler as GET, handler as POST }
