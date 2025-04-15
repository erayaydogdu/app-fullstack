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
import { registerUserCommandSchema, userDetailSchema } from '@/features/user/schemas/usersSchemas';
import { registerUser, updateUser } from '@/features/user/actions/usersActions';

type UserFormValues = z.infer<typeof registerUserCommandSchema>;

interface UserFormProps {
  initialData?: z.infer<typeof userDetailSchema> | null;
  mode: 'create' | 'update';
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, mode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = mode === 'update' ? 'Edit user' : 'Create user';
  const description = mode === 'update' ? 'Edit an existing user.' : 'Add a new user.';
  const toastMessage = mode === 'update' ? 'User updated.' : 'User created.';
  const action = mode === 'update' ? 'Save changes' : 'Create';

  const form = useForm<UserFormValues>({
    resolver: zodResolver(registerUserCommandSchema),
    defaultValues: initialData || {
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      if (mode === 'update' && initialData) {
        await updateUser({ ...data, id: initialData.id });
        toast.success(toastMessage);
      } else {
        await registerUser(data);
        toast.success(toastMessage);
        router.push('/dashboard/users');
        router.refresh();
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
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="John" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Doe" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" disabled={loading} placeholder="john.doe@example.com" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="johndoe" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="+1234567890" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password fields only needed for creation */}
            {!initialData && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" disabled={loading} {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" disabled={loading} {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
