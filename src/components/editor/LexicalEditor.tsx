import { InitialEditorStateType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'

import { MultipleEditorStorePlugin } from './MultipleEditorStorePlugin'

export type LexicalEditorProps = {
  id: string
  editable?: boolean
  editorState?: InitialEditorStateType
  editableClassName?: string
}

export function LexicalEditor({
  id,
  editable = true,
  editorState,
  editableClassName = 'editor-input',
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'V-Doc-Editor',
    onError(error: Error) {
      console.log(error)
    },
    editable,
    editorState,
  }
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className={editableClassName} />}
        placeholder={<div className="editor-placeholder"></div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <MultipleEditorStorePlugin id={id} />
    </LexicalComposer>
  )
}
