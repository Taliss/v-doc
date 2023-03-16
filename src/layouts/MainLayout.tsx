import Head from 'next/head'
import { ReactNode } from 'react'

import Appbar from '@/components/Appbar'
import Navbar from '@/components/Navbar'

import { EditorProvider } from '@/components/editor/EditorProvider'
import CreateFileDialog from '@/components/popovers/CreateFileDialog'
import Container from '@mui/material/Container'
import Box from '@mui/system/Box'
import useConfirm from 'hooks/useConfirm'

export default function MainLayout({ children }: { children: ReactNode }) {
  const createFile = useConfirm({ disableBackdropClose: true })

  return (
    <>
      <Head>
        <title>V-DOC</title>
      </Head>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <EditorProvider>
          <Appbar />
          <Navbar />

          <Container maxWidth="lg" disableGutters sx={{ mt: 4 }}>
            {children}
          </Container>
        </EditorProvider>
      </Box>
      {createFile.open && <CreateFileDialog {...createFile} />}
    </>
  )
}

export const getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>
