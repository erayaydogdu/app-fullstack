import { z } from "zod";
import { roleDtoSchema, createOrUpdateRoleCommandSchema, updatePermissionsCommandSchema } from "../schemas/rolesSchemas";
import { getAccessToken } from "@/lib/api";

const apiUrl = process.env.API_URL;

export async function getRoleById(id: string) {
    if (!apiUrl) {
      throw new Error("BACKEND_URL environment variable is not defined");
    }
    const bearerToken = await getAccessToken();
    try {
      const response = await fetch(`${apiUrl}/api/roles/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bearerToken}`
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get role");
      }
  
      const responseData = await response.json();
  
      // Validate the response data
      const parsedResponse = roleDtoSchema.safeParse(responseData);
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
  
      console.error("Get role error:", error);
      throw new Error(errorMessage);
    }
  }
  
  export async function deleteRole(id: string) {
    const bearerToken = await getAccessToken();
    if (!apiUrl) {
      throw new Error("BACKEND_URL environment variable is not defined");
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/roles/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${bearerToken}`
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete role");
      }
  
      return;
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred";
  
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
  
      console.error("Delete role error:", error);
      throw new Error(errorMessage);
    }
  }
  
  export async function getRoles() {
    const bearerToken = await getAccessToken();
    if (!apiUrl) {
      throw new Error("BACKEND_URL environment variable is not defined");
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/roles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bearerToken}`
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get roles");
      }
  
      const responseData = await response.json();
  
      // Validate the response data
      const parsedResponse = z.array(roleDtoSchema).safeParse(responseData);
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
  
      console.error("Get roles error:", error);
      throw new Error(errorMessage);
    }
  }
  
  export async function createOrUpdateRole(
    data: z.infer<typeof createOrUpdateRoleCommandSchema>
  ) {
    const bearerToken = await getAccessToken();
    if (!apiUrl) {
      throw new Error("BACKEND_URL environment variable is not defined");
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bearerToken}`
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create or update role");
      }
  
      const responseData = await response.json();
  
      // Validate the response data
      const parsedResponse = roleDtoSchema.safeParse(responseData);
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
  
      console.error("Create or update role error:", error);
      throw new Error(errorMessage);
    }
  }
  
  export async function getRolePermissions(id: string) {
    const bearerToken = await getAccessToken();
    if (!apiUrl) {
      throw new Error("BACKEND_URL environment variable is not defined");
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/roles/${id}/permissions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bearerToken}`
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get role permissions");
      }
  
      const responseData = await response.json();
  
      // Validate the response data
      const parsedResponse = roleDtoSchema.safeParse(responseData);
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
  
      console.error("Get role permissions error:", error);
      throw new Error(errorMessage);
    }
  }
  
  export async function updateRolePermissions(
    id: string,
    data: z.infer<typeof updatePermissionsCommandSchema>
  ) {
    const bearerToken = await getAccessToken();
    if (!apiUrl) {
      throw new Error("BACKEND_URL environment variable is not defined");
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/roles/${id}/permissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bearerToken}`
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update role permissions");
      }
  
      return;
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred";
  
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
  
      console.error("Update role permissions error:", error);
      throw new Error(errorMessage);
    }
  }
