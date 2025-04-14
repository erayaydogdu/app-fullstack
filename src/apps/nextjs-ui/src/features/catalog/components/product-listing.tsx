import { Product,ProductPagedListing } from '@/types/product';
import { searchProducts } from '../actions/productActions';
import { searchParamsCache } from '@/lib/searchparams';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { searchProductsCommandSchema } from '../schemas/productSchemas';

export default async function ProductListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = searchProductsCommandSchema.parse({
    pageNumber: page ? Number(page) : undefined,
    pageSize: pageLimit ? Number(pageLimit) : undefined,
    keyword: search || undefined,
    orderBy: [] as string[], 
    advancedSearch: {}, 
    advancedFilter: {}
  });

  const data = await searchProducts(filters);
  const totalProducts = data.totalCount;
  
  const products: Product[] = data.items.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price ?? 0,
    imageUrl: product.imageUrl ?? '',
    brand: product.brand ?? null
  }));

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
