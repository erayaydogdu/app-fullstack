import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRoleById } from '@/features/user/actions/rolesActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { ArrowLeft } from 'lucide-react';

interface ViewRolePageProps {
  params: {
    roleId: string;
  };
}

// Helper component to fetch data and render role details
async function ViewRoleLoader({ roleId }: { roleId: string }) {
  const role = await getRoleById(roleId);

  if (!role) {
    notFound(); // Show 404 if role doesn't exist
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{role.name || 'Unnamed Role'}</CardTitle>
        <CardDescription>Role ID: {role.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p>{role.description || '-'}</p>
        </div>
        {/* Add other relevant fields here */}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild>
          <Link href={`/dashboard/users/role/${role.id}/edit`}>Edit Role</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ViewRolePage({ params }: ViewRolePageProps) {
  const { roleId } = params;

  return (
    <div className="p-4 md:p-8 space-y-4">
       <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/users/role">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Roles</span>
            </Link>
          </Button>
         <Heading title="Role Details" description="View information about a specific role." />
       </div>
       <Separator />
      <Suspense fallback={<ViewRoleSkeleton />}>
        <ViewRoleLoader roleId={roleId} />
      </Suspense>
    </div>
  );
}

// Basic skeleton for the detail view page
function ViewRoleSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48" /> {/* Title */}
        <Skeleton className="mt-1 h-4 w-64" /> {/* Description */}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-5 w-full" /> {/* Value */}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-28" /> {/* Button */}
      </CardFooter>
    </Card>
  );
}