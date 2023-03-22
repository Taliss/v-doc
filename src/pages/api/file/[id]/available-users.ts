import prisma from '@/prisma-client'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, getServerSession } from 'next-auth'
import { authOptions, ServerSession } from 'pages/api/auth/[...nextauth]'
import { resolveFileWithPermissions } from './permissions'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession<AuthOptions, ServerSession>(req, res, authOptions)
    const { id } = req.query

    if (!session) {
      return res.status(401).end()
    }

    if (req.method === 'GET') {
      const file = await resolveFileWithPermissions(id as string, session.user.id)
      if (!file) return res.status(404).end()

      const users = await prisma.user.findMany({
        where: {
          AND: {
            FileMembership: {
              none: {
                fileId: id as string,
              },
            },
            NOT: {
              id: session.user.id,
            },
          },
        },
        select: {
          id: true,
          email: true,
        },
      })

      return res.json(users)
    }

    return res.status(405).end()
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}
