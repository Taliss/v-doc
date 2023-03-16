import { yupResolver } from '@hookform/resolvers/yup'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Radio from '@mui/material/Radio'
import Stack from '@mui/material/Stack'
import { FileVisibility } from '@prisma/client'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { UseConfirmProps } from 'hooks/useConfirm'
import { useState } from 'react'
import { FormProvider, useForm, UseFormProps } from 'react-hook-form'
import { object, string } from 'yup'
import ControlTextField from '../auth/ControlTextField'
import GenericDialog from './GenericDialog'

type RequestFileInput = { name: string; content: string; visibility: FileVisibility }
interface CreateFile extends RequestFileInput {
  authorId: string
  id: string
}

type FormData = {
  fileName: string
  fileContent: string
}
const formOptions: UseFormProps<FormData> = {
  mode: 'onBlur',
  defaultValues: { fileName: '', fileContent: '' },
  resolver: yupResolver(
    object().shape({
      fileName: string()
        .required('Please name your file')
        .trim()
        .min(1, 'File name should be atleast two characters long'),
    })
  ),
}

export default function CreateFileDialog({ open, closeHandler }: UseConfirmProps) {
  const methods = useForm<FormData>(formOptions)
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const { setError } = methods

  const onSubmit = async (formData: FormData) => {
    //TODO no time for state-management and error handling...
    try {
      await axios.post<RequestFileInput, AxiosResponse<CreateFile>>('/api/file', {
        name: formData.fileName,
        visibility,
      })
      closeHandler()
    } catch (error) {
      if (error instanceof AxiosError && error.code === AxiosError.ERR_BAD_REQUEST) {
        setError('fileName', { message: error.response?.data?.message })
      } else {
        console.error(error)
        closeHandler()
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <GenericDialog<FormData>
        closeHandler={closeHandler}
        open={open}
        primaryLabel="Create"
        title="New File"
        onSubmit={onSubmit}
        dialogProps={{
          maxWidth: 'md',
          sx: {
            '& .MuiDialog-container': {
              height: '85%',
            },
          },
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <ControlTextField
              name="fileName"
              placeholder="Name your file"
              autoFocus
              sx={{ maxWidth: 400 }}
            />
            <Stack direction="row" spacing={2}>
              <ListItem disablePadding>
                <ListItemButton
                  disableRipple
                  sx={{ py: 0 }}
                  onClick={() => {
                    setVisibility('private')
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '0.5rem' }}>
                    <Radio
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      checked={visibility === 'private'}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Private" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  disableRipple
                  sx={{ py: 0 }}
                  onClick={() => {
                    setVisibility('public')
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '0.5rem' }}>
                    <Radio
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      checked={visibility === 'public'}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Public" />
                </ListItemButton>
              </ListItem>
            </Stack>
          </Stack>
        </Stack>
      </GenericDialog>
    </FormProvider>
  )
}
