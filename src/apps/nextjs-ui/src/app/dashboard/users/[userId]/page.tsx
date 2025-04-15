import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUserById } from '@/features/user/actions/usersActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { ArrowLeft } from 'lucide-react';

interface ViewUserPageProps {
  params: {
    userId: string;
  };
}

// Helper component to fetch data and render user details
async function ViewUserLoader({ userId }: { userId: string }) {
  const user = await getUserById(userId);

  if (!user) {
    notFound(); // Show 404 if user doesn't exist
  }

  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userName}</CardTitle>
        <CardDescription>User ID: {user.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p>{user.email || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Username</p>
          <p>{user.userName || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
          <p>{user.phoneNumber || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <p>{user.isActive ? 'Active' : 'Inactive'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email Confirmed</p>
          <p>{user.emailConfirmed ? 'Yes' : 'No'}</p>
        </div>
        {/* Add other relevant fields here */}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild>
          <Link href={`/dashboard/users/${user.id}/edit`}>Edit User</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ViewUserPage({ params }: ViewUserPageProps) {
  const { userId } = params;

  return (
    <div className="p-4 md:p-8 space-y-4">
       <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/users">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Users</span>
            </Link>
          </Button>
         <Heading title="User Details" description="View information about a specific user." />
       </div>
       <Separator />
      <Suspense fallback={<ViewUserSkeleton />}>
        <ViewUserLoader userId={userId} />
      </Suspense>
    </div>
  );
}

// Basic skeleton for the detail view page
function ViewUserSkeleton() {
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