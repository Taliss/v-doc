import { useSession } from 'next-auth/react'

export default function Personal() {
  const { data: session } = useSession()
  return (
    <>
      <h2>Helloo</h2>
      <p>{JSON.stringify(session)}</p>
    </>
  )
}
