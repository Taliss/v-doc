import Head from 'next/head'
import { ReactNode } from 'react'

import Appbar from '@/components/Appbar'
import Navbar from '@/components/Navbar'
import Box from '@mui/system/Box'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>V-DOC</title>
      </Head>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Appbar />
        <Navbar />
        {children}
      </Box>
    </>
  )
}

export const getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>
