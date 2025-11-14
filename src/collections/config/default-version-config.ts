import { IncomingCollectionVersions } from 'node_modules/payload/dist/versions/types'

export const defaultVersionConfig: boolean | IncomingCollectionVersions = {
  drafts: {
    autosave: {
      showSaveDraftButton: true,
      interval: 5000,
    },
    schedulePublish: true,
    validate: true,
  },
  maxPerDoc: 10,
}
