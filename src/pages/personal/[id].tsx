import { LexicalEditor } from '@/components/editor/LexicalEditor'
import FileLayout from '@/layouts/FileLayout'
import MainLayout from '@/layouts/MainLayout'
import prisma from '@/prisma-client'
import { Box, Divider, Paper } from '@mui/material'
import { FileVisibility, Prisma } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { AuthOptions, getServerSession } from 'next-auth'
import { authOptions, ServerSession } from 'pages/api/auth/[...nextauth]'
import { ParsedUrlQuery } from 'querystring'
import { ReactNode } from 'react'
import routes from 'routes'

export type FileWithOwnerProps = {
  file: {
    id: string
    name: string
    content: Prisma.JsonValue
    owner: { email: string }
    visibility: FileVisibility
    authorId: string
  }
}
// TODO: use this as a public file browsing path, change later
export const getServerSideProps: GetServerSideProps<FileWithOwnerProps> = async (ctx) => {
  const { id } = ctx.query as ParsedUrlQuery & { id: string }

  const session = await getServerSession<AuthOptions, ServerSession>(ctx.req, ctx.res, authOptions)

  try {
    const file = await prisma.file.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        content: true,
        owner: { select: { email: true } },
        visibility: true,
        authorId: true,
      },
    })

    // TODO: nextjs supports redirects as middleware, need to reed the docs...
    if (!file || file.authorId !== session?.user.id) {
      return { redirect: { destination: routes.root, permanent: false } }
    }

    return { props: { file } }
  } catch (error) {
    console.error(error)
    return {
      redirect: {
        destination: routes.root,
        permanent: false,
      },
    }
  }
}

export default function PrivateFile({ file }: FileWithOwnerProps) {
  return (
    <>
      <FileLayout fileName={file.name} owner={file.owner.email} />
      <Box pt={1}>
        <Paper square variant="outlined" sx={{ height: '75vh' }}>
          <LexicalEditor
            id={file.id}
            editorState={JSON.stringify(file.content)}
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
