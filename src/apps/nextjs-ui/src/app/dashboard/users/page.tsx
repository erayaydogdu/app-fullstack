import { Suspense } from 'react';
import { UserListing } from '@/features/user/components/user-listing';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

export default async function UsersPage() {
  return (
    <div className="p-4 md:p-8">
      {/* Use Suspense for better loading UX */}
      <Suspense fallback={<UserListingSkeleton />}>
        <UserListing />
      </Suspense>
    </div>
  );
}

// Basic skeleton for the listing page
function UserListingSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        {/* Skeleton for Heading */}
        <div className="space-y-2">
           <Skeleton className="h-7 w-32" />
           <Skeleton className="h-4 w-48" />
        </div>
         {/* Skeleton for Button */}
        <Skeleton className="h-10 w-28" />
      </div>
       {/* Skeleton for Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}