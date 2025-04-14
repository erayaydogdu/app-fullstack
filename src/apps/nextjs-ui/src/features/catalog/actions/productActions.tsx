'use server'
import { getAccessToken } from "@/lib/api";
import { z } from "zod";
import { createProductCommandSchema, createProductResponseSchema,
    productResponseSchema,
    updateProductCommandSchema,
    searchProductsCommandSchema,
    productResponsePagedListSchema
 } from "../schemas/productSchemas";

export async function createProduct(
    data: z.infer<typeof createProductCommandSchema>
  ) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined");
    }
  
    // Validate the input data
    const result = createProductCommandSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/v1/catalog/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify(result.data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }
  
      const responseData = await response.json();
  
      // Validate the response data
      const parsedResponse = createProductResponseSchema.safeParse(responseData);
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
  
      console.error("Create product error:", error);
      throw new Error(errorMessage);
    }
  }
  
  export async function getProduct(id: string) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined");
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/v1/catalog/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getAccessToken()}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get product");
      }
  
      const responseData = await response.json();
  
      // Validate the response data
      const parsedResponse = productResponseSchema.safeParse(responseData);
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
  
      console.error("Get product error:", error);
      throw new Error(errorMessage);
    }
  }
  
  export async function updateProduct(
    id: string,
    data: z.infer<typeof updateProductCommandSchema>
  ) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined");
    }
  
    // Validate the input data
    const result = updateProductCommandSchema.safeParse({ ...data, id });
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/v1/catalog/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify(result.data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }
  
      const responseData = await response.json();
  
      // Validate the response data
      const parsedResponse = createProductResponseSchema.safeParse(responseData); // Assuming the response is the same as createProduct
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
  
      console.error("Update product error:", error);
      throw new Error(errorMessage);
    }
  }
  
  export async function deleteProduct(id: string) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined");
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/v1/catalog/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${await getAccessToken()}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
  
      return;
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred";
  
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
  
      console.error("Delete product error:", error);
      throw new Error(errorMessage);
    }
  }
  
  export async function searchProducts(
    data: z.infer<typeof searchProductsCommandSchema>
  ) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined");
    }
  
    // Validate the input data
    const result = searchProductsCommandSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/v1/catalog/products/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify(result.data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to search products");
      }
  
      const responseData = await response.json();
  
      // Validate the response data
      const parsedResponse = productResponsePagedListSchema.safeParse(responseData);
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
  
      console.error("Search products error:", error);
      throw new Error(errorMessage);
    }
  }
  