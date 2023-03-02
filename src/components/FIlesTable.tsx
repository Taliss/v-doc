import { TextSnippet } from '@mui/icons-material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { PrivateFile } from 'pages/personal'
import { useCallback } from 'react'

type FilesTableProps = {
  rows: PrivateFile[]
  tableVisibility?: 'private' | 'public'
}

const HeaderTextCell = ({ label }: { label: string }) => (
  <TableCell>
    <Typography noWrap fontSize={16} fontWeight="bold" color="primary">
      {label.toUpperCase()}
    </Typography>
  </TableCell>
)

const ActionsCell = ({ visibility, id }: { visibility: string; id: string }) => {
  const Icon = visibility === 'public' ? VisibilityIcon : VisibilityOffIcon
  const title = visibility === 'public' ? 'Switch file to private' : 'Switch file to public'

  const deleteAction = useCallback(async () => {
    try {
      await axios.delete<{ filedId: string }>('/api/file', { data: { fileId: id } })
    } catch (error) {
      console.error(error)
    }
  }, [id])

  const updateAction = useCallback(async () => {
    console.log(visibility, ' ?')
    try {
      await axios.patch<{ fileId: string; visibility: 'public' | 'private' }>('/api/file', {
        fileId: id,
        visibility: visibility === 'private' ? 'public' : 'private',
      })
    } catch (error) {
      console.error(error)
    }
  }, [id, visibility])

  return (
    <TableCell>
      <Tooltip title={title}>
        <IconButton color="secondary" onClick={() => updateAction()}>
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

export default function FilesTable({ rows, tableVisibility = 'private' }: FilesTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="file-listing">
        <TableHead>
          <TableRow>
            <HeaderTextCell label="name" />
            <HeaderTextCell label="owner" />
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
              <TableCell>{row.owner.email}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.updatedAt}</TableCell>
              {tableVisibility === 'private' && (
                <ActionsCell visibility={row.visibility.toLowerCase()} id={row.id} />
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
