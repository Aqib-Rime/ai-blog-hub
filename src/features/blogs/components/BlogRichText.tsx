import type { ImageBlock } from '@/payload-types'
import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'
import { ImageBlockComponent } from '../blocks/ImageBlock/Component'

// Extend the default node types with your custom blocks for full type safety
type NodeTypes = DefaultNodeTypes | SerializedBlockNode<ImageBlock> | SerializedInlineBlockNode

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    imageBlock: ImageBlockComponent,
  },
  inlineBlocks: {},
})

export const BlogRichText: React.FC<{
  lexicalData: SerializedEditorState
}> = ({ lexicalData }) => {
  return <RichText converters={jsxConverters} data={lexicalData} />
}
