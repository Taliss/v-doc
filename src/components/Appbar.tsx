import LogoutIcon from '@mui/icons-material/Logout'

import { AppBar, Button, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import routes from 'routes'

const UserActionsMenu = () => {
  const { status, data } = useSession()
  const router = useRouter()

  if (status !== 'authenticated') {
    return (
      <>
        <Button color="inherit" onClick={() => router.push(routes.login)}>
          LOGIN
        </Button>
        <Button color="inherit" onClick={() => router.push(routes.register)}>
          REGISTER
        </Button>
      </>
    )
  }

  return (
    <>
      <Typography variant="h6" component="div" pt={0.5}>
        Hello {data?.user?.email}
      </Typography>
      <Tooltip title="logout">
        <IconButton onClick={() => signOut({ callbackUrl: '/' })}>
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}

export default function Appbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Stack direction="row" spacing={2} justifyContent="flex-end" flex={1}>
          {/* TODO: render only one of the two possible actions */}
          <UserActionsMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
