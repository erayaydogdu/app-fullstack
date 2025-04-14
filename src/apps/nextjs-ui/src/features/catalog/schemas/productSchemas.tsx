import { z } from "zod";

export const baseProductResponseSchema = z.object({
  name: z.string().nullable(),
  description: z.string().nullable(),
  price: z.number().nullable(),
  imageUrl: z.string().nullable(),
  brand: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
  }).nullable()
});

export const createProductCommandSchema = z.object({
  ...baseProductResponseSchema.shape,
});

export const createProductResponseSchema = z.object({
  id: z.string(),
});

export const productResponseSchema = z.object({
  ...baseProductResponseSchema.shape,
  id: z.string(),
});

export const updateProductCommandSchema = z.object({
  ...baseProductResponseSchema.shape,
  id: z.string().uuid(),
});

export const searchProductsCommandSchema = z.object({
  pageNumber: z.number().optional(),
  pageSize: z.number().optional(),
  orderBy: z.array(z.string()).optional(),
  keyword: z.string().nullable().optional(),
  advancedSearch: z.object({}).nullable(), 
  advancedFilter: z.object({}).nullable(), 
  brandId: z.string().nullable(),
  minimumRate: z.number().nullable(),
  maximumRate: z.number().nullable(),
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
