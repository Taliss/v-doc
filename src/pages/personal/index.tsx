import FilesTable from '@/components/FIlesTable'
import { getLayout } from '@/layouts/MainLayout'
import axios, { AxiosResponse } from 'axios'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next/types'
import { useEffect, useState } from 'react'
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
  visibility: string
  owner: {
    email: string
  }
}

export default function Personal() {
  const [files, setFiles] = useState<FileWithoutContent[] | null>(null)
  // useQuery is needed, no refreshing after insert/delete/update actions now
  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get<unknown, AxiosResponse<FileWithoutContent[]>>(
        '/api/file/private'
      )
      setFiles(data)
    })()
    return () => {}
  }, [])

  if (!files) {
    return <p>Loading...</p>
  }

  return <FilesTable rows={files}></FilesTable>
}

Personal.getLayout = getLayout
