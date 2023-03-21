import prisma from '@/prisma-client'
import { FileRoles, Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, getServerSession } from 'next-auth'
import { authOptions, ServerSession } from 'pages/api/auth/[...nextauth]'
import { object, string, ValidationError } from 'yup'

const filePermissionSchema = object({
  userId: string().required(),
  role: string().oneOf(['VIEWER', 'EDITOR', 'COMMENTER']).required(),
})

const removeFilePermissionSchema = object({
  userId: string().required(),
})

const resolveFileWithPermissions = async (fileId: string, sessionUserId: string) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    select: { authorId: true, name: true, FileMembership: true },
  })

  if (file?.authorId !== sessionUserId) return null
  return file
}

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
      return res.json(file)
    }

    if (req.method === 'PATCH') {
      const file = await resolveFileWithPermissions(id as string, session.user.id)
      if (!file) return res.status(404).end()

      await filePermissionSchema.validate(req.body)
      const { userId, role }: { userId: string; role: FileRoles } = req.body
      // do not allow self-assigning roles
      if (file.authorId === userId)
        return res.status(400).json({ message: 'Owner permissions already applied' })
      await prisma.fileMembership.update({
        where: {
          filePermissionIdentifier: {
            userId,
            fileId: id as string,
          },
        },
        data: {
          role,
        },
      })
      return res.status(200).end()
    }

    if (req.method === 'POST') {
      const file = await resolveFileWithPermissions(id as string, session.user.id)
      if (!file) return res.status(404).end()

      await filePermissionSchema.validate(req.body)
      const { userId, role }: { userId: string; role: FileRoles } = req.body
      // do not allow self-assigning roles
      if (file.authorId === userId)
        return res.status(400).json({ message: 'Owner permissions already applied' })
      await prisma.fileMembership.create({
        data: {
          userId,
          fileId: id as string,
          role,
        },
      })
      return res.status(200).end()
    }

    if (req.method === 'DELETE') {
      const file = await resolveFileWithPermissions(id as string, session.user.id)
      if (!file) return res.status(404).end()

      await removeFilePermissionSchema.validate(req.body)
      const { userId }: { userId: string } = req.body
      await prisma.fileMembership.delete({
        where: {
          filePermissionIdentifier: {
            userId,
            fileId: id as string,
          },
        },
      })
      return res.status(200).end()
    }

    res.status(405).end()
  } catch (error) {
    console.error(error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // trying to delete entity which does not exists also throws an error inside prisma-client
      if (error.code === 'P2025') return res.status(404).end()
      // invalid uuids are throwing validation errors inside prisma-client
      if (error.code === 'P2023') return res.status(400).json({ message: error.message })
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message })
    }

    res.status(500).end()
  }
}
