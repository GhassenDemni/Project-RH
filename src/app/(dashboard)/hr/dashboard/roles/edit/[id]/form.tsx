'use client';

import { roleSchema } from '@/lib/schema';
import { Form } from '@/components';

const fields = [
  {
    name: 'name',
    label: 'Role name ',
    placeholder: '(ADMIN)',
    required: true,
    type: 'text',
  },
  {
    name: 'description',
    label: 'Role description',
    placeholder: 'Describe role',
    type: 'textarea',
  },
];

export default function UserForm({ defaultValues }) {
  return (
    <div>
      <Form
        as="modal"
        endpoint="/role"
        method="PATCH"
        redirect="/admin/dashboard/roles"
        fields={fields}
        defaultValues={defaultValues}
        schema={roleSchema}
        actions={[{ name: 'submit', text: 'Edit and save' }]}
      />
    </div>
  );
}
