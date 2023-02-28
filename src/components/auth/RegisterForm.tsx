import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useFormContext, UseFormProps } from 'react-hook-form'
import * as yup from 'yup'

import ControlPasswordField from './ControlPasswordField'
import ControlTextField from './ControlTextField'

export type RegisterFormData = {
  email?: string
  password?: string
}
type RegisterFormProps = {
  formRef: React.Ref<HTMLFormElement>
}
const schema = yup.object().shape({
  email: yup.string().trim().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(3, 'Password is too short')
    .max(100, 'Password is too long'),
})
export const formOptions: UseFormProps<RegisterFormData> = {
  mode: 'onBlur',
  defaultValues: { email: '', password: '' },
  resolver: yupResolver(schema),
}

export default function RegisterForm({ formRef }: RegisterFormProps) {
  // const router = useRouter()

  const { handleSubmit } = useFormContext<RegisterFormData>()

  const onSubmit = handleSubmit(async (values, event) => {
    event?.preventDefault()

    // TODO: come here later
    console.log('form submitted: ', values)
  })
  return (
    <Box
      mt={10}
      component="form"
      ref={formRef}
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Stack direction="column" spacing={2}>
        <ControlTextField name="email" label="email" color="primary" />
        <ControlPasswordField name="password" label="Password" color="primary" />
        <Button type="submit">Register</Button>
      </Stack>
    </Box>
  )
}
