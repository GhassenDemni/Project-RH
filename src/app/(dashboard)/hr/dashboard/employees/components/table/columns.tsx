'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { roles, statuses } from './data';
import { DataTableColumnHeader } from './column-header';
import { DataTableRowActions } from './row-actions';
import { Role, User, Department } from '@prisma/client';

export const columns: ColumnDef<User & { Role: Role; Department: Department }>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="User ID" />,
    cell: ({ row }) => <div className="w-[80px]">{row.original.id.substring(0, 10)}...</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'Employee.Department.name',
    header: 'Department',
  },
  {
    accessorKey: 'Employee.position',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
  },
  {
    accessorKey: 'Employee.salary',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Salary" />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find(status => status.value === row.getValue('status'));

      if (!status) {
        return null;
      }

      return (
        <Badge variant={`${status.value === 'ACTIVE' ? 'success' : 'destructive'}`}>
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
