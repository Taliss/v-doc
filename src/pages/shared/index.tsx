import FilesTable from '@/components/FIlesTable'
import { getLayout } from '@/layouts/MainLayout'
import { FileRoles } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { FileWithoutContent } from 'pages/personal'
import { useQuery } from 'react-query'

type SharedFile = {
  fileId: string
  userId: string
  role: FileRoles
  file: FileWithoutContent
  user: { id: string; email: string }
}

export default function Shared() {
  const { data: files } = useQuery('shared-files', async () => {
    const { data } = await axios.get<unknown, AxiosResponse<SharedFile[]>>('/api/file/shared')
    return data.map(({ file }) => file) || []
  })

  return <FilesTable rows={files || []} tableVisibility="shared"></FilesTable>
}

Shared.getLayout = getLayout
