import { LexicalEditor } from '@/components/editor/LexicalEditor'
import FileLayout from '@/layouts/FileLayout'
import MainLayout from '@/layouts/MainLayout'
import { Box, Divider, LinearProgress, Paper } from '@mui/material'
import axios, { AxiosResponse } from 'axios'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { authOptions, ServerSession } from 'pages/api/auth/[...nextauth]'
import { PrivateFileProps } from 'pages/personal/[id]'
import { ParsedUrlQuery } from 'querystring'
import { ReactNode } from 'react'
import { useQuery } from 'react-query'
import { hasEditorPriviliges } from 'utils'

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  const { id } = ctx.query as ParsedUrlQuery & { id: string }
  return { props: { id, session } }
}

export default function SharedFile({ id }: { id: string }) {
  const { data } = useSession()
  const { data: file, isLoading } = useQuery(['protected-file', id], async () => {
    const { data } = await axios.get<unknown, AxiosResponse<PrivateFileProps>>(`/api/file/${id}`)
    return data
  })

  if (isLoading) {
    return <LinearProgress />
  }

  if (!file) {
    return null
  }

  const session = data as ServerSession
  return (
    <>
      <FileLayout fileName={file.name} owner={file.owner} fileId={file.id} />
      <Box pt={1}>
        <Paper square variant="outlined" sx={{ height: '75vh' }}>
          <LexicalEditor
            editable={hasEditorPriviliges(file, session)}
            id={file.id}
            editorState={!!file?.content ? JSON.stringify(file.content) : null}
            editableClassName="editor-view"
          />
        </Paper>
      </Box>
    </>
  )
}

SharedFile.getLayout = (page: ReactNode) => {
  return (
    <MainLayout containerProps={{ sx: { mt: 0 } }}>
      <Divider flexItem={false} sx={{ pb: 1 }} />
      {page}
    </MainLayout>
  )
}
