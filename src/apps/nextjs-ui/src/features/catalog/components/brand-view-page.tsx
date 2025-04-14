import { getBrand } from '../actions/brandsActions';
import { notFound } from 'next/navigation';
import BrandForm from './brand-form';

type TBrandViewPageProps = {
  brandId: string;
};

export default async function BrandViewPage({
  brandId
}: TBrandViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Brand';
  let mode: 'create' | 'update' = 'create';

  if (!brandId) {
    const brand = await getBrand(brandId);
    
    if (!product) {
      notFound();
    }

    pageTitle = `Edit Brand: ${brand.name}`;
    mode = 'update';
  }

  return <BrandForm initialData={product} pageTitle={pageTitle} mode={mode} />;
}
