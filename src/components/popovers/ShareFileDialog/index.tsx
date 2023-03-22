import { UseConfirmProps } from 'hooks/useConfirm'
import GenericDialog from '../GenericDialog'
import DialogTabs from './DialogTabs'

export default function ShareFileDialog({
  open = true,
  closeHandler,
  fileId,
}: UseConfirmProps & { fileId: string }) {
  return (
    <GenericDialog
      titleProps={{ sx: { pb: 0 } }}
      open={open}
      closeHandler={closeHandler}
      title="Share File"
      primaryLabel="Done"
      confirmActionOnly
      primaryHandler={() => closeHandler()}
    >
      <DialogTabs fileId={fileId} />
    </GenericDialog>
  )
}
