import { Brand, BrandPagedListing } from '@/types/brand';
import { searchBrands } from '../actions/brandsActions';
import { searchParamsCache } from '@/lib/searchparams';
import { BrandTable } from './brand-tables';
import { columns } from './brand-tables/columns';
import { searchBrandsCommandSchema } from '../schemas/brandsSchemas';

export default async function BrandListingPage({}: BrandPagedListing) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = searchBrandsCommandSchema.parse({
    pageNumber: page ? Number(page) : undefined,
    pageSize: pageLimit ? Number(pageLimit) : undefined,
    keyword: search || undefined,
    orderBy: [],
    advancedSearch: {},
    advancedFilter: {}
  });

  const data = await searchBrands(filters);
  const totalProducts = data.totalCount;
  
  const brands: Brand[] = data.items.map((brand) => ({
    id: brand.id,
    name: brand.name,
    description: brand.description
  }));

  return (
    <BrandTable
      data={brands}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
