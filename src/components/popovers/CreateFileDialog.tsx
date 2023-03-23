import { yupResolver } from '@hookform/resolvers/yup'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Radio from '@mui/material/Radio'
import Stack from '@mui/material/Stack'
import axios, { AxiosError } from 'axios'
import { UseConfirmProps } from 'hooks/useConfirm'
import { useEditor } from 'hooks/useEditor'
import { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import { useState } from 'react'
import { FormProvider, useForm, UseFormProps } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { object, string } from 'yup'
import ControlTextField from '../auth/ControlTextField'
import { LexicalEditor } from '../editor/LexicalEditor'
import GenericDialog from './GenericDialog'

type RequestFileInput = {
  name: string
  content?: SerializedEditorState<SerializedLexicalNode>
  visibility: 'public' | 'private'
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

const createEditorId = 'NEW'

export default function CreateFileDialog({ open, closeHandler }: UseConfirmProps) {
  const createEditor = useEditor(createEditorId)
  const methods = useForm<FormData>(formOptions)
  const queryClient = useQueryClient()
  const { setError } = methods
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')

  const createFile = useMutation((data: RequestFileInput) => {
    return axios.post<RequestFileInput, unknown>(`/api/file`, data)
  })

  const onSubmit = async (formData: FormData) => {
    createFile.mutate(
      {
        name: formData.fileName,
        content: createEditor?.getEditorState().toJSON(),
        visibility,
      },
      {
        onSuccess: () => {
          closeHandler()
          queryClient.invalidateQueries({
            queryKey: [visibility === 'private' ? 'private-files' : 'public-files'],
          })
        },
        onError: (error) => {
          if (error instanceof AxiosError && error.code === AxiosError.ERR_BAD_REQUEST) {
            setError('fileName', { message: error.response?.data?.message })
          } else {
            console.error(error)
            closeHandler()
          }
        },
      }
    )
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
          <LexicalEditor id={createEditorId} />
        </Stack>
      </GenericDialog>
    </FormProvider>
  )
}
