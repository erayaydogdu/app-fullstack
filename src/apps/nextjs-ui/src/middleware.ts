import { withAuth } from "next-auth/middleware"
import { NextRequest } from 'next/server';


export default withAuth(
  // `withAuth` augments your `Request` with the `auth` property.
  function middleware(req) {
    // console.log("token: ", req.auth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true
      },
    },
  }
)
export const config = {
  matcher: [
    '/dashboard(.*)',
  ],
}
