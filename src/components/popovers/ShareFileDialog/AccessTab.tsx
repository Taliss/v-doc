import { Check } from '@mui/icons-material'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { FileMembership, FileRoles } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

type Membership = {
  user: {
    id: string
    email: string
  }
  role: FileRoles
}
type UpdatePermissionProps = {
  role: FileRoles
  userId: string
}
type RoleMenuProps = UpdatePermissionProps & {
  fileId: string
}

const menuOptions = ['VIEWER', 'COMMENTER', 'EDITOR'] as const
const RoleMenu = ({ role, userId, fileId }: RoleMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const queryClient = useQueryClient()
  const updatePermission = useMutation(
    (userRole: UpdatePermissionProps) => {
      return axios.patch<unknown, AxiosResponse<FileMembership>>(
        `/api/file/${fileId}/permissions`,
        userRole
      )
    },
    {
      onSuccess: ({ data }) => {
        queryClient.setQueryData<{ memberships: Membership[] }>(
          ['filePermissions', fileId],
          (oldData) => {
            return {
              memberships:
                oldData?.memberships.map((membership) => {
                  if (membership.user.id === data.userId)
                    return { user: membership.user, role: data.role }
                  return membership
                }) || [],
            }
          }
        )
        handleClose()
      },
    }
  )

  const removeUserAccess = useMutation(
    (userId: string) => {
      return axios.delete<{ userId: string }, AxiosResponse<FileMembership>>(
        `/api/file/${fileId}/permissions`,
        {
          data: { userId },
        }
      )
    },
    {
      onSuccess: ({ data }) => {
        queryClient.setQueryData<{ memberships: Membership[] }>(
          ['filePermissions', fileId],
          (oldData) => ({
            memberships: oldData?.memberships.filter(({ user }) => user.id !== data.userId) || [],
          })
        )
        handleClose()
      },
    }
  )

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
        {role}
      </Button>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        {menuOptions.map((roleOption) => (
          <MenuItem dense onClick={() => updatePermission.mutate({ userId, role: roleOption })}>
            {roleOption === role && (
              <ListItemIcon>
                <Check />
              </ListItemIcon>
            )}
            <ListItemText inset={roleOption !== role}>{roleOption}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => removeUserAccess.mutate(userId)}>
          <ListItemText>Remove Access</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default function AccessTab({ fileId }: { fileId: string }) {
  const { data } = useQuery(['filePermissions', fileId], async () => {
    const { data } = await axios.get<unknown, AxiosResponse<{ memberships: Membership[] }>>(
      `/api/file/${fileId}/permissions`
    )
    return data
  })

  return (
    <List dense disablePadding>
      {data?.memberships.map(({ user, role }) => {
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
            <RoleMenu role={role} userId={user.id} fileId={fileId} />
          </ListItem>
        )
      })}
    </List>
  )
}
