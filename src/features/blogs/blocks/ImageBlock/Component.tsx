import { getMedia } from '@/lib/get-media'
import { ImageBlock } from '@/payload-types'
import { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import Image from 'next/image'

export const ImageBlockComponent = async ({ node }: { node: SerializedBlockNode<ImageBlock> }) => {
  const { image, caption, id } = node.fields

  if (!image) {
    return null
  }

  const media = await getMedia(image)

  if (!media || !media.url) {
    return null
  }

  return (
    <div className="relative w-full aspect-video" id={id}>
      <Image src={media.url} alt={caption || media.alt} fill />
      {caption && <p>{caption}</p>}
    </div>
  )
}
