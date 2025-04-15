'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { createTenantCommandSchema } from '@/features/user/schemas/tenantsSchemas'; // Using create schema
import { createOrUpdateTenant } from '@/features/user/actions/tenantsActions'; // Import the action

type TenantFormValues = z.infer<typeof createTenantCommandSchema>;

// TODO: Add props for initialData to handle editing
interface TenantFormProps {
  initialData?: TenantFormValues | null; // Make optional for creation
}

export const TenantForm: React.FC<TenantFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit tenant' : 'Create tenant';
  const description = initialData ? 'Edit an existing tenant.' : 'Add a new tenant.';
  const toastMessage = initialData ? 'Tenant updated.' : 'Tenant created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(createTenantCommandSchema),
    defaultValues: initialData || {
      name: '',
      connectionString: '',
      adminEmail: '',
      issuer: '',
      id: null,
    },
  });

  const onSubmit = async (data: TenantFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // TODO: Implement update logic using createOrUpdateTenant action
        // await createOrUpdateTenant({ ...data, id: initialData.id }); // Assuming createOrUpdateTenant exists and takes id
        toast.info('Update functionality not yet implemented.'); // Placeholder
      } else {
        await createOrUpdateTenant(data);
        toast.success(toastMessage);
        router.push('/dashboard/users/tenant'); // Redirect after creation
        router.refresh(); // Refresh server components
      }
    } catch (error: any) {
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {/* TODO: Add delete button for edit mode */}
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Fields - Add more as needed based on schema */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Tenant Name" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="connectionString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection String</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="mongodb://..." {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input type="email" disabled={loading} placeholder="admin@example.com" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="https://example.com" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
           <Button disabled={loading} variant="outline" onClick={() => router.back()} type="button" className="ml-2">
            Cancel
          </Button>
        </form>
      </Form>
    </>
  );
};