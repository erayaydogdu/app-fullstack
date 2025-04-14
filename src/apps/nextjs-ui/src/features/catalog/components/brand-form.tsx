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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createProductCommandSchema,updateProductCommandSchema } from '../schemas/productSchemas';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export default function BrandForm({
  initialData,
  pageTitle,
  mode = 'create'
}: {
  initialData: Product | null;
  pageTitle: string;
  mode?: 'create' | 'update';
}) {
  
  const defaultValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    imageUrl: initialData?.imageUrl || '',
    brand: initialData?.brand ? {
      id: initialData.brand.id,
      name: initialData.brand.name,
      description: initialData.brand.description
    } : undefined
  };

  const schema = mode === 'create' ? createProductCommandSchema : updateProductCommandSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues
  });

  function onSubmit(values: z.infer<typeof schema>) {
    if (mode === 'create') {
      // Handle create logic
      console.log('Creating product:', values);
    } else {
      // Handle update logic
      console.log('Updating product:', values);
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

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product name' {...field} />
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
                      placeholder='Enter product description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>
              {mode === 'create' ? 'Create Brand' : 'Update Brand'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
