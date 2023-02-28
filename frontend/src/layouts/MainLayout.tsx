import Head from 'next/head'
import { ReactNode } from 'react'

import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'

import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { AppBar, IconButton, Toolbar } from '@mui/material'
import Box from '@mui/system/Box'
import Stack from '@mui/system/Stack'

// const StyledToolbar = styled(Toolbar)({
//   display: 'flex',
//   '@media all': {
//     minHeight: 85,
//   },
// })

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>V-DOC</title>
      </Head>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <Stack direction="row" spacing={2} justifyContent="flex-end" flex={1}>
              <IconButton>
                <QuestionMarkIcon />
              </IconButton>
              <IconButton>
                <LoginIcon />
              </IconButton>
              <IconButton>
                <LogoutIcon></LogoutIcon>
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        {children}
      </Box>
    </>
  )
}

export const getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>
