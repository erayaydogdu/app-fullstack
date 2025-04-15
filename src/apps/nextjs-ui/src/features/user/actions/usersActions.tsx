import { z } from "zod";
import { registerUserCommandSchema, registerUserResponseSchema, updateUserCommandSchema,
  userDetailSchema, forgotPasswordCommandSchema, changePasswordCommandSchema,
  resetPasswordCommandSchema, toggleUserStatusCommandSchema, assignUserRoleCommandSchema,
  userRoleDetailSchema, auditTrailSchema
 } from "../schemas/usersSchemas";
import { getAccessToken } from "@/lib/api";

const apiUrl = process.env.API_URL;

export async function registerUser(
  data: z.infer<typeof registerUserCommandSchema>
) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register user");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = registerUserResponseSchema.safeParse(responseData);
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

    console.error("Register user error:", error);
    throw new Error(errorMessage);
  }
}


export async function updateUser(
  data: z.infer<typeof updateUserCommandSchema>
) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    return;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Update user error:", error);
    throw new Error(errorMessage);
  }
}

export async function getProfile() {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get user");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = userDetailSchema.safeParse(responseData);
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

    console.error("Get user error:", error);
    throw new Error(errorMessage);
  }
}

export async function getUsersList() {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get users list");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = z.array(userDetailSchema).safeParse(responseData);
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

    console.error("Get users list error:", error);
    throw new Error(errorMessage);
  }
}

export async function deleteUser(id: string) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete user");
    }

    return;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Delete user error:", error);
    throw new Error(errorMessage);
  }
}

export async function getUserById(id: string) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get user by id");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = userDetailSchema.safeParse(responseData);
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

    console.error("Get user by id error:", error);
    throw new Error(errorMessage);
  }
}

export async function forgotPassword(
  data: z.infer<typeof forgotPasswordCommandSchema>,
  tenant: string
) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`,
        tenant: tenant,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to forgot password");
    }

    return;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Forgot password error:", error);
    throw new Error(errorMessage);
  }
}

export async function changePassword(
  data: z.infer<typeof changePasswordCommandSchema>
) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change password");
    }

    return;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Change password error:", error);
    throw new Error(errorMessage);
  }
}

export async function resetPassword(
  data: z.infer<typeof resetPasswordCommandSchema>,
  tenant: string
) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`,
        tenant: tenant,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset password");
    }

    return;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Reset password error:", error);
    throw new Error(errorMessage);
  }
}

export async function getUserPermissions() {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/permissions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get user permissions");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = z.array(z.string()).safeParse(responseData);
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

    console.error("Get user permissions error:", error);
    throw new Error(errorMessage);
  }
}

export async function toggleUserStatus(
  id: string,
  data: z.infer<typeof toggleUserStatusCommandSchema>
) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/${id}/toggle-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to toggle user status");
    }

    return;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Toggle user status error:", error);
    throw new Error(errorMessage);
  }
}

export async function assignRolesToUser(
  id: string,
  data: z.infer<typeof assignUserRoleCommandSchema>
) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/${id}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to assign roles to user");
    }

    return;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Assign roles to user error:", error);
    throw new Error(errorMessage);
  }
}

export async function getUserRoles(id: string) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/${id}/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get user roles");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = z.array(userRoleDetailSchema).safeParse(responseData);
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

    console.error("Get user roles error:", error);
    throw new Error(errorMessage);
  }
}

export async function getUserAuditTrail(id: string) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/${id}/audit-trails`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get user audit trail");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = z.array(auditTrailSchema).safeParse(responseData);
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

    console.error("Get user audit trail error:", error);
    throw new Error(errorMessage);
  }
}

export async function confirmEmail(userId: string, code: string, tenant: string) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/users/confirm-email?userId=${userId}&code=${code}&tenant=${tenant}`, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        "Authorization": `Bearer ${bearerToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to confirm email");
    }

    const responseData = await response.text();

    return responseData;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Confirm email error:", error);
    throw new Error(errorMessage);
  }
}
