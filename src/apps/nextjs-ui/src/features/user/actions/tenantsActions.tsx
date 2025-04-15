import { z } from "zod";
import { createTenantResponseSchema, createTenantCommandSchema, tenantDetailSchema,upgradeSubscriptionCommandSchema,
  upgradeSubscriptionResponseSchema, activateTenantResponseSchema, disableTenantResponseSchema
 } from "../schemas/tenantsSchemas";
import { getAccessToken } from "@/lib/api";

const apiUrl = process.env.API_URL;

export async function createOrUpdateTenant(
  data: z.infer<typeof createTenantCommandSchema>
) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/tenants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create tenant");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = createTenantResponseSchema.safeParse(responseData);
    if (!parsedResponse.success) {
      throw new Error(parsedResponse.error.errors[0].message);
    }

    return parsedResponse.data;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Create tenant error:", error);
    throw new Error(errorMessage);
  }
}

export async function getTenants() {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/tenants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get tenants");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = z.array(tenantDetailSchema).safeParse(responseData);
    if (!parsedResponse.success) {
      throw new Error(parsedResponse.error.errors[0].message);
    }

    return parsedResponse.data;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Get tenants error:", error);
    throw new Error(errorMessage);
  }
}

export async function getTenantById(id: string) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/tenants/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get tenant by id");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = tenantDetailSchema.safeParse(responseData);
    if (!parsedResponse.success) {
      throw new Error(parsedResponse.error.errors[0].message);
    }

    return parsedResponse.data;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Get tenant by id error:", error);
    throw new Error(errorMessage);
  }
}

export async function upgradeSubscription(
  data: z.infer<typeof upgradeSubscriptionCommandSchema>
) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/tenants/upgrade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upgrade subscription");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = upgradeSubscriptionResponseSchema.safeParse(responseData);
    if (!parsedResponse.success) {
      throw new Error(parsedResponse.error.errors[0].message);
    }

    return parsedResponse.data;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Upgrade subscription error:", error);
    throw new Error(errorMessage);
  }
}

export async function activateTenant(id: string) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/tenants/${id}/activate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to activate tenant");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = activateTenantResponseSchema.safeParse(responseData);
    if (!parsedResponse.success) {
      throw new Error(parsedResponse.error.errors[0].message);
    }

    return parsedResponse.data;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Activate tenant error:", error);
    throw new Error(errorMessage);
  }
}

export async function disableTenant(id: string) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/tenants/${id}/deactivate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to disable tenant");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = disableTenantResponseSchema.safeParse(responseData);
    if (!parsedResponse.success) {
      throw new Error(parsedResponse.error.errors[0].message);
    }

    return parsedResponse.data;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Disable tenant error:", error);
    throw new Error(errorMessage);
  }
}
