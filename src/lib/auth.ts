import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Replace this with your actual user validation logic
        // This is just an example - in a real app, you'd check against a database
        const validUsername = process.env.ADMIN_USERNAME || 'admin'
        const validPasswordHash = process.env.ADMIN_PASSWORD_HASH || await bcrypt.hash('admin123', 12)

        if (credentials.username === validUsername) {
          const isValidPassword = await bcrypt.compare(credentials.password, validPasswordHash)
          
          if (isValidPassword) {
            return {
              id: '1',
              name: credentials.username,
              email: null,
            }
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}