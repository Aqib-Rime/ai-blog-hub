// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Blog } from './features/blogs/collections/blog'
import { BlogEmbeddings } from './collections/BlogEmbeddings'
import { payloadAuth } from './features/auth/plugin'
import { env } from './env'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users', // Created by better-auth plugin
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1920,
          height: 1080,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
      ],
    },
  },
  collections: [Media, Blog, BlogEmbeddings],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    payloadAuth(),
    s3Storage({
      collections: {
        media: {
          prefix: 'ai-blog-hub-media',
          disableLocalStorage: true,
          disablePayloadAccessControl: true, // Required for public R2 bucket access
          generateFileURL: ({ filename, prefix }) => {
            const filePrefix = prefix ? `${prefix}/` : ''
            return `${env.R2_PUBLIC_URL}/${filePrefix}${filename}`
          },
        },
      },
      bucket: env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT,
      },
    }),
  ],
})
