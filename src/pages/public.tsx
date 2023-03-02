import { getLayout } from '@/layouts/MainLayout'

import FilesTable from '@/components/FIlesTable'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { PrivateFile } from './personal'

export default function Public() {
  const [files, setFiles] = useState<PrivateFile[] | null>(null)
  // useQuery is needed, no refreshing after insert/delete/update actions now
  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get<unknown, AxiosResponse<PrivateFile[]>>('/api/file/public')
      setFiles(data)
    })()
    return () => {}
  }, [])

  if (!files) {
    return <p>Loading...</p>
  }

  return <FilesTable tableVisibility="public" rows={files}></FilesTable>
}

Public.getLayout = getLayout
