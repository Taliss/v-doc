import prisma from '@/prisma-client'
import { File } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { ParsedUrlQuery } from 'querystring'

export type PublicFileWithOwner = File & { owner: {id: string, email: string}}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query as ParsedUrlQuery & { id: string }

    try {
      const file = await prisma.file.findUnique({
        where: {
          id,
        },
        include: {
          owner: {select: {id:true, email: true}}
        }
      })

      if (!file || file.visibility !== 'PUBLIC') {
        return res.status(404).end()
      }

      return res.json(file)

    } catch (error) {
      console.error(error)
      return res.status(500).end()
    }
  }

  res.status(405).end()
}
