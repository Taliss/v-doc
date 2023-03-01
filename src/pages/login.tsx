import LoginForm, { formOptions } from '@/components/auth/LoginForm'
import Container from '@mui/material/Container'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next/types'
import { useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import routes from 'routes'
import { authOptions } from './api/auth/[...nextauth]'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //For getting session on server side the docs recommend using getServerSession as per
  //here: https://next-auth.js.org/configuration/nextjs#getserversession
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: routes.personal,
        permanent: false,
      },
    }
  }
  return { props: { session } }
}

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
