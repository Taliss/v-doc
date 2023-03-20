import prisma from '@/prisma-client'
import { FileVisibility, Prisma } from '@prisma/client'
import http from 'http'
import { getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { object, string, ValidationError } from 'yup'
import { authOptions, ServerSession } from '../auth/[...nextauth]'

const createFileSchema = object({
  name: string().required().trim().min(1),
  // TODO add validation for content
  content: object().optional(),
  visibility: string().oneOf(['private', 'public']).optional(),
})

const updateVisibilitySchema = object({
  fileId: string().required(),
  visibility: string().oneOf(['private', 'public']).optional(),
  content: object().optional(),
}).test('at-least-one-property', 'Provide visibility or content field', (value) => {
  return !!(value.visibility || value.content)
})

// TODO: PIPES - MIDDLEWARES - COMPOSE ?!?!?
// TODO: how to make requests body type safe, need to research it
const createFile = async ({
  name,
  content,
  visibility,
  authorId,
}: Prisma.FileUncheckedCreateInput) => {
  const file = await prisma.file.create({
    data: {
      name,
      content,
      visibility,
      authorId,
    },
  })

  return file
}

// TODO isn't there better way with middlewares... I know nextjs has middleware functionalities and need to reserch it, no time...
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: ServerSession | null = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }

  // TODO isn't there better way to handle http methid-to-route mapping?
  // To put it in another way - better ways provided by nextjs, without external modules (next-connect or smth)
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

  if (req.method === 'POST') {
    //TODO Validation, middlewares should be avaiable, but haven't used them in nextjs
    try {
      await createFileSchema.validate(req.body)
      const file = await createFile({
        name: req.body.name,
        visibility: req.body.visibility.toUpperCase(),
        content: req.body.content,
        authorId: session.user.id,
      })
      return res.status(200).json(file)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(400).json({ message: 'File already exists' })
      }

      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message })
      }
      return res.status(500).json({ message: http.STATUS_CODES[500] })
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

  if (req.method === 'DELETE') {
    // TODO: Not sure if Prisma supports RLS so we stick with extra query
    if (!req?.body.fileId) {
      return res.status(400).end()
    }

    // this try-catch is bad, error-handling middleware is required, no time to research it
    try {
      const fileMatchQuery = { where: { id: req.body.fileId } }
      const file = await prisma.file.findUnique(fileMatchQuery)

      if (!file) return res.status(404).end()
      if (file.authorId !== session.user.id) {
        return res.status(400).end()
      }

      // actually delete the file, no time for archived
      await prisma.file.delete(fileMatchQuery)

      return res.status(200).end()
    } catch (error) {
      // not throwing is bad as it deafens the error, but we will do it :)
      console.error(error)
      res.status(500).end()
    }
  }

  res.status(405).end()
}
