import { CircularProgress, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { User } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

export default function InvitePeopleTab({ fileId }: { fileId: string }) {
  const { data: users, isLoading } = useQuery(['available-users', fileId], async () => {
    const { data } = await axios.get<unknown, AxiosResponse<Omit<User, 'password'>[]>>(
      `/api/file/${fileId}/available-users`
    )
    return data
  })
  const [openAutocomplete, setAutocompleteOpen] = useState(false)

  return (
    <Autocomplete
      sx={{ pt: 1 }}
      options={users || []}
      id="share-file-users"
      open={openAutocomplete}
      onOpen={() => setAutocompleteOpen(true)}
      onClose={() => setAutocompleteOpen(false)}
      filterSelectedOptions
      getOptionLabel={(option) => option.email}
      isOptionEqualToValue={(option, value) => option.email === value.email}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
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
  )
}
