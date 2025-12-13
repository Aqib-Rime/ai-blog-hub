import { betterAuthPlugin } from 'payload-auth/better-auth'
import { betterAuthPluginOptions } from './lib/options'

export const payloadAuth = () => betterAuthPlugin(betterAuthPluginOptions)
