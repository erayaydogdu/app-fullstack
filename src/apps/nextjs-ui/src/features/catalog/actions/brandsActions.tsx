'use server'
import { getAccessToken } from "@/lib/api";
import { z } from "zod";
import { brandResponseSchema, updateBrandCommandSchema,
  createBrandCommandSchema,
  createBrandResponseSchema,
  searchBrandsCommandSchema,
  brandResponsePagedListSchema
 } from "../schemas/brandsSchemas";

 const apiUrl = process.env.API_URL;

 export async function getBrand(id: string) {
  const bearerToken = await getAccessToken();
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/catalog/brands/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get brand");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = brandResponseSchema.safeParse(responseData);
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

    console.error("Get brand error:", error);
    throw new Error(errorMessage);
  }
}

export async function updateBrand(
  id: string,
  data: z.infer<typeof updateBrandCommandSchema>
) {
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not defined");
  }

  // Validate the input data
  const result = updateBrandCommandSchema.safeParse({ ...data, id });
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  const bearerToken = await getAccessToken();
  try {
    const response = await fetch(`${apiUrl}/api/v1/catalog/brands/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(result.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update brand");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = createBrandResponseSchema.safeParse(responseData); // Assuming the response is the same as createBrand
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

    console.error("Update brand error:", error);
    throw new Error(errorMessage);
  }
}

export async function deleteBrand(id: string) {
  
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not defined");
  }
  const bearerToken = await getAccessToken();
  try {
    const response = await fetch(`${apiUrl}/api/v1/catalog/brands/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${bearerToken}`,
      },
      });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete brand");
    }

    return;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Delete brand error:", error);
    throw new Error(errorMessage);
  }
}

export async function searchBrands(
  data: z.infer<typeof searchBrandsCommandSchema>
) {
  

  if (!apiUrl) {
    throw new Error("API_URL environment variable is not defined");
  }

  // Validate the input data
  const result = searchBrandsCommandSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  const bearerToken = await getAccessToken();
  try {
    const response = await fetch(`${apiUrl}/api/v1/catalog/brands/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(result.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search brands");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = brandResponsePagedListSchema.safeParse(responseData);
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

    console.error("Search brands error:", error);
    throw new Error(errorMessage);
  }
}

export async function createBrand(
  data: z.infer<typeof createBrandCommandSchema>
) {

  if (!apiUrl) {
    throw new Error("BACKEND_URL environment variable is not defined");
  }

  // Validate the input data
  const result = createBrandCommandSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  const bearerToken = await getAccessToken();
  try {
    const response = await fetch(`${apiUrl}/api/v1/catalog/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify(result.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create brand");
    }

    const responseData = await response.json();

    // Validate the response data
    const parsedResponse = createBrandResponseSchema.safeParse(responseData);
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

    console.error("Create brand error:", error);
    throw new Error(errorMessage);
  }
}