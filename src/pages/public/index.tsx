import { getLayout } from '@/layouts/MainLayout'

import FilesTable from '@/components/FIlesTable'
import axios, { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { FileWithoutContent } from '../personal'

export default function Public() {

  const { data: files } = useQuery('public-files', async () => {
    const { data } = await axios.get<unknown, AxiosResponse<FileWithoutContent[]>>(
      `/api/file/public`
    )
    return data
  })

  return <FilesTable tableVisibility="public" rows={files || []}></FilesTable>
}

Public.getLayout = getLayout
