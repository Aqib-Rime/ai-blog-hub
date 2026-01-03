import { slugField, type CollectionConfig } from 'payload'
import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { defaultVersionConfig } from '@/collections/config/default-version-config'
import { env } from '@/env'
import { afterChangeHook, afterDeleteHook } from './blog.hooks'

export const Blog: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishDate', 'updatedAt'],
    preview: (doc) => {
      const baseUrl = env.NEXT_PUBLIC_SERVER_URL
      const secret = env.PAYLOAD_PREVIEW_SECRET || ''
      return `${baseUrl}/api/preview?secret=${secret}&slug=${doc.slug}&collection=blogs`
    },
    livePreview: {
      url: ({ data }) => {
        const baseUrl = env.NEXT_PUBLIC_SERVER_URL
        return `${baseUrl}/api/preview?slug=${data?.slug}&collection=blogs&secret=${env.PAYLOAD_PREVIEW_SECRET}`
      },
    },
  },
  versions: defaultVersionConfig,
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features({ defaultFeatures, rootFeatures }) {
                  return [
                    ...defaultFeatures,
                    ...rootFeatures,
                    HeadingFeature({
                      enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'],
                    }),
                    BlocksFeature({
                      blocks: ['imageBlock'],
                    }),
                  ]
                },
              }),
            },
          ],
        },
        {
          label: 'Author',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              required: true,
            },
            {
              name: 'authorSocialLinks',
              type: 'group',
              fields: [
                {
                  name: 'twitter',
                  type: 'text',
                  admin: {
                    description: 'Twitter/X profile URL',
                  },
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  admin: {
                    description: 'LinkedIn profile URL',
                  },
                },
                {
                  name: 'github',
                  type: 'text',
                  admin: {
                    description: 'GitHub profile URL',
                  },
                },
                {
                  name: 'website',
                  type: 'text',
                  admin: {
                    description: 'Personal website URL',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Metadata',
          fields: [
            slugField({
              required: true,
            }),
            {
              name: 'bannerImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Banner image displayed at the top of the blog post',
              },
            },
            {
              name: 'thumbnailImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Thumbnail image for blog previews and cards',
              },
            },
            {
              name: 'publishDate',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
