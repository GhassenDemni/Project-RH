'use client';

import { userSchema } from '@/lib/schema';
import { Form } from '@/components';

export default function UserForm({ fields, defaultValues }: any) {
  return (
    <div>
      <Form
        method="PATCH"
        endpoint="/user"
        redirect="/admin/dashboard/users"
        fields={fields}
        defaultValues={defaultValues}
        schema={userSchema}
        actions={[{ name: 'submit', text: 'Edit and save' }]}
      />
    </div>
  );
}
