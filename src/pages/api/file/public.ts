import prisma from '@/prisma-client'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const results = await prisma.file.findMany({
        where: {
          visibility: 'PUBLIC',
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
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
