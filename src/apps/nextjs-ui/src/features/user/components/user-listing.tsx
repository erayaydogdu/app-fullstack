'use server';

import Link from 'next/link';
import { z } from 'zod';
import { getUsersList } from '@/features/user/actions/usersActions';
import { userDetailSchema } from '@/features/user/schemas/usersSchemas'; // Import the schema
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';

// Infer the User type from the Zod schema
type User = z.infer<typeof userDetailSchema>;

export async function UserListing() {
  // TODO: Implement proper error handling and loading states
  const users = await getUsersList(); // Use getUsersList

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <Heading title={`Users (${users?.length || 0})`} description="Manage users for your account" />
        <Button asChild>
          <Link href="/dashboard/users/new">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>

      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user: User) => ( // Add User type annotation
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Display other relevant user info here if needed */}
                <p className="text-sm text-muted-foreground">ID: {user.id}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                   {/* TODO: Link to user details page */}
                  <Link href={`/dashboard/users/${user.id}`}>View</Link>
                </Button>
                <Button size="sm" asChild>
                   {/* TODO: Link to user edit page */}
                  <Link href={`/dashboard/users/${user.id}/edit`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}