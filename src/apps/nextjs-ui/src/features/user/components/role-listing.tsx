'use server';

import Link from 'next/link';
import { getRoles } from '@/features/user/actions/rolesActions'; // Using getRoles
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { roleDtoSchema } from '@/features/user/schemas/rolesSchemas';

type Role = z.infer<typeof roleDtoSchema>;

export async function RoleListing() {
  // TODO: Implement proper error handling and loading states
  const roles = await getRoles(); // Fetch roles using the server action

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <Heading title={`Roles (${roles?.length || 0})`} description="Manage roles for your account" />
        <Button asChild>
          <Link href="/dashboard/users/role/new">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>

      {roles && roles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role: Role) => (
            <Card key={role.id}>
              <CardHeader>
                <CardTitle>{role.name || 'Unnamed Role'}</CardTitle>
                <CardDescription>{role.description || '-'}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Display other relevant role info here if needed */}
                <p className="text-sm text-muted-foreground">ID: {role.id}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                   {/* TODO: Link to role details page */}
                  <Link href={`/dashboard/users/role/${role.id}`}>View</Link>
                </Button>
                <Button size="sm" asChild>
                   {/* TODO: Link to role edit page */}
                  <Link href={`/dashboard/users/role/${role.id}/edit`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No roles found.</p>
      )}
    </div>
  );
}