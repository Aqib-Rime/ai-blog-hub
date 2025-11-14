import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const collection = searchParams.get('collection') || 'blogs'

  // Validate the secret
  if (secret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Validate slug
  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }

  // Fetch the document to verify it exists
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: collection as 'blogs',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      draft: true,
    })

    if (!result.docs[0]) {
      return new Response('Document not found', { status: 404 })
    }

    // Enable draft mode
    const draft = await draftMode()
    draft.enable()
  } catch (error) {
    console.error(error)
    return new Response('Error fetching document', { status: 500 })
  }
  // Redirect to the preview page
  redirect(`/blogs/${slug}`)
}
