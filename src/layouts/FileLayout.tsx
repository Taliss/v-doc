import AlertSnackbar from '@/components/popovers/AlertSnackbar'
import ShareFileDialog from '@/components/popovers/ShareFileDialog'
import { TextSnippet } from '@mui/icons-material'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import { AlertColor, Button, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import axios from 'axios'
import useConfirm from 'hooks/useConfirm'
import { useEditor } from 'hooks/useEditor'
import { EditorState } from 'lexical'
import { useState } from 'react'
import { useMutation } from 'react-query'

type FileLayoutProps = {
  fileName: string
  owner: string
  // use fileId as a flag to add button for saving content
  fileId?: string
}

const SaveButton = ({ fileId }: { fileId: string }) => {
  const [open, setOpen] = useState(false)
  const [actionStatus, setActionStatus] = useState<{ message: string; status: AlertColor }>({
    status: 'success',
    message: 'File saved',
  })

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const editor = useEditor(fileId)
  const updateFileContent = useMutation(
    () => {
      return axios.patch<{ fileId: string; content: EditorState }>(`/api/file/${fileId}`, {
        fileId,
        content: editor?.getEditorState().toJSON(),
      })
    },
    {
      onError() {
        setActionStatus({ message: 'Something went wrong', status: 'error' })
      },
      onSettled() {
        setOpen(true)
      },
    }
  )

  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={() => updateFileContent.mutate()}
        startIcon={<SaveIcon />}
      >
        SAVE
      </Button>
      {open && (
        <AlertSnackbar
          open={open}
          onClose={handleClose}
          message={actionStatus.message}
          severity={actionStatus.status}
        />
      )}
    </>
  )
}

const ShareButton = ({ fileId }: { fileId: string }) => {
  const shareFile = useConfirm({})

  return (
    <>
      <Button
        size="small"
        variant="contained"
        startIcon={<ShareIcon />}
        onClick={shareFile.openHandler}
      >
        Share
      </Button>
      {shareFile.open && <ShareFileDialog {...shareFile} fileId={fileId} />}
    </>
  )
}

const LayoutMenu = ({ isOwner, fileId }: { isOwner: boolean; fileId: string }) => {
  return (
    <Stack direction="row" sx={{ marginLeft: 'auto', pt: 0.5, pb: 0.5 }} spacing={2}>
      {isOwner && <ShareButton fileId={fileId} />}
      <SaveButton fileId={fileId} />
    </Stack>
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
      {fileId && <LayoutMenu fileId={fileId} isOwner />}
    </Stack>
  )
}
