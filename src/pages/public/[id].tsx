import { LexicalEditor } from '@/components/editor/LexicalEditor'
import FileLayout from '@/layouts/FileLayout'
import MainLayout from '@/layouts/MainLayout'
import { Box, Divider, LinearProgress, Paper } from '@mui/material'
import { Prisma } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { useRouter } from 'next/router'
import { PublicFileWithOwner } from 'pages/api/file/public/[id]'
import { ReactNode } from 'react'
import { useQuery } from 'react-query'

export type FileWithOwnerProps = {
  file: {
    id: string
    name: string
    content: Prisma.JsonValue
    owner: { email: string }
  }
}

export default function PublicFile() {

  const {query: { id }, push} = useRouter()

  const {data: file, isLoading } = useQuery(['public-file', id], async () => {
    //TODO: stupid, but... https://github.com/vercel/next.js/discussions/11484 no time to read the thread
    if (!id) { return }
    const { data } = await axios.get<unknown,AxiosResponse<PublicFileWithOwner>>(`/api/file/public/${id}`)
    return data
  })

  if (isLoading) {
    return <LinearProgress />
  }

  if (!file) {
    return null
  }

  return (
    <>
      <FileLayout fileName={file.name} owner={file.owner.email} />
      <Box pt={1}>
        <Paper square variant="outlined" sx={{ height: '75vh' }}>
          <LexicalEditor
            id={file.id}
            editable={false}
            editorState={!!file?.content ? JSON.stringify(file.content) : null}
            editableClassName="editor-view"
          />
        </Paper>
      </Box>
    </>
  )
}

PublicFile.getLayout = (page: ReactNode) => {
  return (
    <MainLayout containerProps={{ sx: { mt: 0 } }}>
      <Divider flexItem={false} sx={{ pb: 1 }} />
      {page}
    </MainLayout>
  )
}

