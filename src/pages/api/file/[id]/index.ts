import prisma from '@/prisma-client'
import { FileVisibility } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, getServerSession } from 'next-auth'
import { authOptions, ServerSession } from 'pages/api/auth/[...nextauth]'
import { object, string, ValidationError } from 'yup'

const updateVisibilitySchema = object({
  visibility: string().oneOf(['private', 'public']).optional(),
  content: object().optional(),
}).test('at-least-one-property', 'Provide visibility or content field', (value) => {
  return !!(value.visibility || value.content)
})

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

    if (req.method === 'PATCH') {
      await updateVisibilitySchema.validate(req.body)
      const file = await prisma.file.findUnique({ where: { id: id as string } })

      if (!file) {
        return res.status(404).end()
      }

      // owner patch
      if (file.authorId === session.user.id) {
        const data: { visibility?: FileVisibility; content?: string } = {}
        if (req.body?.visibility) data.visibility = req.body.visibility.toUpperCase()
        if (req.body?.content) data.content = req.body.content
        await prisma.file.update({
          where: { id: id as string },
          data,
        })
        return res.status(200).end()
      }
    }
  } catch (error) {
    console.error(error)
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).end()
  }

  res.status(405).end()
}
