import { TextSnippet } from '@mui/icons-material'
import { IconButton, Paper, TableBody, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import axios from 'axios'
import { useCallback } from 'react'

type SimpleFile = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  visibility: string
  owner: {
    email: string
  }
}

type Props = {
  rows: SimpleFile[]
}

const HeaderTextCell = ({ label }: { label: string }) => (
  <TableCell>
    <Typography noWrap fontSize={16} fontWeight="bold" color="primary">
      {label.toUpperCase()}
    </Typography>
  </TableCell>
)

const ActionsCell = ({ visibility, id }: { visibility: string; id: string }) => {
  const Icon = visibility.toLowerCase() === 'public' ? VisibilityIcon : VisibilityOffIcon
  const title =
    visibility.toLowerCase() === 'public' ? 'Switch file to private' : 'Switch file to public'

  const deleteAction = useCallback(async () => {
    try {
      await axios.delete<{ filedId: string }>('/api/file', { data: { fileId: id } })
    } catch (error) {
      console.error(error)
    }
  }, [id])

  return (
    <TableCell>
      <Tooltip title={title}>
        <IconButton color="secondary" onClick={() => console.log('HELLO')}>
          <Icon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton color="warning" onClick={() => deleteAction()}>
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  )
}

export default function FilesTable({ rows }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="file-listing">
        <TableHead>
          <TableRow>
            <HeaderTextCell label="name" />
            <HeaderTextCell label="author" />
            <HeaderTextCell label="created at" />
            <HeaderTextCell label="updated at" />
            {/* Empty cell for horz-menu (extending t-header length) */}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                <Box
                  sx={{
                    display: 'inline-block',
                    marginRight: '20px',
                    verticalAlign: 'middle',
                  }}
                >
                  <TextSnippet color="primary" />
                </Box>
                {row.name}
              </TableCell>
              {/* <TableCell>
                <Box sx={{ display: 'flex' }}>
                  <>
                    {row.sharedWith.slice(0, 7).map((user, index) => {
                      return <UserAvatar key={index} user={user} />
                    })}
                    {row.sharedWith.length > 7 && (
                      <ShowMoreUsersTooltip leftOverUsers={row.sharedWith.slice(7)} />
                    )}
                  </>
                </Box>
              </TableCell> */}
              <TableCell>{row.owner.email}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.updatedAt}</TableCell>
              <ActionsCell visibility={row.visibility} id={row.id} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
