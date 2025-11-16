import type { CollectionConfig } from 'payload'

export const BlogEmbeddings: CollectionConfig = {
  slug: 'blog-embeddings',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['blog', 'chunkIndex', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => false, // Only created programmatically
    update: () => false, // Only updated programmatically
    delete: () => false, // Only deleted programmatically
  },
  fields: [
    {
      name: 'blog',
      type: 'relationship',
      relationTo: 'blogs',
      required: true,
      index: true,
    },
    {
      name: 'chunkIndex',
      type: 'number',
      required: true,
      admin: {
        description: 'Index of the chunk within the blog post',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Text content of this chunk',
      },
    },
    {
      name: 'embedding',
      type: 'json',
      required: true,
      admin: {
        description: 'Vector embedding stored as JSON array',
      },
    },
  ],
  indexes: [
    {
      fields: ['blog'],
    },
    {
      fields: ['blog', 'chunkIndex'],
      unique: true,
    },
  ],
}
