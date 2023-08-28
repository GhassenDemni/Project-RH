import prisma from '@/lib/prisma';
import { columns } from './components/table/columns';
import { DataTable } from './components/table/table';
import { User } from '@prisma/client';

async function getData(): Promise<User[]> {
  const employees = await prisma.user.findMany({
    where: {
      Role: {
        name: 'EMPLOYEE',
      },
    },
    include: {
      Employee: {
        include: {
          Department: {
            select: {
              name: true,
            },
          },
        },
      },
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
  return employees;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns as any} data={data} />
    </div>
  );
}
