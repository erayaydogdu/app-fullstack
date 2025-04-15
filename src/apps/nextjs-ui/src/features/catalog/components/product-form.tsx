'use client';

import { FileUploader } from '@/components/file-uploader';
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
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '../actions/productActions';
import { useState } from 'react';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export default function ProductForm({
  initialData,
  pageTitle,
  mode = 'create'
}: {
  initialData: Product | null;
  pageTitle: string;
  mode?: 'create' | 'update';
}) {
  console.log('initialData:', initialData);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const defaultValues = {
    id: initialData?.id || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    imageUrl: initialData?.imageUrl || '',
    brand: initialData?.brand ? {
      id: initialData.brand?.id || '',
      name: initialData.brand?.name || '',
      description: initialData.brand?.description || ''
    } : undefined
  };

  const schema = mode === 'create' ? createProductCommandSchema : updateProductCommandSchema;
  
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
            await createProduct(values);
          } 
          else
          {
            if (!initialData?.id) {
              throw new Error('Product ID is missing');
            }
            console.log('Updating product:', { id: initialData.id, values });
            await updateProduct(initialData.id, {
              name: values.name,
              description: values.description,
              price: values.price,
              imageUrl: values.imageUrl,
              brand: values.brand ? {
                id: values.brand.id,
                name: values.brand.name,
                description: values.brand.description
              } : null
            });
          }
          
          router.refresh();
          router.push('/dashboard/catalog/products');
        } catch (error) {
          console.error('Form submission error:', error);
          setError(error instanceof Error ? error.message : 'Failed to save product');
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
            {/* <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                // <div className='space-y-6'>
                //   <FormItem className='w-full'>
                //     <FormLabel>Images</FormLabel>
                //     <FormControl>
                //       <FileUploader
                //         value={field.value}
                //         onValueChange={field.onChange}
                //         maxFiles={4}
                //         maxSize={4 * 1024 * 1024}
                //         // disabled={loading}
                //         // progresses={progresses}
                //         // pass the onUpload function here for direct upload
                //         // onUpload={uploadFiles}
                //         // disabled={isUploading}
                //       />
                //     </FormControl>
                //     <FormMessage />
                //   </FormItem>
                // </div>
                <FormItem>
                    <FormLabel>Product Image Url</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product image url' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
            /> */}

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='imageUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product image url' value={field.value || ''} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product name' value={field.value || ''} onChange={field.onChange}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='brand'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value?.id || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select brands' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>Beauty Products</SelectItem>
                        <SelectItem value='2'>Electronics</SelectItem>
                        <SelectItem value='3'>Clothing</SelectItem>
                        <SelectItem value='4'>Home & Garden</SelectItem>
                        <SelectItem value='5'>
                          Sports & Outdoors
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter price'
                        value={field.value === 0 ? '' : field.value || ''}
                        onChange={field.onChange}
                      />
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
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
