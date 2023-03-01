import { PropsWithChildren } from 'react'
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form'

type Props<T extends FieldValues> = PropsWithChildren<{
  onSubmit?: SubmitHandler<T>
}>

export default function GenericForm<T extends FieldValues>({ children, onSubmit }: Props<T>) {
  const methods = useFormContext<T>()
  // No form provider or form handler
  if (!methods || !onSubmit) {
    return <>{children}</>
  }
  return <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
}
