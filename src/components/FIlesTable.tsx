import { TextSnippet } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import router from 'next/router'
import { FileWithoutContent } from 'pages/personal'
import routes from 'routes'
import ActionsCell from './ActionsCell'
type FilesTableProps = {
  rows: FileWithoutContent[]
  tableVisibility?: 'private' | 'public' | 'shared'
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&.MuiTableRow-hover:hover': {
    cursor: 'pointer',
  },
}))

const HeaderTextCell = ({ label }: { label: string }) => (
  <TableCell>
    <Typography noWrap fontSize={16} fontWeight="bold" color="primary">
      {label.toUpperCase()}
    </Typography>
  </TableCell>
)

const resolvePath = (tableVisibility: 'private' | 'public' | 'shared') => {
  const pathMap = {
    private: routes.personal,
    public: routes.public,
    shared: routes.shared,
  }
  return pathMap[tableVisibility]
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
            <StyledTableRow
              hover
              key={row.id}
              onClick={() => router.push(`${resolvePath(tableVisibility)}/${row.id}`)}
            >
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
              {tableVisibility !== 'private' && <TableCell />}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
