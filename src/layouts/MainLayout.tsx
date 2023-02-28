import Head from 'next/head'
import { ReactNode } from 'react'

import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'

import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { AppBar, IconButton, Toolbar } from '@mui/material'
import { styled } from '@mui/material/styles'
import Box from '@mui/system/Box'
import Container from '@mui/system/Container'
import Stack from '@mui/system/Stack'
import Link from 'next/link'

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'inline-block',
  fontWeight: 500,
  fontSize: '1.2rem',
  lineHeight: 1.75,
  color: theme.palette.primary.main,
  textDecoration: 'none',
  paddingBottom: '4px',
  position: 'relative',
  transition: '.2s',

  ':after': {
    display: 'block',
    transition: '.2s',
    position: 'absolute',
    content: '""',
    height: '3px',
    width: '0',
    bottom: '0',
    left: '50%',
    backgroundColor: theme.palette.secondary.main,
  },

  '&:first-of-type': {
    [theme.breakpoints.up('md')]: {
      marginLeft: 0,
    },
  },

  '&:hover, &.active': {
    color: theme.palette.secondary.dark,
    ':after': {
      width: '100%',
      left: '0',
    },
  },
}))

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
              // TODO: render only one of the two possible actions
              <IconButton>
                <LoginIcon />
              </IconButton>
              <IconButton>
                <LogoutIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        <Container
          component="nav"
          maxWidth="lg"
          disableGutters
          sx={{
            minHeight: 60,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            pt={{ xs: 2, sm: 0 }}
            spacing={{ xs: 1, sm: 4 }}
          >
            <StyledLink href="/">Public</StyledLink>
            <StyledLink href="/private">Private</StyledLink>
            <StyledLink href="/shared">Shared</StyledLink>
            <StyledLink href="/archived">Archived</StyledLink>
          </Stack>
        </Container>
        {children}
      </Box>
    </>
  )
}

export const getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>
