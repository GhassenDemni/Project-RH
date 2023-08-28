import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import db from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components';
import Form from './form';
import { word } from '@/helpers';

export const metadata = {
  title: 'Edit user',
  description: 'Edit user desc...',
};

type Props = {
  params: {
    id: string;
  };
};

const select = (arr: string[]) =>
  arr.reduce((acc: any, item: any) => ({ ...acc, [item]: true }), {});

export default async function User({ params }: Props) {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
    select: select(['id', 'name', 'email']),
  });

  if (!user) {
    return notFound();
  }

  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      type: 'text',
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Email',
      required: true,
    },
  ];

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit user" text="Edit users desc">
        <Link href={`/admin/dashboard/users`}>
          <Button variant="outline">View users table</Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-10">
        <Form fields={fields} defaultValues={user} />
      </div>
    </DashboardShell>
  );
}
