import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import BrandViewPage from '@/features/catalog/components/brand-view-page';

export const metadata = {
  title: 'Dashboard : Create Brand'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <BrandViewPage brandId="create" />
        </Suspense>
      </div>
    </PageContainer>
  );
}