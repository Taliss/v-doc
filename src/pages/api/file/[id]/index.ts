import prisma from '@/prisma-client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query

    const file = await prisma.file.findUnique({
      where: { id: id as string },
      select: {
        content: true,
        id: true,
        name: true,
        visibility: true,
        updatedAt: true,
        createdAt: true,
        owner: { select: { email: true } },
        FileMembership: { select: { role: true, user: true } },
      },
    })

    res.json({ file })

    try {
    } catch (error) {
      console.error(error)
      return res.status(500).end()
    }
  }

  res.status(405).end()
}
