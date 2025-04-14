import type { User } from "next-auth";
import type { JWT } from "next-auth/jwt"; // Import JWT type for token object

// Extend the User type to include the properties from your token
// and the tokens themselves
interface CustomUser extends User {
  id: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number; // Store expiry time in ms
  // Add other properties from your token payload if needed
  fullName?: string;
  tenant?: string;
  imageUrl?: string;
}
// Correctly export the type
export type { CustomUser };

// Helper function to decode JWT payload (basic base64 decoding)
// Note: For production, consider using a robust library like 'jose' or 'jsonwebtoken'
// if you need signature verification or more complex handling.
function decodeJwtPayload(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null; // Check if payload exists
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT payload:", error);
    return null;
  }
}

export async function authenticate(email: string, password: string, tenant: string): Promise<CustomUser | null> {
  const apiUrl = process.env.API_URL || 'http://localhost:7000';
  // Use provided tenant or default to 'root'
  const tenantId = tenant || 'root';

  try {
    const response = await fetch(`${apiUrl}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'tenant': tenantId
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Authentication failed:", data?.message || response.statusText);
      return null; // Return null on failure as expected by authorize
    }

    const accessToken = data.token;
    const refreshToken = data.refreshToken;
    const payload = decodeJwtPayload(accessToken);

    if (!payload) {
      console.error("Failed to decode token payload");
      return null;
    }

    // Extract claims based on the provided structure
    const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    const userEmail = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    const firstName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const lastName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];
    const fullName = payload["fullName"] || `${firstName || ''} ${lastName || ''}`.trim();
    const tenantClaim = payload["tenant"]; // Use a different variable name to avoid shadowing
    const imageUrl = payload["image_url"];
    const expiresAt = payload.exp ? payload.exp * 1000 : Date.now() + (60 * 60 * 1000);

    if (!userId || !userEmail) {
        console.error("Essential claims (userId, email) missing from token payload");
        return null;
    }

    const user: CustomUser = {
      id: userId,
      email: userEmail,
      name: fullName || userEmail,
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpires: expiresAt,
      fullName: fullName,
      tenant: tenantClaim, // Assign the extracted tenant claim
      imageUrl: imageUrl,
    };

    return user;

  } catch (error) {
    console.error("Error during authentication request:", error);
    return null;
  }
}

// Modify refreshAccessToken to accept the token object (JWT)
export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:7000';
    // Get tenant from the existing token, fallback to env var or 'root'
    const tenantId = token.tenant as string || process.env.TENANT_ID || 'root';

    if (!token.refreshToken) {
        console.error("No refresh token available for refresh attempt.");
        throw new Error("Missing refresh token");
    }

    const response = await fetch(`${apiUrl}/api/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'tenant': tenantId
      },
      // Ensure the body sends the refreshToken correctly
      body: JSON.stringify({ refreshToken: token.refreshToken as string })
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed:", refreshedTokens?.message || response.statusText);
      // Return the original token with an error property
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const newAccessToken = refreshedTokens.token;
    const newPayload = decodeJwtPayload(newAccessToken);

    if (!newPayload) {
      console.error("Failed to decode new access token payload after refresh");
       // Return the original token with an error property
       return {
        ...token,
        error: "DecodeRefreshedTokenError",
      };
    }

    // Return the original token merged with new access token details
    return {
      ...token, // Keep existing properties (id, email, name, etc.)
      accessToken: newAccessToken,
      accessTokenExpires: newPayload.exp ? newPayload.exp * 1000 : Date.now() + (60 * 60 * 1000),
      // Update refresh token if the backend sent a new one, otherwise keep the old one
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      error: null, // Clear any previous error
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    // Return the original token with an error property
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}