import { word, enumToOptions } from '@/helpers';
import Form from './form';
import prisma from '@/lib/prisma';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Gender } from '@prisma/client';

export default async function Users() {
  const departments = await prisma.department.findMany();
  const roles = await prisma.role.findMany();
  const admin_role_id = roles.find(role => role.name === 'ADMIN')?.id;

  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      placeholder: 'Amin benz',
    },
    { name: 'email', label: 'Email', placeholder: 'example@domain.com' },
    {
      name: 'phone',
      label: 'Phone number',
      placeholder: '+215 23 456 789',
    },
    {
      name: 'role_id',
      label: 'Role',
      type: 'select',
      options: roles.map(r => ({ label: word(r.name), value: r.id })),
    },
  ];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Add User"
        text="Easily add new users to your organization with this user management dashboard."
      />
      <div className="grid gap-10">
        <Form fields={fields} defaultValues={{ role_id: admin_role_id }} />
      </div>
    </DashboardShell>
  );
}
