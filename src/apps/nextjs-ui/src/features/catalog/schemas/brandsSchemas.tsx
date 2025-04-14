import { z } from "zod";

export const createBrandCommandSchema = z.object({
  name: z.string().default("Sample Brand"),
  description: z.string().default("Descriptive Description"),
});

export const createBrandResponseSchema = z.object({
  id: z.string().uuid(),
});

export const brandResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
});

export const updateBrandCommandSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
});

export const searchBrandsCommandSchema = z.object({
  pageNumber: z.number().optional(),
  pageSize: z.number().optional(),
  orderBy: z.array(z.string()).optional(),
  keyword: z.string().optional(),
  advancedSearch: z.object({}).optional(), // Define advancedSearch schema if needed
  advancedFilter: z.object({}).optional(), // Define advancedFilter schema if needed
});

export const brandResponsePagedListSchema = z.object({
  items: z.array(brandResponseSchema),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
});