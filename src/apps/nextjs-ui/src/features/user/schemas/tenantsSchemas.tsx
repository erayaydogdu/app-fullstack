import { z } from "zod";

// Define the request and response schemas
export const createTenantCommandSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  connectionString: z.string().nullable(),
  adminEmail: z.string().nullable(),
  issuer: z.string().nullable(),
});

export const createTenantResponseSchema = z.object({
  id: z.string().nullable(),
});

export const tenantDetailSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  connectionString: z.string().nullable(),
  adminEmail: z.string().nullable(),
  isActive: z.boolean(),
  validUpto: z.string().nullable(),
  issuer: z.string().nullable(),
});

export const upgradeSubscriptionCommandSchema = z.object({
  tenant: z.string().nullable(),
  extendedExpiryDate: z.string(),
});

export const upgradeSubscriptionResponseSchema = z.object({
  newValidity: z.string(),
  tenant: z.string().nullable(),
});

export const activateTenantResponseSchema = z.object({
  status: z.string().nullable(),
});

export const disableTenantResponseSchema = z.object({
  status: z.string().nullable(),
});