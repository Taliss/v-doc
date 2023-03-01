import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useFormContext, UseFormProps } from 'react-hook-form'
import routes from 'routes'
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
  const router = useRouter()

  const { handleSubmit, setError } = useFormContext<RegisterFormData>()

  const onSubmit = handleSubmit(async (values, event) => {
    event?.preventDefault()

    //TODO no time for state-management and error handling...
    try {
      await axios.post('/api/auth/register', {
        email: values.email?.trim(),
        password: values.password,
      })
      const signInResponse = await signIn<'credentials'>('credentials', {
        email: values.email?.trim(),
        password: values.password,
      })
      signInResponse?.ok ? router.push(routes.personal) : router.push(routes.login)
    } catch (e: any) {
      const eMessage = e?.response?.data?.message || 'Ooops something went whrong'
      setError('email', { type: 'registerInput', message: eMessage })
    }
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
