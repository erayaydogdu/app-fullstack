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
                      <Input placeholder='Enter product image url' {...field} />
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
                      <Input placeholder='Enter product name' {...field} />
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
                      value={field.value?.id}
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
                        type='money'
                        placeholder='Enter price'
                        {...field}
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>
              {mode === 'create' ? 'Create Product' : 'Update Product'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
