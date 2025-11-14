import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Payload CMS
    PAYLOAD_SECRET: z.string().min(1),
    DATABASE_URI: z.string().url(),
    PAYLOAD_PREVIEW_SECRET: z.string().min(1).optional(),
    REVALIDATE_SECRET: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_PAYLOAD_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    // Server
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    DATABASE_URI: process.env.DATABASE_URI,
    PAYLOAD_PREVIEW_SECRET: process.env.PAYLOAD_PREVIEW_SECRET,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    // Client
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_PAYLOAD_URL: process.env.NEXT_PUBLIC_PAYLOAD_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
