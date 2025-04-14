import { Brand } from './brand';

export type Product = {
    id: string;
    name: string | null;
    description: string | null;
    price: number | null;
    imageUrl: string | null;
    brand: Brand | null;
};

export type ProductPagedListing = {
    items: Product[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
};