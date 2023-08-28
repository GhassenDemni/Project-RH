'use client';

import { ColumnDef } from '@tanstack/react-table';
import { toast } from '@/hooks/use-toast';
import { DataTableColumnHeader } from './data-table-column-header';
// import RoleBadge from "../../../components/buttons/role-badge"

export type Role = {
  id: number; // Unique identifier for each role
  name: string; // Descriptive name for the role, like "Admin," "Moderator," "User," etc.
  description: string; // Brief description or explanation of the role's purpose and permissions
  permissions: string; // Comma-separated list of permissions associated with the role
  created_at: string; // Timestamp when the role was created in the system
  updated_at: string; // Timestamp of the last update made to the role's information
  created_by: string; // User or administrator who created the role
};

import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'id',
    header: 'Role ID',
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Role ID" />
    // ),
  },
  {
    accessorKey: 'name',
    header: 'Role Name',
    // cell: ({ row }) => <RoleBadge role={row.original.name} />,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <span className="max-w-[100px] truncate font-medium">{row.getValue('description')}</span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  // {
  //   accessorKey: "updated_at",
  //   header: "Last Updated",
  //   cell: ({ row }) => new Date(row.original.updated_at).toLocaleDateString(),
  // },
  {
    accessorKey: 'created_by_id',
    header: 'Created By ID',
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
