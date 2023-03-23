import prisma from '@/prisma-client'
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, getServerSession } from 'next-auth'
import { object, string, ValidationError } from 'yup'
import { authOptions, ServerSession } from '../auth/[...nextauth]'

const createFileSchema = object({
  name: string().required().trim().min(1),
  content: object().optional(),
  visibility: string().oneOf(['private', 'public']).optional(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession<AuthOptions, ServerSession>(req, res, authOptions)
    if (!session) {
      return res.status(401).end()
    }

    if (req.method === 'POST') {
      await createFileSchema.validate(req.body)
      const file = await prisma.file.create({
        data: {
          name: req.body.name,
          visibility: req.body.visibility.toUpperCase(),
          content: req.body.content,
          authorId: session.user.id,
        },
      })

      return res.json(file)
    }

    return res.status(405).end()
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(400).json({ message: 'File already exists' })
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message })
    }
    console.error(error)
    return res.status(500).end()
  }
}
