import configPromise from '@payload-config'
import { getPayloadAuth } from 'payload-auth/better-auth'
import type { ConstructedBetterAuthPluginOptions } from '@/features/auth/lib/options'

export const getPayload = async () =>
  getPayloadAuth<ConstructedBetterAuthPluginOptions>(configPromise)
