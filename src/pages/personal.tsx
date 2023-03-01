// export async function getServerSideProps() {
//   const files = await prisma.file.findMany({
//     where: { authorId: '7802b1d1-395f-4e21-939f-a9f74ed1ee9a' },
//     include: {
//       owner: {
//         select: { email: true },
//       },
//     },
//   })

//   return {
//     props: {
//       files,
//     },
//   }
// }

export default function Personal() {
  return (
    <>
      <h2>Helloo</h2>
      <p>I see a protected route here!</p>
    </>
  )
}
