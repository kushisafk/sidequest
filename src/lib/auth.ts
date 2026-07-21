import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
import { isAdminHandle } from "@/lib/admin"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const githubId = account.providerAccountId
        const githubHandle = (profile as { login?: string })?.login ?? token.name ?? "unknown"
        let dbUser = await prisma.user.findUnique({
          where: { githubId },
        })
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              githubId,
              githubHandle,
              name: token.name,
              avatar: token.picture,
            },
          })
        } else if (dbUser.githubHandle !== githubHandle) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { githubHandle },
          })
        }
        token.id = dbUser.id
        token.githubHandle = githubHandle
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        session.user.isAdmin = isAdminHandle(token.githubHandle as string)
      }
      return session
    },
  },
})
