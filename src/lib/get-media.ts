import { Media } from '@/payload-types'
import { getPayload } from './payload'

export async function getMedia(media: Media | number) {
  if (typeof media === 'number') {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: 'media',
      where: {
        id: {
          equals: media,
        },
      },
    })
    if (docs.length === 0) {
      return null
    }
    return docs[0]
  }
  return media
}
