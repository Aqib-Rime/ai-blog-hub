import { IncomingCollectionVersions } from 'node_modules/payload/dist/versions/types'

export const defaultVersionConfig: boolean | IncomingCollectionVersions = {
  drafts: {
    autosave: {
      interval: 400,
      showSaveDraftButton: true,
    },
    schedulePublish: true,
    validate: true,
  },
  maxPerDoc: 10,
}
