import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Payload CMS
    PAYLOAD_SECRET: z.string().min(1),
    DATABASE_URI: z.string().url(),
    PAYLOAD_PREVIEW_SECRET: z.string().min(1).optional(),
    REVALIDATE_SECRET: z.string().min(1).optional(),
    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(1),
    // AI/Embeddings
    GEMINI_API_KEY: z.string().min(1),
    GROQ_API_KEY: z.string().min(1),

    // S3/R2 Storage
    S3_BUCKET: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_REGION: z.string(),
    S3_ENDPOINT: z.string().optional(),
    R2_PUBLIC_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string(),
    // PostHog Analytics
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.url(),
  },
  runtimeEnv: {
    // Server
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    DATABASE_URI: process.env.DATABASE_URI,
    PAYLOAD_PREVIEW_SECRET: process.env.PAYLOAD_PREVIEW_SECRET,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    // Client
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,

    // S3/R2 Storage
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
