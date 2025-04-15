import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RoleForm } from '@/features/user/components/role-form';
import { getRoleById } from '@/features/user/actions/rolesActions'; // Action to fetch role by ID
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface EditRolePageProps {
  params: {
    roleId: string;
  };
}

// Helper component to fetch data and render form
async function EditRoleFormLoader({ roleId }: { roleId: string }) {
  const role = await getRoleById(roleId);

  if (!role) {
    notFound(); // Show 404 if role doesn't exist
  }

  const initialData = {
    name: role.name,
    description: role.description,
    id: role.id,
  };

  return <RoleForm initialData={initialData} />;
}

export default function EditRolePage({ params }: EditRolePageProps) {
  const { roleId } = params;

  return (
    <div className="p-4 md:p-8">
      <Suspense fallback={<EditRoleFormSkeleton />}>
        <EditRoleFormLoader roleId={roleId} />
      </Suspense>
    </div>
  );
}

// Basic skeleton for the form page while loading data
function EditRoleFormSkeleton() {
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
            {[...Array(2)].map((_, i) => (
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