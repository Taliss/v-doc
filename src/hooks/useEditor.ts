import { EditorContext, EditorMutations } from '@/components/editor/EditorProvider'
import { LexicalEditor } from 'lexical/LexicalEditor'
import { useContext } from 'react'

export const useEditor = (id: string): LexicalEditor | null => {
  const context = useContext(EditorContext)
  if (context === null) {
    throw new Error(
      `The \`useEditor\` hook must be used inside the <EditorProvider> component's context.`
    )
  }
  return context.editors[id] || null
}

export const useEditorsCommands = (): EditorMutations => {
  const context = useContext(EditorContext)
  if (context === null) {
    throw new Error(
      `The \`useEditors\` hook must be used inside the <EditorProvider> component's context.`
    )
  }
  const { createEditor, deleteEditor } = context
  return { createEditor, deleteEditor }
}
