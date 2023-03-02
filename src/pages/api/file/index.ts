import prisma from '@/prisma-client'
import { FileVisibility, Prisma } from '@prisma/client'
import http from 'http'
import { getServerSession, ISODateString } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { object, string, ValidationError } from 'yup'
import { authOptions } from '../auth/[...nextauth]'

const createFileSchema = object({
  name: string().required().trim().min(1),
  content: string().optional(),
  visibility: string().oneOf(['private', 'public']).optional(),
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

type ServerSession = {
  user: {
    name: string
    id: string
  }
  expires: ISODateString
} | null

// TODO isn't there better way with middlewares... I know nextjs has middleware functionalities and need to reserch it, no time...
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: ServerSession = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }

  // TODO isn't there better way to handle http methid-to-route mapping?
  // To put it in another way - better ways provided by nextjs, without external modules (next-connect or smth)
  if (req.method === 'POST') {
    //TODO Validation, middlewares should be avaiable, but haven't used them in nextjs
    try {
      await createFileSchema.validate(req.body)
      const file = await createFile({
        name: req.body.name,
        visibility: req.body?.visibility?.toUpperCase() || FileVisibility.PRIVATE,
        content: req.body.content,
        authorId: session.user.id,
      })
      res.status(200).json(file)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        res.status(400).json({ message: 'File already exists' })
      }

      if (error instanceof ValidationError) {
        res.status(400).json({ name: error.name, message: error.message })
      }
      res.status(500).json({ message: http.STATUS_CODES[500] })
    }
  }

  res.status(405).end()
}
