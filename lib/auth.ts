import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          avatar: profile.picture,
          provider: 'google',
          providerId: profile.sub,
        }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.avatar = user.avatar
      }
      
      // Update user status to ONLINE on login (non-blocking)
      if (account && user) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              status: 'ONLINE',
              lastSeen: new Date()
            },
          }).catch(err => console.error('Failed to update user status:', err))
        } catch (error) {
          // Ignore error to not block login
          console.error('Failed to update user status:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.avatar = token.avatar as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to /chat after successful login
      if (url.includes('/api/auth/callback')) {
        return `${baseUrl}/chat`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  events: {
    async signOut({ token }) {
      // Update user status to OFFLINE on logout (non-blocking)
      if (token?.id) {
        try {
          await prisma.user.update({
            where: { id: token.id as string },
            data: { 
              status: 'OFFLINE',
              lastSeen: new Date()
            },
          }).catch(err => console.error('Failed to update user status on signout:', err))
        } catch (error) {
          console.error('Failed to update user status on signout:', error)
        }
      }
    },
  },
}
