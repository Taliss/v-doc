import { yupResolver } from '@hookform/resolvers/yup'
import Stack from '@mui/material/Stack'
import { UseConfirmProps } from 'hooks/useConfirm'
import { useRouter } from 'next/router'
import { FormProvider, useForm, UseFormProps } from 'react-hook-form'
import { object, string } from 'yup'
import ControlTextField from '../auth/ControlTextField'
import GenericDialog from './GenericDialog'

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
      fileContent: string()
        .required('Please, add some content')
        .trim()
        .min(1, 'Please, add some content'),
    })
  ),
}

export default function CreateFileDialog({ open, closeHandler }: UseConfirmProps) {
  const router = useRouter()
  const methods = useForm<FormData>(formOptions)
  const { setValue, setError } = methods

  const onSubmit = async (formData: FormData) => {
    // TODO send form actually
    console.log('FORMDATA: ', formData)

    closeHandler()
  }

  return (
    <>
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
            <ControlTextField name="fileName" placeholder="Name your file" autoFocus />
            <ControlTextField
              name="fileContent"
              placeholder="File Content"
              multiline
              minRows={14}
            />
          </Stack>
        </GenericDialog>
      </FormProvider>
    </>
  )
}
