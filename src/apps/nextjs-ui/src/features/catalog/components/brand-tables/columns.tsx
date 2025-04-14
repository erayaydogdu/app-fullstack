'use client';

import { Brand } from '@/types/brand';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Brand>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Brand['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search brands...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Brand['description']>()}</div>,
    meta: {
      label: 'Description',
      placeholder: 'Search descriptions...',
      variant: 'text',
      icon: Text
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
