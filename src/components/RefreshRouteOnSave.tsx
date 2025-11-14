'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()

  // Client components can only access NEXT_PUBLIC_* variables directly
  const serverURL =
    process.env.NEXT_PUBLIC_PAYLOAD_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'

  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={serverURL} />
}
