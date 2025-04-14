import { z } from "zod";

export const baseProductResponseSchema = z.object({
  name: z.string().nullable(),
  description: z.string().nullable(),
  price: z.number().nullable(),
  imageUrl: z.string().nullable(),
  brand: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
  }).nullable(),
});

export const createProductCommandSchema = z.object({
  ...baseProductResponseSchema.shape,
});

export const createProductResponseSchema = z.object({
  id: z.string().uuid(),
});

export const productResponseSchema = z.object({
  ...baseProductResponseSchema.shape,
  id: z.string().uuid(),
});

export const updateProductCommandSchema = z.object({
  ...baseProductResponseSchema.shape,
  id: z.string().uuid(),
});

export const searchProductsCommandSchema = z.object({
  pageNumber: z.number().optional(),
  pageSize: z.number().optional(),
  orderBy: z.array(z.string()).optional(),
  keyword: z.string().optional(),
  advancedSearch: z.object({}).optional(), // Define advancedSearch schema if needed
  advancedFilter: z.object({}).optional(), // Define advancedFilter schema if needed
  brandId: z.string().uuid().nullable().optional(),
  minimumRate: z.number().nullable().optional(),
  maximumRate: z.number().nullable().optional(),
});

export const productResponsePagedListSchema = z.object({
  items: z.array(productResponseSchema),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
});