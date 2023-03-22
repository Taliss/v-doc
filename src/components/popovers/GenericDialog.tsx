import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  Dialog,
  DialogActions,
  DialogActionsProps,
  DialogContent,
  DialogContentProps,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
  IconButton,
} from '@mui/material'
import { ReactNode } from 'react'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import GenericForm from '../GenericForm'

type CloseModalButtonProps = {
  onClose?: () => void
}
const CloseModalButton = ({ onClose }: CloseModalButtonProps) => (
  <IconButton
    aria-label="close"
    onClick={onClose}
    sx={(theme) => ({
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2),
      // zIndex: theme.zIndex.drawer,
      color: theme.palette.grey[500],
    })}
  >
    <CloseIcon />
  </IconButton>
)

type Props<T> = {
  confirmActionOnly?: boolean
  open: boolean
  dialogProps?: Partial<DialogProps>
  title?: ReactNode
  titleProps?: Partial<DialogTitleProps>
  children?: ReactNode
  contentProps?: Partial<DialogContentProps>
  actionsProps?: Partial<DialogActionsProps>
  loading?: boolean
  primaryLabel?: ReactNode
  /**
   * When `primaryHandler` is provided the handler is attached
   * to the primary button for the dialog.
   */
  primaryHandler?: () => void
  /**
   * When `onSubmit` is provided dialog acts as a form with submit button.
   * Should be wrapped with <FormProvider /> context.
   */
  onSubmit?: SubmitHandler<T extends FieldValues ? T : never>
  closeHandler?: () => void | Promise<void>
}
export default function GenericDialog<T = undefined>({
  confirmActionOnly,
  open,
  dialogProps,
  title,
  titleProps,
  contentProps,
  actionsProps,
  loading,
  onSubmit,
  primaryLabel = 'Submit',
  primaryHandler,
  closeHandler,
  children,
}: Props<T>) {
  return (
    <Dialog fullWidth open={open} onClose={closeHandler} {...dialogProps}>
      <GenericForm onSubmit={onSubmit}>
        <DialogTitle {...titleProps}>{title}</DialogTitle>
        <DialogContent {...contentProps}>{children}</DialogContent>
        <DialogActions {...actionsProps} sx={{ p: 3 }}>
          {closeHandler && <CloseModalButton onClose={closeHandler} />}
          {closeHandler && !confirmActionOnly && (
            <Button onClick={closeHandler} disabled={loading} variant="contained">
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={loading} onClick={primaryHandler}>
            {primaryLabel}
          </Button>
        </DialogActions>
      </GenericForm>
    </Dialog>
  )
}
