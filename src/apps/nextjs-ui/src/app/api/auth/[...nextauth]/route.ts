// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { User } from "next-auth";

interface CustomUser extends User {
  id: string;
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider( {
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      name: "credentials",
      async authorize(credentials: any, req: any) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        // Replace this with your actual authentication logic
        // For example, you can call your backend API to verify the credentials
        const user = await authenticate(email, password);

        async function authenticate(email: string, password: string) {
          // Replace this with your actual authentication logic
          // For example, you can call your backend API to verify the credentials
          // const user = await fetch('/api/login', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({ email, password })
          // });
          // return user;
          const user: CustomUser = { id: "1", name: "Test User", email: email };
          return user;
        }

        if (user) {
          // Any object returned will be saved in "user" property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also reject with a callback URL
          // To redirect to, if instead of the "check your details" error page you want to redirect them to a specific page:
          // throw new Error('/login?errorMessage=' + message) // Redirect to the login page with the error message
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }