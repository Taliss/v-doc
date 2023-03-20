import { SnackbarProps } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import * as React from 'react'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

type AlertSnackbarProps = Pick<SnackbarProps, 'onClose' | 'open'> &
  Pick<AlertProps, 'onClose' | 'severity'> & { message: string }
export default function AlertSnackbar({ onClose, severity, open, message }: AlertSnackbarProps) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
