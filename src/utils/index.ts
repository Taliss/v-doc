import { ServerSession } from 'pages/api/auth/[...nextauth]'
import { PrivateFileProps } from 'pages/personal/[id]'

export const hasEditorPriviliges = (file: PrivateFileProps, { user }: ServerSession) => {
  if (file.owner.id === user.id) return true
  const userRole = file.FileMembership.find((membership) => membership.userId === user.id)

  return userRole?.role === 'EDITOR' ? true : false
}
