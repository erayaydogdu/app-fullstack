import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import BrandViewPage from '@/features/catalog/components/brand-view-page';

export const metadata = {
  title: 'Dashboard : Product View'
};

type PageProps = { params: Promise<{ brandId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <BrandViewPage brandId={params.brandId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
