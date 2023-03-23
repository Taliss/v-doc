import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { AlertColor } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
import { FileWithoutContent } from 'pages/personal'
import { useReducer, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import AlertSnackbar from './popovers/AlertSnackbar'

type ActionsProps = {
  type:
    | 'update_visibility_success'
    | 'update_visibility_failure'
    | 'delete_file_success'
    | 'delete_file_failure'
}
type ActionsState = {
  status: AlertColor
  message: string
} | null
const reducer = (state: ActionsState, action: ActionsProps) => {
  const [success, failure, clientSideToastFailureMessage] = [
    'success',
    'error',
    'Something went wrong!',
  ] as const
  if (action.type === 'update_visibility_success')
    return { message: 'File visibility changed', status: success }
  if (action.type === 'update_visibility_failure')
    return { message: clientSideToastFailureMessage, status: failure }
  if (action.type === 'delete_file_success') return { message: 'File deleted', status: success }
  if (action.type === 'delete_file_failure')
    return { message: clientSideToastFailureMessage, status: failure }

  return state
}

type UpdateVisibilityProps = {
  fileId: string
  visibility: 'public' | 'private'
}

export default function ActionsCell({ visibility, id }: { visibility: string; id: string }) {
  const [state, dispatch] = useReducer(reducer, null)
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const Icon = visibility === 'public' ? VisibilityIcon : VisibilityOffIcon
  const title = visibility === 'public' ? 'Switch file to private' : 'Switch file to public'

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const deleteFile = useMutation(
    () => axios.delete<{ fileId: string }>('/api/file/private', { data: { fileId: id } }),
    {
      onSuccess() {
        queryClient.setQueryData<FileWithoutContent[]>(
          ['private-files'],
          (oldData) => oldData?.filter((file) => file.id !== id) || []
        )
        dispatch({ type: 'delete_file_success' })
      },
      onError() {
        dispatch({ type: 'delete_file_failure' })
      },
      onSettled() {
        setOpen(true)
      },
    }
  )

  const updateFileVisibility = useMutation(
    () =>
      axios.patch<UpdateVisibilityProps>('/api/file/private', {
        fileId: id,
        visibility: visibility === 'private' ? 'public' : 'private',
      }),
    {
      onSuccess() {
        queryClient.setQueryData<FileWithoutContent[]>(
          ['private-files'],
          (oldData) =>
            oldData?.map(({ visibility, ...rest }) =>
              rest.id === id
                ? { ...rest, visibility: visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE' }
                : { ...rest, visibility }
            ) || []
        )
        dispatch({ type: 'update_visibility_success' })
      },
      onError() {
        dispatch({ type: 'update_visibility_failure' })
      },
      onSettled() {
        setOpen(true)
      },
    }
  )

  return (
    <>
      <TableCell
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Tooltip title={title}>
          <IconButton color="secondary" onClick={() => updateFileVisibility.mutate()}>
            <Icon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton color="warning" onClick={() => deleteFile.mutate()}>
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
      {open && (
        <AlertSnackbar
          open={open}
          message={state?.message || ''}
          severity={state?.status}
          onClose={handleClose}
        />
      )}
    </>
  )
}
