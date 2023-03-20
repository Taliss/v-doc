import axios from 'axios'
import NextAuth, { ISODateString, NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export type ServerSession = {
  user: {
    email: string
    id: string
  }
  expires: ISODateString
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 1, //1 hours
    updateAge: 60 * 10, // 10 minutes
  },
  jwt: {
    maxAge: 60 * 60 * 1, // 1 hour
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }
        try {
          const { data, status } = await axios.post('http://localhost:3000/api/auth/login', {
            email: credentials?.email,
            password: credentials?.password,
          })

          if (status === 200) {
            return data?.user
          } else {
            return null
          }
        } catch (error) {
          error instanceof Error ? console.error(error.message) : console.error(error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // TODO: Why is next-auth populating user object with default undefined values...
      // Also the typings are terrible...
      // @ts-ignore
      session.user = { id: token.id, email: session.user.email }
      return session as ServerSession
    },
    async jwt({ account, token, user }) {
      if (account?.provider === 'credentials' && user) {
        token.id = user.id
      }
      return token
    },
  },
}

export default NextAuth(authOptions)
