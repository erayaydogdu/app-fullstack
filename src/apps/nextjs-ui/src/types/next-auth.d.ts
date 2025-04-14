import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      /** Omitted if you don't have a custom user type */
      accessToken?: string
    } & DefaultSession["user"]
  }
}