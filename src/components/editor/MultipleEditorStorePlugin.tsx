import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEditorsCommands } from 'hooks/useEditor'
import { useEffect } from 'react'

export type MultipleEditorStorePluginProps = {
  id: string
}

export function MultipleEditorStorePlugin(props: MultipleEditorStorePluginProps) {
  const { id } = props
  const [editor] = useLexicalComposerContext()
  const commands = useEditorsCommands()
  useEffect(() => {
    commands.createEditor(id, editor)
    return () => commands.deleteEditor(id)
  }, [id, editor]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
