import { Product,ProductPagedListing } from '@/types/product';
import { searchProducts } from '../actions/productActions';
import { searchParamsCache } from '@/lib/searchparams';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { searchProductsCommandSchema } from '../schemas/productSchemas';

export default async function ProductListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('productKeyword');
  const pageLimit = searchParamsCache.get('perPage');
  const brandId = searchParamsCache.get('brandId');

  const filters = searchProductsCommandSchema.parse({
    pageNumber: page ? Number(page) : 1,
    pageSize: pageLimit ? Number(pageLimit) : 10,
    keyword: search || null,
    orderBy: ["id desc"] as string[], 
    advancedSearch: null, 
    advancedFilter: null,
    brandId: brandId ? String(brandId) : null,
    minimumRate: null,
    maximumRate: null
  });

  const data = await searchProducts(filters);
  const totalProducts = data.totalCount;
  
  const products: Product[] = data.items.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price ?? 0,
    imageUrl: product.imageUrl,
    brand: {
      id: product.brand?.id,
      name: product.brand?.name,
      description: product.brand?.description
    }
  }));

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
