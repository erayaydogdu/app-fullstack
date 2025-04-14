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
  name: z.string().nullable(),
  description: z.string().nullable(),
  pageNumber: z.number(),
  pageSize: z.number(),
  orderBy: z.array(z.string()).nullable(),
  keyword: z.string().nullable(),
  advancedSearch: z.object({}).nullable(), 
  advancedFilter: z.object({}).nullable(), 
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