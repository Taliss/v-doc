import { getLayout } from '@/layouts/MainLayout'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next/types'
import routes from 'routes'
import { authOptions } from './api/auth/[...nextauth]'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //For getting session on server side the docs recommend using getServerSession as per
  //here: https://next-auth.js.org/configuration/nextjs#getserversession
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: routes.root,
        permanent: false,
      },
    }
  }
  return { props: { session } }
}

export default function Personal() {
  return <h1>Helloo there from personal!</h1>
}

Personal.getLayout = getLayout
