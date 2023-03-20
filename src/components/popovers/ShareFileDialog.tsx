import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { UseConfirmProps } from 'hooks/useConfirm'
import { useState } from 'react'
import GenericDialog from './GenericDialog'

const users = [
  { email: 'ehoo', id: '123' },
  { email: 'fooo', id: 'foo' },
  { email: 'bar', id: 'bar' },
  { email: 'baz', id: 'baz' },
]

export default function ShareFileDialog({ open = true, closeHandler }: UseConfirmProps) {
  const [openAutocomplete, setAutocompleteOpen] = useState(false)

  return (
    <GenericDialog open={open} closeHandler={closeHandler} title="Share File" primaryLabel="Done">
      <Autocomplete
        sx={{ pt: 1 }}
        options={users}
        id="share-file-users"
        open={openAutocomplete}
        onOpen={() => setAutocompleteOpen(true)}
        onClose={() => setAutocompleteOpen(false)}
        filterSelectedOptions
        multiple
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
                  {false ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </GenericDialog>
  )
}
