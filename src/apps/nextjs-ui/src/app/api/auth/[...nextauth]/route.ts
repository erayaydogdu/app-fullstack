// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, User } from "next-auth"; // Import User type
import { JWT } from "next-auth/jwt"; // Import JWT type
import CredentialsProvider from "next-auth/providers/credentials";
// Import functions and type from the updated lib/auth.ts
import { authenticate, CustomUser, refreshAccessToken } from "@/lib/auth";


export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenant : { label: "Tenant", type: "text" }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        // Basic validation
        if (!credentials?.email || !credentials?.password) {
          console.error("Authorize callback: Missing email or password");
          return null;
        }
        // Call the backend authentication function from lib/auth.ts
        // Pass tenant, using a default if not provided in credentials
        const tenant = credentials.tenant || process.env.DEFAULT_TENANT || 'root';
        console.log(`Attempting authorization for email: ${credentials.email}, tenant: ${tenant}`);
        const user = await authenticate(credentials.email, credentials.password, tenant);

        if (user) {
          console.log(`Authorization successful for email: ${credentials.email}`);
          return user; // Return the CustomUser object from authenticate
        } else {
          console.error(`Authorization failed for email: ${credentials.email}`);
          return null; // Return null if authentication failed
        }
      }
    }),
  ],
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session strategy
  },
  callbacks: {
    // This callback is invoked whenever a JWT is created or updated.
    async jwt({ token, user, account }: { token: JWT; user?: CustomUser | User; account?: any }): Promise<JWT> {
      // console.log("JWT Callback - Initial token:", token);
      // console.log("JWT Callback - User object:", user);
      // console.log("JWT Callback - Account object:", account);

      // Case 1: Initial sign in
      // The 'user' object is passed only on the first call after sign-in.
      // It contains the object returned by the 'authorize' callback.
      if (account && user) {
        console.log("JWT Callback: Initial sign-in detected.");
        // Ensure we are dealing with our CustomUser from authorize
        const customUser = user as CustomUser;
        // Persist the access_token, refresh_token, and expiry time from the CustomUser to the JWT token
        return {
          ...token, // Keep default JWT properties
          accessToken: customUser.accessToken,
          refreshToken: customUser.refreshToken,
          accessTokenExpires: customUser.accessTokenExpires,
          id: customUser.id,
          email: customUser.email,
          name: customUser.name,
          fullName: customUser.fullName,
          tenant: customUser.tenant,
          imageUrl: customUser.imageUrl,
          error: null, // Clear any potential error from previous attempts
        };
      }

      // Case 2: Subsequent requests - Access token is still valid
      // Check if the access token expiry time exists and is in the future.
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        // console.log("JWT Callback: Access token is valid.");
        return token; // Return the existing token without modification
      }

      // Case 3: Subsequent requests - Access token has expired
      // console.log("JWT Callback: Access token has expired or expiry is missing.");
      // Check if a refresh token exists.
      if (!token.refreshToken) {
          console.error("JWT Callback: Attempted to refresh token, but no refresh token found.");
          // Mark the token with an error and return it. The session callback can handle this.
          return { ...token, error: "MissingRefreshTokenError" };
      }

      // console.log("JWT Callback: Attempting to refresh access token.");
      // Call the refreshAccessToken function (from lib/auth.ts) which handles the API call
      // Pass the entire current token object, which includes the refresh token.
      const refreshedToken = await refreshAccessToken(token);
      // console.log("JWT Callback: Refreshed token result:", refreshedToken);
      return refreshedToken; // Return the updated token (or token with error if refresh failed)
    },

    // This callback is invoked whenever a session is checked.
    async session({ session, token }: { session: any; token: JWT }): Promise<any> {
      // console.log("Session Callback - Input session:", session);
      // console.log("Session Callback - Input token:", token);

      // Transfer information from the JWT token to the session object.
      // This makes the data available to the client-side via useSession() or getSession().
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name, // Use the name property from the token
        fullName: token.fullName,
        tenant: token.tenant,
        imageUrl: token.imageUrl,
      };
      // Also pass the access token and any error flags to the session
      session.accessToken = token.accessToken;
      session.error = token.error; // Propagate error state (e.g., "RefreshAccessTokenError")

      // console.log("Session Callback - Output session:", session);
      return session; // The session object is returned to the client
    },
  },
  pages: {
    signIn: '/auth/sign-in', // Custom sign-in page
    // Define other pages if needed
    // error: '/auth/error',
  },
  // Secret is required for JWT strategy, especially in production
  secret: process.env.NEXTAUTH_SECRET,
  // Enable debug messages in development for more insight
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };