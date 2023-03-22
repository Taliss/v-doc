import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { FileRoles } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import React from 'react'
import { useQuery } from 'react-query'

type Membership = {
  user: {
    id: string
    email: string
  }
  role: FileRoles
}

type FilePermissions = {
  fileId: string
  FileMembership: Membership[]
}

const menuOptions = ['Viewer', 'Commenter', 'Editor'] as const
const RoleMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        id="role-menu"
        aria-controls={open ? 'role-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Hellloo
      </Button>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        {menuOptions.map((roleOption) => (
          <MenuItem>
            <ListItemText>{roleOption}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem>
          <ListItemText>Remove Access</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default function AccessTab({ fileId }: { fileId: string }) {
  const { data } = useQuery(['filePermissions', fileId], async () => {
    const { data } = await axios.get<unknown, AxiosResponse<FilePermissions>>(
      `/api/file/${fileId}/permissions`
    )
    return data
  })

  return (
    <List dense disablePadding>
      {data?.FileMembership.map(({ user, role }) => {
        return (
          <ListItem sx={{ pl: 0, pr: 0 }}>
            <ListItemAvatar>
              <Avatar>
                <BeachAccessIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.email.substring(0, user.email.indexOf('@'))}
              secondary={user.email}
            />
            <RoleMenu />
          </ListItem>
        )
      })}
    </List>
  )
}
