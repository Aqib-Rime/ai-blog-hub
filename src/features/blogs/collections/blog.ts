import { slugField, type CollectionConfig } from 'payload'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { defaultVersionConfig } from '@/collections/config/default-version-config'

export const Blog: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishDate', 'updatedAt'],
  },
  versions: defaultVersionConfig,
  access: {
    read: () => true,
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
