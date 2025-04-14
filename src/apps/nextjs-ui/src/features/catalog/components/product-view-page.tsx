import { getProduct } from '../actions/productActions';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Product';
  let mode: 'create' | 'update' = 'create';

  if (productId && productId !== 'create') {
      try {
        const product = await getProduct(productId);
        if (!product) {
          notFound();
        }
        pageTitle = `Edit Product: ${product.name}`;
        mode = 'update';
      } catch (error) {
        notFound();
      }
    }

  return <ProductForm initialData={product} pageTitle={pageTitle} mode={mode} />;
}
