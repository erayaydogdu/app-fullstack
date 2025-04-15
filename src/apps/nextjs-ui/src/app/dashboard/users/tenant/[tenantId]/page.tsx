import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTenantById } from '@/features/user/actions/tenantsActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { ArrowLeft } from 'lucide-react';

interface ViewTenantPageProps {
  params: {
    tenantId: string;
  };
}

// Helper component to fetch data and render tenant details
async function ViewTenantLoader({ tenantId }: { tenantId: string }) {
  const tenant = await getTenantById(tenantId);

  if (!tenant) {
    notFound(); // Show 404 if tenant doesn't exist
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tenant.name || 'Unnamed Tenant'}</CardTitle>
        <CardDescription>Tenant ID: {tenant.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Connection String</p>
          <p>{tenant.connectionString || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Admin Email</p>
          <p>{tenant.adminEmail || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Issuer</p>
          <p>{tenant.issuer || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Active</p>
          <p>{tenant.isActive ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Valid Until</p>
          <p>{tenant.validUpto || '-'}</p>
        </div>
        {/* Add other relevant fields here */}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild>
          <Link href={`/dashboard/users/tenant/${tenant.id}/edit`}>Edit Tenant</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ViewTenantPage({ params }: ViewTenantPageProps) {
  const { tenantId } = params;

  return (
    <div className="p-4 md:p-8 space-y-4">
       <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/users/tenant">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Tenants</span>
            </Link>
          </Button>
         <Heading title="Tenant Details" description="View information about a specific tenant." />
       </div>
       <Separator />
      <Suspense fallback={<ViewTenantSkeleton />}>
        <ViewTenantLoader tenantId={tenantId} />
      </Suspense>
    </div>
  );
}

// Basic skeleton for the detail view page
function ViewTenantSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48" /> {/* Title */}
        <Skeleton className="mt-1 h-4 w-64" /> {/* Description */}
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-5 w-full" /> {/* Value */}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-28" /> {/* Button */}
      </CardFooter>
    </Card>
  );
}