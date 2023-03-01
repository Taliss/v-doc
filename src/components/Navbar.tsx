import { Container, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import routes from 'routes'

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

export default function Navbar() {
  const { status } = useSession()
  const router = useRouter()
  return (
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
        <StyledLink
          href={routes.public}
          className={router.pathname === `${routes.public}` ? 'active' : ''}
        >
          Public
        </StyledLink>
        {status === 'authenticated' && (
          <StyledLink
            href={routes.personal}
            className={router.pathname === `${routes.personal}` ? 'active' : ''}
          >
            Personal
          </StyledLink>
        )}
      </Stack>
    </Container>
  )
}
