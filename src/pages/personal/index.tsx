import FilesTable from '@/components/FIlesTable'
import { getLayout } from '@/layouts/MainLayout'
import { FileVisibility } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'

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
