import { Form } from '@/components';
import prisma from '@/lib/prisma';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';

export default async function Users() {
  const fields = [
    {
      name: 'name',
      label: 'Department name',
      placeholder: 'IT',
    },
    {
      name: 'description',
      label: 'Description',
      placeholder: 'Describe department',
    },
  ];

  return (
    <DashboardShell>
      <DashboardHeader heading="Add Department" text="" />
      <div className="grid gap-10">
        <Form
          as="form"
          endpoint="/department"
          redirect="/admin/dashboard/users"
          fields={fields}
          // schema={createUserSchema}
          // defaultValues={defaultValues}
          // onAction={onAction}
          actions={[
            {
              name: 'submit',
              text: 'create department',
            },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
