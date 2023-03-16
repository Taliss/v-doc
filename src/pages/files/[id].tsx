import { getLayout } from '@/layouts/MainLayout'
import { ReactNode } from 'react'

export default function File() {
  return <p>Hello there</p>
}

File.getLayout = (page: ReactNode) =>
  getLayout(
    <>
      <h1>Uga buga buga buga</h1>
      {page}
    </>
  )
