import { ModalProps } from '@mui/material'
import { useState } from 'react'

export type ConfirmProps<T = undefined> = {
  disableBackdropClose?: boolean
  onConfirm?: ((arg: T) => void) | (() => void)
  onError?: (error: Error) => void | Promise<void>
  onClose?: () => void | Promise<void>
}
export type UseConfirmProps<T = undefined> = {
  open: boolean
  loading: boolean
  openHandler: () => void
  confirmHandler: (arg?: T) => Promise<void>
  closeHandler: () => void
}

const useConfirm = <T = undefined>({
  disableBackdropClose = false,
  onConfirm,
  onError,
  onClose,
}: ConfirmProps<T>): UseConfirmProps<T> => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return {
    open,
    loading,
    openHandler: () => setOpen(true),
    confirmHandler: async (arg) => {
      setOpen(false)
      try {
        if (typeof onConfirm === 'function') {
          setLoading(true)
          // @ts-expect-error cannot pass empty args to fn
          return arg ? onConfirm(arg) : onConfirm()
        }
      } catch (error) {
        if (error instanceof Error) {
          onError && onError(error)
        } else {
          throw error
        }
      } finally {
        setLoading(false)
      }
    },
    closeHandler: async (...args) => {
      // @ts-expect-error Handle close events with system reason
      const [, reason] = args as unknown as Parameters<ModalProps['onClose']>
      if (disableBackdropClose && reason === 'backdropClick') {
        return
      }
      setOpen(false)
      if (typeof onClose === 'function') {
        setLoading(true)
        await onClose()
        setLoading(false)
      }
    },
  }
}

export default useConfirm
