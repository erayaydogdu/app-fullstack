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

// Define a type for refresh token errors
export type RefreshTokenError = {
  error: string;
  message?: string;
};
// Define a type for the decoded user details (without the raw tokens)
type DecodedUserDetails = Omit<CustomUser, 'accessToken' | 'refreshToken'> & {
  accessTokenExpires: number;
};

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


// This function now returns only the decoded details, not the full CustomUser
function GetUserFromTokenResponse(response : string): DecodedUserDetails | null {
  try {
    const payload = decodeJwtPayload(response);
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

    // Create a user details object containing only the decoded details.
    // The actual tokens will be added by the calling function (authenticate or refreshAccessToken).
    const userDetails: DecodedUserDetails = {
      id: userId,
      email: userEmail,
      name: fullName || userEmail,
      // accessToken: response, // Removed: Incorrectly assigned access token string
      // refreshToken: response, // Removed: Incorrectly assigned access token string
      accessTokenExpires: expiresAt,
      fullName: fullName,
      tenant: tenantClaim, // Assign the extracted tenant claim
      imageUrl: imageUrl,
    };

    return userDetails;

  } catch (error) {
    console.error("Error during authentication request:", error);
    return null;
  }
}

export async function authenticate(email: string, password: string, tenant: string): Promise<CustomUser | null> {
  const apiUrl = process.env.API_URL || 'http://localhost:5000';
  // Use provided tenant or default to 'root'
  const tenantId = tenant || 'root';

  try {
    console.log(`[Authenticate] Attempting to fetch: ${apiUrl}/api/token`); // Log before fetch
    const response = await fetch(`${apiUrl}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'tenant': tenantId
      },
      body: JSON.stringify({ email, password })
    });
    console.log(`[Authenticate] Fetch completed. Status: ${response.status}, OK: ${response.ok}`); // Log after fetch

    const data = await response.json();
    console.log("[Authenticate] Parsed API response data object:", JSON.stringify(data, null, 2)); // Log the parsed data object

    if (!response.ok) {
      // Log the failure reason before returning null
      console.error(`[Authenticate] API response not OK (${response.status}). Message: ${data?.message || response.statusText}`);
      return null; // Return null on API failure as expected by authorize
    }

    // Extract tokens from the response data
    const accessToken = data.token;
    const refreshToken = data.refreshToken;

    if (!accessToken || !refreshToken) {
        // Log the data object when tokens are missing
        console.error("[Authenticate] Authentication response missing access or refresh token in data:", JSON.stringify(data, null, 2));
        return null;
    }

    // Decode user details from the access token
    // Decode user details from the access token
    const userDetails = GetUserFromTokenResponse(accessToken);

    // Add the tokens to the user object before returning
    // If decoding failed, return null
    if (!userDetails) {
        console.error("[Authenticate] GetUserFromTokenResponse failed for the received accessToken.");
        return null;
    }

    // Construct the final CustomUser object
    const user: CustomUser = {
        ...userDetails,
        accessToken: accessToken, // Add the actual access token
        refreshToken: refreshToken, // Add the actual refresh token
    };

    return user;

  } catch (error) {
    // Log the specific error caught in the try...catch block
    console.error("[Authenticate] Caught error during authentication request:", error);
    return null; // Keep returning null for initial auth failure
  }
}


export async function refreshAccessToken(accessToken:string, refreshToken:string, tenant: string | null){
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    // Get tenant from the existing token, fallback to env var or 'root'
    const tenantId = tenant ?? 'root';

    if (!refreshToken) {
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
      body: JSON.stringify({ token: accessToken,refreshToken: refreshToken})
    });
    

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("Token refresh API call failed:", refreshedTokens?.message || response.statusText);
      // Return an error object instead of throwing or returning null
      return { error: "RefreshApiError", message: refreshedTokens?.message || response.statusText };
    }

    // Extract new tokens from the response
    const newAccessToken = refreshedTokens.accessToken;
    const newRefreshToken = refreshedTokens.refreshToken;

    if (!newAccessToken || !newRefreshToken) {
        console.error("Token refresh response missing access or refresh token");
        // Return an error object
        return { error: "RefreshResponseMissingTokensError" };
    }

    // Decode user details from the new access token
    // Decode user details from the new access token
    const userDetails = GetUserFromTokenResponse(newAccessToken);

    // Add the new tokens to the user object before returning
    // If decoding failed, return error
    if (!userDetails) {
        console.error("Failed to decode new access token during refresh.");
        return { error: "RefreshDecodeNewTokenError" };
    }

    // Construct the final CustomUser object for refresh
    const user: CustomUser = {
        ...userDetails,
        accessToken: newAccessToken, // Add the actual new access token
        refreshToken: newRefreshToken, // Add the actual new refresh token
    };

    return user; // Return the updated user object

  } catch (error) {
    console.error("Error during token refresh request:", error);
    // Return an error object on fetch or other unexpected errors
    return { error: "RefreshFetchError" };
  }
}