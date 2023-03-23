import AddRounded from '@mui/icons-material/AddRounded'
import { Container, IconButton, Stack, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import useConfirm from 'hooks/useConfirm'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import routes from 'routes'
import CreateFileDialog from './popovers/CreateFileDialog'

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

const publicLinks = [
  {
    label: 'Public',
    href: routes.public,
  },
]
const protectedLinks = [
  {
    label: 'Personal',
    href: routes.personal,
  },
  {
    label: 'Shared',
    href: routes.shared,
  },
]
const Links = () => {
  const { status } = useSession()
  const router = useRouter()
  const links = useMemo(() => {
    return status === 'authenticated' ? [...publicLinks, ...protectedLinks] : publicLinks
  }, [status])

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} pt={{ xs: 2, sm: 0 }} spacing={{ xs: 1, sm: 4 }}>
      {links.map((link) => (
        <StyledLink
          key={link.label}
          href={link.href}
          className={router.pathname === `${link.href}` ? 'active' : ''}
        >
          {link.label}
        </StyledLink>
      ))}
    </Stack>
  )
}

export default function Navbar() {
  const { status } = useSession()
  const createFile = useConfirm({ disableBackdropClose: true })

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
      <Stack direction="row" justifyContent="space-between" flexGrow={1}>
        <Links />
        {status === 'authenticated' && (
          <>
            <Tooltip title="New File">
              <IconButton color="primary" onClick={createFile.openHandler}>
                <AddRounded />
              </IconButton>
            </Tooltip>
            {createFile.open && <CreateFileDialog {...createFile} />}
          </>
        )}
      </Stack>
    </Container>
  )
}
