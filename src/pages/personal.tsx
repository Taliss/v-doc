import FilesTable from '@/components/FIlesTable'
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

const data = [
  {
    id: 'c6c69739-9f3b-455f-9dc0-aa39be88c9aa',
    name: 'one more time',
    visibility: 'PUBLIC',
    updatedAt: '2023-03-02T13:30:06.462Z',
    createdAt: '2023-03-02T13:30:06.462Z',
    owner: {
      email: 'ivv@yopmail.com',
    },
  },
  {
    id: '377ca9c7-6836-4580-8381-239404060239',
    name: 'bb',
    visibility: 'PUBLIC',
    updatedAt: '2023-03-02T13:23:33.328Z',
    createdAt: '2023-03-02T13:23:33.328Z',
    owner: {
      email: 'ivv@yopmail.com',
    },
  },
  {
    id: '2de644cc-2e81-4002-a933-9c26e88a8151',
    name: 'ahaa',
    visibility: 'PRIVATE',
    updatedAt: '2023-03-02T13:22:24.914Z',
    createdAt: '2023-03-02T13:22:24.914Z',
    owner: {
      email: 'ivv@yopmail.com',
    },
  },
]

export default function Personal() {
  return <FilesTable rows={data}></FilesTable>
}

Personal.getLayout = getLayout
