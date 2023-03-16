import FileLayout from '@/layouts/FileLayout'
import MainLayout from '@/layouts/MainLayout'
import { Box, Divider, Paper } from '@mui/material'
import { ReactNode } from 'react'

export default function File() {
  return (
    <Box pt={1}>
      <Paper square variant="outlined" sx={{ height: '75vh' }}>
        Hello there !
      </Paper>
    </Box>
  )
}

File.getLayout = (page: ReactNode) => {
  return (
    <MainLayout containerProps={{ sx: { mt: 0 } }}>
      <Divider flexItem={false} sx={{ pb: 1 }} />
      <FileLayout fileName="some name" owner="Vlahov" />
      {page}
    </MainLayout>
  )
}
