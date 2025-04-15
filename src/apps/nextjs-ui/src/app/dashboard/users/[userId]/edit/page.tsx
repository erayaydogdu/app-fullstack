import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { UserForm } from '@/features/user/components/user-form';
import { getUserById } from '@/features/user/actions/usersActions'; // Action to fetch user by ID
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface EditUserPageProps {
  params: {
    userId?: string;
  };
  mode?: 'create' | 'update';
}

// Helper component to fetch data and render form
async function EditUserFormLoader({ userId, mode }: { userId?: string, mode?: 'create' | 'update' }) {
  if (!userId) {
    return <UserForm initialData={null} mode="create" />;
  }

  const user = await getUserById(userId);

  if (!user) {
    notFound(); // Show 404 if user doesn't exist
  }

  const initialData = {
    id: user.id,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
    emailConfirmed: user.emailConfirmed,
    imageUrl: user.imageUrl,
    password: '',
    confirmPassword: '',
  };


  return <UserForm initialData={initialData} mode="update" />;
}

export default function EditUserPage({ params, mode }: EditUserPageProps) {
  const { userId } = params;

  return (
    <div className="p-4 md:p-8">
      <Suspense fallback={<EditUserFormSkeleton />}>
        <EditUserFormLoader userId={userId} mode={mode} />
      </Suspense>
    </div>
  );
}

// Basic skeleton for the form page while loading data
function EditUserFormSkeleton() {
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
            {[...Array(5)].map((_, i) => (
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