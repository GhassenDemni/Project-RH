import prisma from '@/lib/prisma';
import { columns } from './components/table/columns';
import { DataTable } from './components/table/table';
import { User } from '@prisma/client';

async function getData(): Promise<User[]> {
  const users = await prisma.user.findMany({
    include: {
      Role: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
  });
  return users;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns as any} data={data} />
    </div>
  );
}
