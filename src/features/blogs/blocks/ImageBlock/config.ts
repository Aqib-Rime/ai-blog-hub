import { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  interfaceName: 'ImageBlock',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
      admin: {
        description: 'Add a caption to the image',
      },
    },
  ],
  labels: {
    singular: 'Image',
    plural: 'Images',
  },
}
