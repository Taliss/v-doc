import { LexicalEditor } from '@/components/editor/LexicalEditor'
import FileLayout from '@/layouts/FileLayout'
import MainLayout from '@/layouts/MainLayout'
import { Box, Divider, LinearProgress, Paper } from '@mui/material'
import { FileMembership } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ServerSession } from 'pages/api/auth/[...nextauth]'
import { PublicFileWithOwner } from 'pages/api/file/public/[id]'
import { ParsedUrlQuery } from 'querystring'
import { ReactNode } from 'react'
import { useQuery } from 'react-query'
import routes from 'routes'

export type PrivateFile = PublicFileWithOwner & { FileMembership: FileMembership[] }
export const getServerSideProps: GetServerSideProps<{ id: string }> = async (ctx) => {
  const { id } = ctx.query as ParsedUrlQuery & { id: string }
  return { props: { id } }
}

export default function PrivateFile({ id }: { id: string }) {
  const { data } = useSession()
  const router = useRouter()
  const { data: file, isLoading } = useQuery(['protected-file', id], async () => {
    const { data } = await axios.get<unknown, AxiosResponse<PrivateFile>>(`/api/file/${id}`)
    return data
  })

  if (isLoading) {
    return <LinearProgress />
  }

  if (!file) {
    return null
  }

  const session = data as ServerSession
  if (file.owner.id !== session?.user?.id) {
    router.push(`${routes.shared}/${file.id}`)
    return null
  }

  return (
    <>
      <FileLayout fileName={file.name} owner={file.owner.email} fileId={file.id} />
      <Box pt={1}>
        <Paper square variant="outlined" sx={{ height: '75vh' }}>
          <LexicalEditor
            id={file.id}
            editorState={!!file?.content ? JSON.stringify(file.content) : null}
            editableClassName="editor-view"
          />
        </Paper>
      </Box>
    </>
  )
}

PrivateFile.getLayout = (page: ReactNode) => {
  return (
    <MainLayout containerProps={{ sx: { mt: 0 } }}>
      <Divider flexItem={false} sx={{ pb: 1 }} />
      {page}
    </MainLayout>
  )
}
