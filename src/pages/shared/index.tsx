import FilesTable from '@/components/FIlesTable'
import { getLayout } from '@/layouts/MainLayout'
import { FileRoles } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next/types'
import { FileWithoutContent } from 'pages/personal'
import { useQuery } from 'react-query'
import { authOptions } from '../api/auth/[...nextauth]'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //For getting session on server side the docs recommend using getServerSession as per
  //here: https://next-auth.js.org/configuration/nextjs#getserversession
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  return { props: { session } }
}

type SharedFile = {
  fileId: string
  userId: string
  role: FileRoles
  file: FileWithoutContent
  user: { id: string; email: string }
}

export default function Shared() {
  const { data: files } = useQuery('private-files', async () => {
    const { data } = await axios.get<unknown, AxiosResponse<SharedFile[]>>('/api/file/shared')
    return data.map(({ file }) => file) || []
  })

  return <FilesTable rows={files || []} tableVisibility="shared"></FilesTable>
}

Shared.getLayout = getLayout
