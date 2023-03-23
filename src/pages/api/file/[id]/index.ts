import prisma from '@/prisma-client'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, getServerSession } from 'next-auth'
import { authOptions, ServerSession } from 'pages/api/auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession<AuthOptions, ServerSession>(req, res, authOptions)
    const { id } = req.query

    if (!session) {
      return res.status(401).end()
    }

    if (!id) {
      return res.status(400).json({ message: 'Provide file id' })
    }

    if (req.method === 'GET') {
      // TODO: maybe check if this can be done in the db
      const file = await prisma.file.findUnique({
        where: {
          id: id as string,
        },
        include: {
          owner: { select: { id: true, email: true } },
          FileMembership: true,
        },
      })

      if (!file) {
        return res.status(404).end()
      } else if (file.authorId === session.user.id) {
        return res.json(file)
      } else {
        const isSharedWithUser = file.FileMembership.some(
          ({ userId }) => userId === session.user.id
        )
        if (isSharedWithUser) return res.json(file)

        return res.status(404).end()
      }
    }

    if (req.method === 'DELETE') {
      const fileMatchQuery = { where: { id: id as string } }
      const file = await prisma.file.findUnique(fileMatchQuery)

      if (!file) return res.status(404).end()
      if (file.authorId !== session.user.id) {
        return res.status(401).end()
      }

      // actually delete the file, no time for archived
      await prisma.file.delete(fileMatchQuery)
      return res.status(200).end()
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }

  res.status(405).end()
}
