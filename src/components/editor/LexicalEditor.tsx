import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { MultipleEditorStorePlugin } from './MultipleEditorStorePlugin'

export type LexicalEditorProps = {
  id: string
}

export function LexicalEditor(props: LexicalEditorProps) {
  const { id } = props
  const initialConfig = {
    namespace: 'V-Doc-Editor',
    onError(error: Error) {
      console.log(error)
    },
  }
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<div className="editor-placeholder"></div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <MultipleEditorStorePlugin id={id} />
    </LexicalComposer>
  )
}
