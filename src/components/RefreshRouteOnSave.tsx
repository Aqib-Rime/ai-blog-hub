'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { env } from '@/env'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()

  // Client components can only access NEXT_PUBLIC_* variables directly
  const serverURL = env.NEXT_PUBLIC_SERVER_URL

  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={serverURL} />
}
