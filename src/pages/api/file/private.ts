import prisma from '@/prisma-client'
import { FileVisibility } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { object, string, ValidationError } from 'yup'
import { authOptions, ServerSession } from '../auth/[...nextauth]'

const updateVisibilitySchema = object({
  fileId: string().required(),
  visibility: string().oneOf(['private', 'public']).optional(),
  content: object().optional(),
}).test('at-least-one-property', 'Provide visibility or content field', (value) => {
  return !!(value.visibility || value.content)
})

// TODO isn't there better way with middlewares... I know nextjs has middleware functionalities and need to reserch it, no time...
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

  if (req.method === 'PATCH') {
    // id should also be checked.
    try {
      await updateVisibilitySchema.validate(req.body)
      const query = { where: { id: req.body.fileId } }
      const file = await prisma.file.findUnique(query)

      if (!file || file.authorId !== session.user.id) {
        // for security reasons better not expose info if file exists or not
        return res.status(404).end()
      }
      const data: { visibility?: FileVisibility; content?: string } = {}

      if (req.body?.visibility) data.visibility = req.body.visibility.toUpperCase()
      if (req.body?.content) data.content = req.body.content

      await prisma.file.update({
        ...query,
        data,
      })
      return res.status(200).end()
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message })
      }
      return res.status(500).end()
    }
  }

  res.status(405).end()
}
