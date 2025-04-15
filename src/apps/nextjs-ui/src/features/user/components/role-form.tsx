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
import { createOrUpdateRoleCommandSchema } from '@/features/user/schemas/rolesSchemas'; // Using create schema
import { createOrUpdateRole } from '@/features/user/actions/rolesActions'; // Import the action

type RoleFormValues = z.infer<typeof createOrUpdateRoleCommandSchema>;

// TODO: Add props for initialData to handle editing
interface RoleFormProps {
  initialData?: RoleFormValues | null; // Make optional for creation
}

export const RoleForm: React.FC<RoleFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit role' : 'Create role';
  const description = initialData ? 'Edit an existing role.' : 'Add a new role.';
  const toastMessage = initialData ? 'Role updated.' : 'Role created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(createOrUpdateRoleCommandSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      id: null,
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // TODO: Implement update logic using createOrUpdateRole action
        // await createOrUpdateRole({ ...data, id: initialData.id }); // Assuming createOrUpdateRole exists and takes id
        toast.info('Update functionality not yet implemented.'); // Placeholder
      } else {
        await createOrUpdateRole(data);
        toast.success(toastMessage);
        router.push('/dashboard/users/role'); // Redirect after creation
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
                    <Input disabled={loading} placeholder="Role Name" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Role Description" {...field} value={field.value || ''} />
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