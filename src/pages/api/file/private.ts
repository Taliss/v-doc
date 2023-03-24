import prisma from '@/prisma-client'
import { getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { authOptions, ServerSession } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: ServerSession | null = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }

  if (req.method === 'GET') {
    // no cursor based pagination for this example...
    try {
      // Prisma `exclude` features is pending for now...
      const results = await prisma.file.findMany({
        where: {
          authorId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          visibility: true,
          updatedAt: true,
          createdAt: true,
          owner: { select: { email: true } },
        },
      })
      return res.json(results)
    } catch (error) {
      console.error(error)
      return res.status(500).end()
    }
  }

  res.status(405).end()
}
