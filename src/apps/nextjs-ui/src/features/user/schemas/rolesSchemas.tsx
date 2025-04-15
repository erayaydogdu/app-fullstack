import { z } from "zod";

// Define the request and response schemas
export const roleDtoSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  permissions: z.array(z.string()).nullable(),
});

export const createOrUpdateRoleCommandSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
});

export const updatePermissionsCommandSchema = z.object({
  roleId: z.string().nullable(),
  permissions: z.array(z.string()).nullable(),
});