import { z } from "zod";

export const selfRegisterUserCommandSchema = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nonempty(),
    userName: z.string().nullable(),
    password: z.string().nonempty(),
    confirmPassword: z.string().nonempty(),
    phoneNumber: z.string().nullable(),
  });

  export const selfRegisterUserResponseSchema = z.object({
    userId: z.string().nullable(),
  });