'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brand } from '@/types/brand';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createBrandCommandSchema, updateBrandCommandSchema } from '../schemas/brandsSchemas';
import { useRouter } from 'next/navigation';
import { createBrand, updateBrand } from '../actions/brandsActions';
import { useState } from 'react';

export default function BrandForm({
  initialData,
  pageTitle,
  mode = 'create'
}: {
  initialData: Brand | null;
  pageTitle: string;
  mode?: 'create' | 'update';
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const defaultValues = {
    id: initialData?.id || '',
    name: initialData?.name || '',
    description: initialData?.description || ''
  };

  const schema = mode === 'create' ? createBrandCommandSchema : updateBrandCommandSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    if (isSubmitting) return; 
    
    try {
      setIsSubmitting(true);
      setError(null);

      if (mode === 'create') {
        await createBrand(values);
      } 
      else
      {
        if (!initialData?.id) {
          throw new Error('Brand ID is missing');
        }
        console.log('Updating brand:', { id: initialData.id, values });
        await updateBrand(initialData.id, {
          name: values.name,
          description: values.description,
          id: initialData.id
        });
      }
      
      
      router.refresh();
      router.push('/dashboard/catalog/brands');
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save brand');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {error && (
              <div className="text-sm text-red-500 dark:text-red-400">
                {error}
              </div>
            )}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter brand name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter brand description'
                      className='resize-none'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Brand' : 'Update Brand'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
