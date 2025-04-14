'use server'
import { getAccessToken } from "@/lib/api";
import { z } from "zod";
import { brandResponseSchema, updateBrandCommandSchema,
  createBrandResponseSchema,
  searchBrandsCommandSchema,
  brandResponsePagedListSchema
 } from "../schemas/brandsSchemas";

 export async function getBrand(id: string) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/catalog/brands/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await getAccessToken()}`,
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
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not defined");
  }

  // Validate the input data
  const result = updateBrandCommandSchema.safeParse({ ...data, id });
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/catalog/brands/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await getAccessToken()}`,
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
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not defined");
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/catalog/brands/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${await getAccessToken()}`,
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
  const bearerToken = await getAccessToken();
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("API_URL environment variable is not defined");
  }

  // Validate the input data
  const result = searchBrandsCommandSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

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
