import Head from 'next/head'
import { PropsWithChildren, ReactNode } from 'react'

import Appbar from '@/components/Appbar'
import Navbar from '@/components/Navbar'

import { EditorProvider } from '@/components/editor/EditorProvider'
import CreateFileDialog from '@/components/popovers/CreateFileDialog'
import Container from '@mui/material/Container'
import { ContainerProps } from '@mui/system'
import Box from '@mui/system/Box'
import useConfirm from 'hooks/useConfirm'

type MainLayoutProps = PropsWithChildren<{
  containerProps?: ContainerProps
}>

export default function MainLayout({ children, containerProps }: MainLayoutProps) {
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

          <Container maxWidth="lg" disableGutters sx={{ mt: 4 }} {...containerProps}>
            {children}
          </Container>
        </EditorProvider>
      </Box>
      {createFile.open && <CreateFileDialog {...createFile} />}
    </>
  )
}

export const getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>
