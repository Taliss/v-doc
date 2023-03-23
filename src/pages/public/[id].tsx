import { LexicalEditor } from '@/components/editor/LexicalEditor'
import FileLayout from '@/layouts/FileLayout'
import MainLayout from '@/layouts/MainLayout'
import { Box, Divider, LinearProgress, Paper } from '@mui/material'
import axios, { AxiosResponse } from 'axios'
import { GetServerSideProps } from 'next/types'
import { PublicFileWithOwner } from 'pages/api/file/public/[id]'
import { ParsedUrlQuery } from 'querystring'
import { ReactNode } from 'react'
import { useQuery } from 'react-query'

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (ctx) => {
  const { id } = ctx.query as ParsedUrlQuery & { id: string }
  return { props: { id } }
}

export default function PublicFile({id}: {id:string}) {

  const {data: file, isLoading } = useQuery(['public-file', id], async () => {
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

