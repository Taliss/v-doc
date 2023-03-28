import AlertSnackbar from '@/components/popovers/AlertSnackbar'
import ShareFileDialog from '@/components/popovers/ShareFileDialog'
import { TextSnippet } from '@mui/icons-material'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import { AlertColor, Button, Chip, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import { FileMembership, FileRoles } from '@prisma/client'
import axios from 'axios'
import useConfirm from 'hooks/useConfirm'
import { useEditor } from 'hooks/useEditor'
import { EditorState } from 'lexical'
import { useSession } from 'next-auth/react'
import { ServerSession } from 'pages/api/auth/[...nextauth]'
import { PublicFileWithOwner } from 'pages/api/file/public/[id]'
import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

type FileLayoutProps = {
  fileName: string
  owner: PublicFileWithOwner['owner']
  // use fileId as a flag to render layout menu (share/save buttons)
  fileId?: string
  userRole?: FileRoles
  fileMembers: FileMembership[] | null
}

const SaveButton = ({ fileId, disabled = false }: { fileId: string; disabled?: boolean }) => {
  const [open, setOpen] = useState(false)
  const [actionStatus, setActionStatus] = useState<{ message: string; status: AlertColor } | null>(
    null
  )

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const queryClient = useQueryClient()
  const editor = useEditor(fileId)
  const updateFileContent = useMutation(
    () => {
      return axios.patch<{ fileId: string; content: EditorState }>(`/api/file/${fileId}`, {
        fileId,
        content: editor?.getEditorState().toJSON(),
      })
    },
    {
      onSuccess() {
        // queryClient.invalidateQueries([{ queryKey: ['protected-file', fileId] }])
        queryClient.invalidateQueries(['public-file', fileId])
        queryClient.invalidateQueries(['protected-file', fileId])
        setActionStatus({ message: 'File saved', status: 'success' })
      },
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
        disabled={disabled}
      >
        SAVE
      </Button>
      {open && (
        <AlertSnackbar
          open={open}
          onClose={handleClose}
          message={actionStatus?.message || ''}
          severity={actionStatus?.status}
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

const LayoutMenu = ({ fileId, userRole }: { fileId: string; userRole: FileRoles | 'OWNER' }) => {
  const disableSave = useMemo(() => {
    if (userRole === 'COMMENTER' || userRole === 'VIEWER') return true
    return false
  }, [userRole, fileId])

  return (
    <Stack direction="row" sx={{ marginLeft: 'auto', pt: 0.5, pb: 0.5 }} spacing={2}>
      {userRole === 'OWNER' && <ShareButton fileId={fileId} />}
      <SaveButton fileId={fileId} disabled={disableSave} />
    </Stack>
  )
}

export default function FileLayout({ fileName, owner, fileId, fileMembers }: FileLayoutProps) {
  const { data } = useSession()
  const userRole = useMemo(() => {
    const session = data as ServerSession | null

    if (owner.id === session?.user.id) return 'OWNER'
    if (!fileMembers || fileMembers.length === 0) {
      return null
    }
    const membership = fileMembers.find((membership) => membership.userId === session?.user.id)
    return membership ? membership.role : null
  }, [data, fileMembers, owner.id])
  return (
    <Stack direction="row" pt={1}>
      <TextSnippet color="primary" fontSize="large" sx={{ pt: 0.5, pr: 1 }} />
      <Stack>
        <Typography variant="subtitle2">{fileName}</Typography>
        <Typography variant="subtitle2">{owner.email}</Typography>
      </Stack>
      {fileId && userRole && (
        <>
          <Chip color="primary" label={userRole} sx={{ alignSelf: 'center', mr: 2, ml: 2 }} />
          <LayoutMenu fileId={fileId} userRole={userRole} />
        </>
      )}
    </Stack>
  )
}
