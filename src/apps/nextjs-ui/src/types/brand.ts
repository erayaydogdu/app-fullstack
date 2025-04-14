export type Brand = {
    id: string;
    name: string;
    description: string | null;
  };

  export type BrandPagedListing = {
    items: Brand[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };