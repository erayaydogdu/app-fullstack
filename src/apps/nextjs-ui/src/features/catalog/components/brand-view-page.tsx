import { getBrand } from '../actions/brandsActions';
import { notFound } from 'next/navigation';
import BrandForm from './brand-form';

type TBrandViewPageProps = {
  brandId: string;
};

export default async function BrandViewPage({
  brandId
}: TBrandViewPageProps) {
  let brand = null;
  let pageTitle = 'Create New Brand';
  let mode: 'create' | 'update' = 'create';

  if (brandId && brandId !== 'create') {
    try {
      // Since getBrand is a server action, we await it here
      brand = await getBrand(brandId);
      if (!brand) {
        notFound();
      }
      pageTitle = `Edit Brand: ${brand.name}`;
      mode = 'update';
    } catch (error) {
      console.error('Error fetching brand:', error);
      notFound();
    }
  }

  return (
    <BrandForm 
      initialData={brand} 
      pageTitle={pageTitle} 
      mode={mode} 
    />
  );
}
