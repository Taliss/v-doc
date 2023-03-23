import FilesTable from '@/components/FIlesTable'
import { getLayout } from '@/layouts/MainLayout'
import { FileVisibility } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next/types'
import { useQuery } from 'react-query'
import { authOptions } from '../api/auth/[...nextauth]'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //For getting session on server side the docs recommend using getServerSession as per
  //here: https://next-auth.js.org/configuration/nextjs#getserversession
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  return { props: { session } }
}

export type FileWithoutContent = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  visibility: FileVisibility
  owner: {
    email: string
  }
}

export default function Personal() {
  const { data: files } = useQuery('private-files', async () => {
    const { data } = await axios.get<unknown, AxiosResponse<FileWithoutContent[]>>(
      '/api/file/private'
    )
    return data
  })

  return <FilesTable rows={files || []}></FilesTable>
}

Personal.getLayout = getLayout
