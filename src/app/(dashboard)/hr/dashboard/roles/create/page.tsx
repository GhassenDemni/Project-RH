'use client';
import React, { ComponentElement, useEffect, useRef, useState } from 'react';
import { roleSchema } from '@/lib/schema';
import { Form } from '@/components';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import Link from 'next/link';
import { Button } from '@/components';

const fields = [
  {
    name: 'name',
    label: 'Role name ',
    placeholder: '(ADMIN)',
  },
  {
    name: 'description',
    label: 'Role description',
    placeholder: 'Describe role',
    type: 'textarea',
  },
];

export default function RoleCreatePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Role create" text="Here, you can etc.">
        <Link href={`/admin/dashboard/roles`}>
          <Button variant="outline">View roles table</Button>
        </Link>{' '}
      </DashboardHeader>
      <div className="grid gap-10">
        <Form
          as="modal"
          endpoint="/role"
          redirect="/admin/dashboard/roles"
          fields={fields}
          schema={roleSchema}
          actions={[{ name: 'submit', text: 'Create role' }]}
        />
      </div>
    </DashboardShell>
  );
}
