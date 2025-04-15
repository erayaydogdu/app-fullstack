'use server';

import Link from 'next/link';
import { getTenants } from '@/features/user/actions/tenantsActions'; // Using getTenants
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { tenantDetailSchema } from '@/features/user/schemas/tenantsSchemas';

type Tenant = z.infer<typeof tenantDetailSchema>;

export async function TenantListing() {
  // TODO: Implement proper error handling and loading states
  const tenants = await getTenants(); // Fetch tenants using the server action

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <Heading title={`Tenants (${tenants?.length || 0})`} description="Manage tenants for your account" />
        <Button asChild>
          <Link href="/dashboard/users/tenant/new">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>

      {tenants && tenants.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant: Tenant) => (
            <Card key={tenant.id}>
              <CardHeader>
                <CardTitle>{tenant.name || 'Unnamed Tenant'}</CardTitle>
                <CardDescription>{tenant.connectionString || '-'}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Display other relevant tenant info here if needed */}
                <p className="text-sm text-muted-foreground">ID: {tenant.id}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                   {/* TODO: Link to tenant details page */}
                  <Link href={`/dashboard/users/tenant/${tenant.id}`}>View</Link>
                </Button>
                <Button size="sm" asChild>
                   {/* TODO: Link to tenant edit page */}
                  <Link href={`/dashboard/users/tenant/${tenant.id}/edit`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No tenants found.</p>
      )}
    </div>
  );
}