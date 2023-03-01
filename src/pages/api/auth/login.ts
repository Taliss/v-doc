import prisma from '@/prisma-client'
import bcrypt from 'bcrypt'
import http from 'http'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: http.STATUS_CODES[405] })
  }

  const { email, password } = req.body
  // TODO: validation
  if (!email || !password) return res.status(400).json({ message: http.STATUS_CODES[400] })

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).send(null)
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(400).send(null)
    } else {
      return res.status(200).json({ user: { email: user.email, id: user.id } })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: http.STATUS_CODES[500] })
  }
}
