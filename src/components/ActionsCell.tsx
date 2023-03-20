import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { AlertColor } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
import { useCallback, useReducer, useState } from 'react'
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
  if (action.type === 'delete_file_success')
    return {
      message: 'File deleted',
      status: success,
    }
  if (action.type === 'delete_file_failure')
    return {
      message: clientSideToastFailureMessage,
      status: failure,
    }

  return state
}

export default function ActionsCell({ visibility, id }: { visibility: string; id: string }) {
  const [state, dispatch] = useReducer(reducer, null)
  const [open, setOpen] = useState(false)
  const Icon = visibility === 'public' ? VisibilityIcon : VisibilityOffIcon
  const title = visibility === 'public' ? 'Switch file to private' : 'Switch file to public'

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const deleteAction = useCallback(async () => {
    try {
      await axios.delete<{ filedId: string }>('/api/file/private', { data: { fileId: id } })
      dispatch({ type: 'delete_file_success' })
    } catch (error) {
      dispatch({ type: 'delete_file_failure' })
      console.error(error)
    } finally {
      setOpen(true)
    }
  }, [id])

  const updateAction = useCallback(async () => {
    try {
      await axios.patch<{ fileId: string; visibility: 'public' | 'private' }>('/api/file/private', {
        fileId: id,
        visibility: visibility === 'private' ? 'public' : 'private',
      })
      dispatch({ type: 'update_visibility_success' })
    } catch (error) {
      dispatch({ type: 'update_visibility_failure' })
      console.error(error)
    } finally {
      setOpen(true)
    }
  }, [id, visibility])

  return (
    <>
      <TableCell
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Tooltip title={title}>
          <IconButton color="secondary" onClick={() => updateAction()}>
            <Icon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton color="warning" onClick={() => deleteAction()}>
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
