import TextField, { TextFieldProps } from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'

export type ControlTextFieldProps = {
  name: string
} & TextFieldProps

export default function ControlTextField({ name, label, ...props }: ControlTextFieldProps) {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          fullWidth
          size="small"
          color="primary"
          variant="outlined"
          label={label}
          value={value}
          error={!!error}
          onChange={onChange}
          sx={{ minHight: 37 }}
          helperText={error ? error.message : null}
          {...props}
        />
      )}
    />
  )
}
