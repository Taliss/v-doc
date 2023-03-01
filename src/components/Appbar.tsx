import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'

import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { AppBar, IconButton, Stack, Toolbar } from '@mui/material'

export default function Appbar() {
  return (
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
  )
}
