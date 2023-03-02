import FilesTable from '@/components/FIlesTable'
import { getLayout } from '@/layouts/MainLayout'
import axios, { AxiosResponse } from 'axios'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next/types'
import { useEffect, useState } from 'react'
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

export type SimpleFile = {
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
  const [files, setFiles] = useState<SimpleFile[] | null>(null)
  // useQuery is needed, no refreshing after insert/delete/update actions now
  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get<unknown, AxiosResponse<SimpleFile[]>>('/api/file')
      setFiles(data)
    })()
    const files = axios.get('/api/file')
    return () => {}
  }, [])

  if (!files) {
    return <p>Loading...</p>
  }

  return <FilesTable rows={files}></FilesTable>
}

Personal.getLayout = getLayout
