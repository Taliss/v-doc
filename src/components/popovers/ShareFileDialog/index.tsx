import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { FileRoles } from '@prisma/client'
import axios from 'axios'
import { UseConfirmProps } from 'hooks/useConfirm'
import { useState } from 'react'
import { useMutation } from 'react-query'
import GenericDialog from '../GenericDialog'
import AccessTab from './AccessTab'
import InvitePeopleTab, { SimpleUser } from './InvitePeopleTab'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function ShareFileDialog({
  open = true,
  closeHandler,
  fileId,
}: UseConfirmProps & { fileId: string }) {
  const [tabValue, setTabValue] = useState(0)
  const [selectedUser, setUser] = useState<SimpleUser | null>(null)
  const [selectedRole, setRole] = useState<FileRoles>('VIEWER')

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    // reset selected user when changing tabs
    if (newValue === 1) setUser(null)
  }

  const createMembership = useMutation((data: { userId: string; role: FileRoles }) => {
    return axios.post<{ userId: string; role: FileRoles }, unknown>(
      `/api/file/${fileId}/permissions`,
      data
    )
  })

  const primaryHandler = () => {
    if (!selectedUser) {
      return closeHandler()
    }
    createMembership.mutate(
      { userId: selectedUser.id, role: selectedRole },
      { onSuccess: () => closeHandler() }
    )
  }

  return (
    <GenericDialog
      titleProps={{ sx: { pb: 0 } }}
      open={open}
      closeHandler={closeHandler}
      title="Share File"
      primaryLabel={selectedUser ? 'Invite' : 'Done'}
      confirmActionOnly
      primaryHandler={primaryHandler}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Invite People" {...a11yProps(0)} sx={{ pl: 0 }} />
          <Tab label="Manage Access" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <InvitePeopleTab
          fileId={fileId}
          user={selectedUser}
          role={selectedRole}
          setUser={setUser}
          setRole={setRole}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <AccessTab fileId={fileId} />
      </TabPanel>
    </GenericDialog>
  )
}
