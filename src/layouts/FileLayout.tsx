import { TextSnippet } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import axios from 'axios'
import { useEditor } from 'hooks/useEditor'
import { EditorState } from 'lexical'
import { useCallback } from 'react'

type FileLayoutProps = {
  fileName: string
  owner: string
  // use fileId as a flag to add button for saving content
  fileId?: string
}

const SaveButton = ({ fileId }: { fileId: string }) => {
  const editor = useEditor(fileId)
  const updateContentAction = useCallback(async () => {
    try {
      await axios.patch<{ fileId: string; content: EditorState }>('/api/file/private', {
        fileId,
        content: editor?.getEditorState().toJSON(),
      })
    } catch (error) {
      console.error(error)
    }
  }, [editor?.getEditorState()])
  return (
    <Button sx={{ marginLeft: 'auto' }} onClick={updateContentAction}>
      SAVE
    </Button>
  )
}

export default function FileLayout({ fileName, owner, fileId }: FileLayoutProps) {
  return (
    <Stack direction="row" pt={1}>
      <TextSnippet color="primary" fontSize="large" sx={{ pt: 0.5, pr: 1 }} />
      <Stack>
        <Typography variant="subtitle2">{fileName}</Typography>
        <Typography variant="subtitle2">{owner}</Typography>
      </Stack>
      {fileId && <SaveButton fileId={fileId} />}
    </Stack>
  )
}
