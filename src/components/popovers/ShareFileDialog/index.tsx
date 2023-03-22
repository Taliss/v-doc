import { UseConfirmProps } from 'hooks/useConfirm'
import GenericDialog from '../GenericDialog'
import DialogTabs from './DialogTabs'

const users = [
  { email: 'ehoo', id: '123' },
  { email: 'fooo', id: 'foo' },
  { email: 'bar', id: 'bar' },
  { email: 'baz', id: 'baz' },
]

// const legacyComponent = () => (
//   <Autocomplete
//     sx={{ pt: 1 }}
//     options={users}
//     id="share-file-users"
//     open={openAutocomplete}
//     onOpen={() => setAutocompleteOpen(true)}
//     onClose={() => setAutocompleteOpen(false)}
//     filterSelectedOptions
//     multiple
//     getOptionLabel={(option) => option.email}
//     isOptionEqualToValue={(option, value) => option.email === value.email}
//     renderInput={(params) => (
//       <TextField
//         {...params}
//         label="Asynchronous"
//         InputProps={{
//           ...params.InputProps,
//           endAdornment: (
//             <>
//               {false ? <CircularProgress color="inherit" size={20} /> : null}
//               {params.InputProps.endAdornment}
//             </>
//           ),
//         }}
//       />
//     )}
//   />
// )

export default function ShareFileDialog({
  open = true,
  closeHandler,
  fileId,
}: UseConfirmProps & { fileId: string }) {
  // const [openAutocomplete, setAutocompleteOpen] = useState(false)

  return (
    <GenericDialog
      titleProps={{ sx: { pb: 0 } }}
      open={open}
      closeHandler={closeHandler}
      title="Share File"
      primaryLabel="Done"
      confirmActionOnly
      primaryHandler={() => closeHandler()}
    >
      <DialogTabs fileId={fileId} />
    </GenericDialog>
  )
}
