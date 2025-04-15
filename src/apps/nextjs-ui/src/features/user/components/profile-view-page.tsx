'use client';

import { getUser } from '@/features/user/actions/usersActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileViewPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <ProfileViewSkeleton />;
  }

  if (!user) {
    return <div>No user data found.</div>;
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
    </Card>
  );
}

function ProfileViewSkeleton() {
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
    </Card>
  );
}
