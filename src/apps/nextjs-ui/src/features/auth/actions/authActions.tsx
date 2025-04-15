'use server'
import { z } from "zod";
import { selfRegisterUserCommandSchema, selfRegisterUserResponseSchema } from "../schemas/authSchema";


export async function selfRegisterUser(
    data: z.infer<typeof selfRegisterUserCommandSchema>,
    tenant: string
  ) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined");
    }
    
    try {
      console.log('Attempting to fetch:', `${apiUrl}/api/users/self-register`);
      const response = await fetch(`${apiUrl}/api/users/self-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          tenant: tenant
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log('[SelfRegister] Error response:', errorData);
        throw new Error(errorData.message || "Failed to self register user");
      }
  
      const responseData = await response.json();
  
      // Validate the response data
      const parsedResponse = selfRegisterUserResponseSchema.safeParse(responseData);
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
  
      console.error("Self register user error:", error);
      throw new Error(errorMessage);
    }
  }