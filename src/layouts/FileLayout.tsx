import { TextSnippet } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import { useEditor } from 'hooks/useEditor'

type FileLayoutProps = {
  fileName: string
  owner: string
  // use fileId as a flag to add button for saving content
  fileId?: string
}

const SaveButton = ({ fileId }: { fileId: string }) => {
  const editor = useEditor(fileId)
  return (
    <Button
      sx={{ marginLeft: 'auto' }}
      onClick={() => {
        // TODO: fire api call
        console.log(editor?.getEditorState()?.toJSON())
      }}
    >
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
