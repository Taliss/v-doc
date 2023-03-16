import { LexicalEditor } from 'lexical'
import { createContext, useCallback, useMemo, useState } from 'react'

export type EditorMutations = {
  createEditor: (id: string, editor: LexicalEditor) => void
  deleteEditor: (id: string) => void
}

type EditorMap = Record<string, LexicalEditor>

type EditorContextValue = EditorMutations & {
  editors: EditorMap
}

export const EditorContext = createContext<EditorContextValue | null>(null)

export const EditorProvider = (props: React.PropsWithChildren<{}>) => {
  const [editors, setEditors] = useState<EditorMap>({})

  const createEditor = useCallback((id: string, editor: LexicalEditor) => {
    setEditors((editors) => {
      if (editors[id]) return editors
      return { ...editors, [id]: editor }
    })
  }, [])

  const deleteEditor = useCallback((id: string) => {
    setEditors((editors) => {
      if (!editors[id]) return editors
      const { [id]: _, ...rest } = editors
      return rest
    })
  }, [])

  const value = useMemo(() => {
    return {
      editors,
      createEditor,
      deleteEditor,
    }
  }, [editors, createEditor, deleteEditor])

  return <EditorContext.Provider value={value}>{props.children}</EditorContext.Provider>
}
