import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Stack from '@mui/system/Stack'
import { useFormContext, UseFormProps } from 'react-hook-form'
import * as yup from 'yup'

import ControlPasswordField from './ControlPasswordField'
import ControlTextField from './ControlTextField'

export type LoginFormData = {
  email?: string
  password?: string
}
type LoginFormProps = {
  formRef: React.Ref<HTMLFormElement>
}
const schema = yup.object().shape({
  email: yup.string().trim().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(4, 'Password is too short')
    .max(100, 'Password is too long'),
})
export const formOptions: UseFormProps<LoginFormData> = {
  mode: 'onBlur',
  defaultValues: { email: '', password: '' },
  resolver: yupResolver(schema),
}

export default function LoginForm({ formRef }: LoginFormProps) {
  const { handleSubmit } = useFormContext<LoginFormData>()

  const onSubmit = handleSubmit(async (values, event) => {
    event?.preventDefault()

    // TODO: connect form
    console.log('Login form submitted: ', values)
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
        <ControlTextField id="email" name="email" label="Email" color="primary" />
        <ControlPasswordField name="password" label="Password" color="primary" />
        <Button type="submit">Login</Button>
      </Stack>
    </Box>
  )
}
