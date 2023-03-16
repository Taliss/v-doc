import { TextSnippet } from '@mui/icons-material'
import { Typography } from '@mui/material'
import Stack from '@mui/material/Stack'

type FileLayoutProps = {
  fileName: string
  owner: string
}

export default function FileLayout({ fileName, owner }: FileLayoutProps) {
  return (
    <Stack direction="row" pt={1}>
      <TextSnippet color="primary" fontSize="large" sx={{ pt: 0.5, pr: 1 }} />
      <Stack>
        <Typography variant="subtitle2">{fileName}</Typography>
        <Typography variant="subtitle2">{owner}</Typography>
      </Stack>
    </Stack>
  )
}
