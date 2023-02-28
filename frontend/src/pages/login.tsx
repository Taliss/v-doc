import LoginForm, { formOptions } from '@/components/auth/LoginForm'
import Container from '@mui/material/Container'
import { useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export default function Register() {
  const formRef = useRef<HTMLFormElement>(null)
  const methods = useForm(formOptions)

  return (
    <Container maxWidth="sm">
      <FormProvider {...methods}>
        <LoginForm formRef={formRef} />
      </FormProvider>
    </Container>
  )
}
