import type { User } from "next-auth";

export type RefreshTokenError = {
  error: string;
  message?: string;
};

interface CustomUser extends User {
  id: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  fullName?: string;
  tenant?: string;
  imageUrl?: string;
}
// Correctly export the type
export type { CustomUser };

function decodeJwtPayload(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
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

function GetUserFromTokenResponse(tokenPayload: string): Omit<CustomUser, 'accessToken' | 'refreshToken'> | null {
  try {
    const payload = decodeJwtPayload(tokenPayload);
    if (!payload) {
      console.error("Failed to decode token payload");
      return null;
    }
    const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    const userEmail = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    const firstName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const lastName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];
    const fullName = payload["fullName"] || `${firstName || ''} ${lastName || ''}`.trim();
    const tenantClaim = payload["tenant"];
    const imageUrl = payload["image_url"];
    const expiresAt = payload.exp ? payload.exp * 1000 : Date.now() + (60 * 60 * 1000);

    if (!userId || !userEmail) {
      console.error("Essential claims (userId, email) missing from token payload");
      return null;
    }

    const userDetails = {
      id: userId,
      email: userEmail,
      name: fullName || userEmail,
      accessTokenExpires: expiresAt,
      fullName: fullName,
      tenant: tenantClaim,
      imageUrl: imageUrl,
    };

    return userDetails as Omit<CustomUser, 'accessToken' | 'refreshToken'>;
  } catch (error) {
    console.error("Error during authentication request:", error);
    return null;
  }
}

export async function authenticate(email: string, password: string, tenant: string): Promise<CustomUser | null> {
  const apiUrl = process.env.API_URL || 'http://localhost:5000';
  const tenantId = tenant || 'root';

  try {
    console.log(`[Authenticate] Attempting to fetch: ${apiUrl}/api/token`);
    const response = await fetch(`${apiUrl}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'tenant': tenantId
      },
      body: JSON.stringify({ email, password })
    });
    console.log(`[Authenticate] Fetch completed. Status: ${response.status}, OK: ${response.ok}`);

    const data = await response.json();
    console.log("[Authenticate] Parsed API response data object:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error(`[Authenticate] API response not OK (${response.status}). Message: ${data?.message || response.statusText}`);
      return null;
    }

    const accessToken = data.token;
    const refreshToken = data.refreshToken;

    if (!accessToken || !refreshToken) {
      console.error("[Authenticate] Authentication response missing access or refresh token in data:", JSON.stringify(data, null, 2));
      return null;
    }

    const userDetails = GetUserFromTokenResponse(accessToken);

    if (!userDetails) {
      console.error("[Authenticate] GetUserFromTokenResponse failed for the received accessToken.");
      return null;
    }

    const user: CustomUser = {
      ...(userDetails as CustomUser),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return user;
  } catch (error) {
    console.error("[Authenticate] Caught error during authentication request:", error);
    return null;
  }
}

export async function refreshAccessToken(accessToken: string, refreshToken: string, tenant: string | null) {
  console.log("[refreshAccessToken] Starting token refresh...");
  console.log("[refreshAccessToken] accessToken:", accessToken);
  console.log("[refreshAccessToken] refreshToken:", refreshToken);
  console.log("[refreshAccessToken] tenant:", tenant);
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    const tenantId = tenant ?? 'root';

    if (!refreshToken) {
      console.error("No refresh token available for refresh attempt.");
      return { error: "MissingRefreshTokenError" };
    }

    const response = await fetch(`${apiUrl}/api/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'tenant': tenantId
      },
      body: JSON.stringify({ token: accessToken, refreshToken: refreshToken })
    });

    console.log("[refreshAccessToken] response.status:", response.status);
    console.log("[refreshAccessToken] response.statusText:", response.statusText);

    const refreshedTokens = await response.json();
    console.log("[refreshAccessToken] refreshedTokens:", JSON.stringify(refreshedTokens, null, 2));

    if (!response.ok) {
      console.error("Token refresh API call failed:", refreshedTokens?.message || response.statusText);
      console.log("[refreshAccessToken] response.status:", response.status);
      console.log("[refreshAccessToken] response.statusText:", response.statusText);
      return { error: "RefreshApiError", message: refreshedTokens?.message || response.statusText };
    }

    const newAccessToken = refreshedTokens.accessToken;
    const newRefreshToken = refreshedTokens.refreshToken;

    if (!newAccessToken || !newRefreshToken) {
      console.error("Token refresh response missing access or refresh token");
      return { error: "RefreshResponseMissingTokensError" };
    }

    const userDetails = GetUserFromTokenResponse(newAccessToken);

    if (!userDetails) {
      console.error("Failed to decode new access token during refresh.");
      return { error: "RefreshDecodeNewTokenError" };
    }

    const user: CustomUser = {
      ...(userDetails as CustomUser),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };

    return user;
  } catch (error: any) {
    console.error("[refreshAccessToken] Error during token refresh request:", error);
    if (error instanceof Error) {
      console.error("[refreshAccessToken] error.message:", error.message);
    }
    return { error: "RefreshFetchError" };
  }
}