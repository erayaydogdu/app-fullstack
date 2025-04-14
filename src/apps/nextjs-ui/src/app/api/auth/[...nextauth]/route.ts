// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, User, Account, Profile } from "next-auth"; // Import User, Account, and Profile types
import { JWT } from "next-auth/jwt"; // Import JWT type
import CredentialsProvider from "next-auth/providers/credentials";
// Import functions and type from the updated lib/auth.ts
// Import functions and types from the updated lib/auth.ts
import { authenticate, CustomUser, refreshAccessToken, RefreshTokenError } from "@/lib/auth";


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

        const tenant = credentials.tenant || process.env.DEFAULT_TENANT || 'root';
        console.log(`[Authorize] Attempting authorization for email: ${credentials.email}, tenant: ${tenant}`);
        console.log("[Authorize] Received credentials:", JSON.stringify(credentials, null, 2)); // Log received credentials
        const user = await authenticate(credentials.email, credentials.password, tenant);
        console.log("[Authorize] Result from authenticate:", JSON.stringify(user, null, 2)); // Log the result from authenticate

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
    strategy: "jwt", 
  },
  callbacks: {
    // This callback is invoked whenever a JWT is created or updated.
    // Adjusted signature to match NextAuth expected types
    async jwt({ token, user, account }: {
      token: JWT;
      user?: User | CustomUser; // User is typically only passed on initial sign-in
      account?: Account | null; // Account is also typically only passed on initial sign-in
    }): Promise<JWT> {
      
      if (user && account) {
        console.log("[JWT Callback] Initial sign-in detected.");
        console.log("[JWT Callback] Received user object:", JSON.stringify(user, null, 2));
        console.log("[JWT Callback] Received account object:", JSON.stringify(account, null, 2));
        // Ensure we are dealing with our CustomUser from authorize
        const customUser = user as CustomUser;
        // Log the customUser object to verify casting and content
        console.log("[JWT Callback] Casted customUser object:", JSON.stringify(customUser, null, 2));
        // Construct the token object to be returned
        const tokenToReturn: JWT = {
          ...token, // Include existing token properties (like iat, exp if needed)
          accessToken: customUser.accessToken,
          refreshToken: customUser.refreshToken,
          accessTokenExpires: customUser.accessTokenExpires,
          id: customUser.id,
          email: customUser.email,
          name: customUser.name,
          fullName: customUser.fullName,
          tenant: customUser.tenant,
          imageUrl: customUser.imageUrl,
          error: null, // Clear any potential previous errors
        };
        console.log("[JWT Callback] Returning token for initial sign-in:", JSON.stringify(tokenToReturn, null, 2));
        return tokenToReturn; // Return the constructed token
      }

      // Check if the access token is still valid
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        console.log("[JWT Callback] Access token is still valid.");
        return token; // Return the existing token
      }

      if (!token.refreshToken) {
          console.error("JWT Callback: Attempted to refresh token, but no refresh token found.");
          // Mark the token with an error and return it. The session callback can handle this.
          return { ...token, error: "MissingRefreshTokenError" };
      }

      console.log("JWT Callback: Attempting token refresh.");
      const refreshToken = await refreshAccessToken(
        token.accessToken as string,
        token.refreshToken as string,
        token.tenant as string | null
      );

      // Check if the refresh resulted in an error object
      if (refreshToken && 'error' in refreshToken) {
        console.error(`JWT Callback: Token refresh failed with error: ${refreshToken.error}`, refreshToken.message || '');

        return {
          ...token,
          error: refreshToken.error // e.g., "RefreshApiError", "RefreshDecodeNewTokenError"
        };
      }

      // Check if the result is null (unexpected based on lib/auth.ts changes, but handle defensively)
      if (!refreshToken) {
          console.error("JWT Callback: Token refresh returned null or undefined unexpectedly.");
          return { ...token, error: "RefreshUnexpectedNullError" };
      }

      // If we reach here, refreshResult is a valid CustomUser
      console.log("JWT Callback: Token successfully refreshed.");
      const refreshedUser = refreshToken as CustomUser; // Type assertion for clarity

      return {
        ...token, // Keep essential JWT fields like iat, exp? (NextAuth might handle this)
        accessToken: refreshedUser.accessToken,
        refreshToken: refreshedUser.refreshToken, // *** Crucially update the refresh token ***
        accessTokenExpires: refreshedUser.accessTokenExpires,
        // Update user details as well
        id: refreshedUser.id,
        email: refreshedUser.email,
        name: refreshedUser.name,
        fullName: refreshedUser.fullName,
        tenant: refreshedUser.tenant,
        imageUrl: refreshedUser.imageUrl,
        error: null, // Clear any previous error
      };
    },

    // This callback is invoked whenever a session is checked.
    async session({ session, token }: { session: any; token: JWT }): Promise<any> {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name, 
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };