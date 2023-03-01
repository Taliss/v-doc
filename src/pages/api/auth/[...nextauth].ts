import axios from 'axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
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
          const response = await axios.post('http://localhost:3000/api/auth/login', {
            email: credentials?.email,
            password: credentials?.password,
          })
          return response.status === 200 && response?.data?.user ? response.data.user : null
        } catch (error) {
          error instanceof Error ? console.error(error.message) : console.error(error)
          return null
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
