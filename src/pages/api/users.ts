import prisma from '@/prisma-client'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, getServerSession } from 'next-auth'
import { authOptions, ServerSession } from './auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession<AuthOptions, ServerSession>(req, res, authOptions)

  if (!session) {
    return res.status(401).end()
  }

  if (req.method === 'GET') {
    const avaiableUsers = await prisma.user.findMany({
      where: {
        NOT: {
          id: session.user.id,
        },
      },
      select: {
        id: true,
        email: true,
      },
    })

    return res.status(200).json(avaiableUsers)
  }

  res.status(405).end()
}
