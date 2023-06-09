import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/system/Box'
import Stack from '@mui/system/Stack'
import { FileRoles, User } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { Dispatch, SetStateAction, useState } from 'react'
import { useQuery } from 'react-query'

export type SimpleUser = Omit<User, 'password'>

type InvitePeopleTabProps = {
  fileId: string
  user: SimpleUser | null
  role: FileRoles
  setUser: Dispatch<SetStateAction<SimpleUser | null>>
  setRole: Dispatch<SetStateAction<FileRoles>>
}
export default function InvitePeopleTab({
  fileId,
  user,
  role,
  setUser,
  setRole,
}: InvitePeopleTabProps) {
  const { data: users, isLoading } = useQuery(['available-users', fileId], async () => {
    const { data } = await axios.get<unknown, AxiosResponse<SimpleUser[]>>(
      `/api/file/${fileId}/available-users`
    )
    return data
  })
  const [openAutocomplete, setAutocompleteOpen] = useState(false)

  return (
    <Stack direction="row" gap={2}>
      <Autocomplete
        fullWidth
        options={users || []}
        id="share-file-users"
        open={openAutocomplete}
        onOpen={() => setAutocompleteOpen(true)}
        onClose={() => setAutocompleteOpen(false)}
        filterSelectedOptions
        getOptionLabel={(option) => option.email}
        onChange={(_, value) => {
          setUser(value)
        }}
        isOptionEqualToValue={(option, value) => option.email === value.email}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add people"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {user && (
        <Box minWidth={140}>
          <FormControl fullWidth>
            <InputLabel id="select-user-role">Role</InputLabel>
            <Select
              labelId="select-user-role"
              id="select-user-role"
              value={role}
              label="Role"
              onChange={(event: SelectChangeEvent) => setRole(event.target.value as FileRoles)}
            >
              <MenuItem value="VIEWER">Viewer</MenuItem>
              <MenuItem value="EDITOR">Editor</MenuItem>
              <MenuItem value="COMMENTER">Commenter</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Stack>
  )
}
