import type { BetterAuthOptions, BetterAuthPluginOptions } from 'payload-auth/better-auth'
import { nextCookies } from 'better-auth/next-js'
import type { BetterAuthPlugin as BetterAuthPluginType } from 'better-auth/types'
import { env } from '@/env'

// Minimal plugins - only what's needed for Next.js cookie handling
export const betterAuthPlugins = [nextCookies()] satisfies BetterAuthPluginType[]

export type BetterAuthPlugins = typeof betterAuthPlugins

export const betterAuthOptions = {
  appName: 'ai-blog-hub',
  trustedOrigins: [env.NEXT_PUBLIC_SERVER_URL],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production with email setup
    async sendResetPassword({ user, url }) {
      console.log('Send reset password for user:', user.id, 'at url:', url)
      // TODO: Implement email sending for password reset
    },
  },
  emailVerification: {
    sendOnSignUp: false, // Set to true in production with email setup
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      console.log('Send verification email for user:', user.email, 'at url:', url)
      // TODO: Implement email sending for verification
    },
  },
  plugins: betterAuthPlugins,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
    },
  },
} satisfies BetterAuthOptions

export type ConstructedBetterAuthOptions = typeof betterAuthOptions

export const betterAuthPluginOptions = {
  disabled: false,
  debug: {
    logTables: false,
    enableDebugLogs: false,
  },
  disableDefaultPayloadAuth: true,
  hidePluginCollections: true,
  users: {
    slug: 'users',
    hidden: false,
    adminRoles: ['admin'],
    defaultRole: 'user',
    defaultAdminRole: 'admin',
    roles: ['user', 'admin'] as const,
    allowedFields: ['name'],
    collectionOverrides: ({ collection }) => {
      collection.fields.push({
        name: 'bh-roles',
        type: 'select',
        options: ['admin', 'user', 'editor'],
        defaultValue: 'user',
        hasMany: true,
        admin: {
          description: 'The roles of the bh user',
        },
      })
      collection.admin?.defaultColumns?.push('bh-roles')
      collection.admin?.defaultColumns?.push('name')
      collection.admin?.defaultColumns?.push('email-verified')
      return collection
    },
  },
  accounts: {
    slug: 'accounts',
  },
  sessions: {
    slug: 'sessions',
  },
  verifications: {
    slug: 'verifications',
  },
  betterAuthOptions: betterAuthOptions,
} satisfies BetterAuthPluginOptions

export type ConstructedBetterAuthPluginOptions = typeof betterAuthPluginOptions
