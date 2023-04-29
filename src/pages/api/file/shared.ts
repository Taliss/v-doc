import prisma from '@/prisma-client'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, getServerSession } from 'next-auth'
import { authOptions, ServerSession } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession<AuthOptions, ServerSession>(req, res, authOptions)
    if (!session) return res.status(401).end()

    if (req.method === 'GET') {
      // fetching shared files
      const files = await prisma.fileMembership.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          file: {
            select: {
              id: true,
              name: true,
              createdAt: true,
              updatedAt: true,
              owner: { select: { email: true } },
            },
          },
          user: { select: { email: true, id: true } },
        },
      })

      res.json(files)
    }
    return res.status(405).end()
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}
