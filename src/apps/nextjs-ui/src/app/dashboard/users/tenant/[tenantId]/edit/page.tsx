import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { TenantForm } from '@/features/user/components/tenant-form';
import { getTenantById } from '@/features/user/actions/tenantsActions'; // Action to fetch tenant by ID
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface EditTenantPageProps {
  params: {
    tenantId: string;
  };
}

// Helper component to fetch data and render form
async function EditTenantFormLoader({ tenantId }: { tenantId: string }) {
  const tenant = await getTenantById(tenantId);

  if (!tenant) {
    notFound(); // Show 404 if tenant doesn't exist
  }

  // TODO: Adapt the fetched tenant data structure if it doesn't match TenantFormValues exactly
  // For now, assuming it matches or can be partially used.
  // The TenantForm currently expects createTenantCommandSchema structure.
  // We might need to adjust TenantForm or use updateTenantCommandSchema later.
  const initialData = {
    name: tenant.name,
    connectionString: tenant.connectionString,
    adminEmail: tenant.adminEmail,
    issuer: tenant.issuer,
    id: tenant.id,
  };

  return <TenantForm initialData={initialData} />;
}

export default function EditTenantPage({ params }: EditTenantPageProps) {
  const { tenantId } = params;

  return (
    <div className="p-4 md:p-8">
      <Suspense fallback={<EditTenantFormSkeleton />}>
        <EditTenantFormLoader tenantId={tenantId} />
      </Suspense>
    </div>
  );
}

// Basic skeleton for the form page while loading data
function EditTenantFormSkeleton() {
  return (
    <div>
      {/* Skeleton for Heading */}
      <div className="flex items-center justify-between">
         <div className="space-y-2">
           <Skeleton className="h-7 w-32" />
           <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="my-4 h-px w-full" /> {/* Separator */}
      {/* Skeleton for Form Fields */}
      <div className="space-y-8">
         <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            ))}
         </div>
         {/* Skeleton for Buttons */}
         <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
         </div>
      </div>
    </div>
  );
}