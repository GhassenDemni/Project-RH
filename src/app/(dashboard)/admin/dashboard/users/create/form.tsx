'use client';

import { userSchema } from '@/lib/schema';
import { Form } from '@/components';

export default function UserForm({ fields, defaultValues }: any) {
  return (
    <div>
      <Form
        endpoint="/user"
        redirect="/admin/dashboard/users"
        fields={fields}
        split={2}
        schema={userSchema}
        defaultValues={defaultValues}
        actions={[
          {
            name: 'submit',
            text: 'create account',
          },
        ]}
      />
    </div>
  );
}
