import { DashboardShell } from '@/components/shell';
import Cards from './components/cards';
import StackedBar from './components/stacked-bar';
import { DashboardHeader } from '@/components/header';
import { MongoClient } from 'mongodb';
import { date_range, word } from '@/helpers';
import { env } from '@/env.mjs';
import prisma from '@/lib/prisma';
import mongodb from '@/lib/mongodb';
import { Grid } from '@tremor/react';

const display_matrices = (
  results: {
    total: number;
    date: {
      year: number;
      month: number;
    };
  }[],
  key: string,
  style = undefined
) => {
  if (results.length < 2) {
    return {
      data: [],
      categories: [],
    };
  }

  const nFormatter = (number: number, style: any) =>
    Intl.NumberFormat(undefined, style).format(number);

  const dFormatter = (year: number, month: number) =>
    new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    }).format(new Date(year, month, new Date().getDate()));

  const data = results.map(({ date: { year, month }, total }) => {
    return {
      month: dFormatter(year, month),
      [key]: total,
    };
  });

  const delta = (results[0].total - results[1].total) / results[1].total;

  const categories = [
    {
      title: key,
      metric: nFormatter(results[0].total, style),
      metric_prev: nFormatter(results[1].total, style),
      delta: nFormatter(delta, {
        style: 'percent',
      }),
      deltaType: delta > 0 ? 'moderateIncrease' : 'moderateDecrease',
    },
  ];

  return { data, categories, style };
};

// const aggregate = (date_range , ) => {
//   const agg = [
//     {
//       $match: {
//         created_at: { $gte: date_range.from ,  },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           year: {
//             $year: '$created_at',
//           },
//           month: {
//             $month: '$created_at',
//           },
//         },
//         total: {
//           $sum: 1,
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         date: '$_id',
//         total: 1,
//       },
//     },
//     {
//       $sort: {
//         date: -1,
//       },
//     },
//   ];
// }

const date = date_range(120);

const agg = [
  {
    $match: {
      created_at: { $gte: date.from },
    },
  },
  {
    $group: {
      _id: {
        year: {
          $year: '$created_at',
        },
        month: {
          $month: '$created_at',
        },
      },
      total: {
        $sum: 1,
      },
    },
  },
  {
    $project: {
      _id: 0,
      date: '$_id',
      total: 1,
    },
  },
  {
    $sort: {
      date: -1,
    },
  },
];

const getUsers = async () => {
  const client = await mongodb;
  const coll = client.db('point').collection('users');
  const cursor = await coll.aggregate(agg);
  const results = (await cursor.toArray()) as any;

  const data = display_matrices(results, 'Users');

  return data;
};

const employeeCountsByDepartmentAndGender = async () => {
  const agg = [
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
      },
    },
    {
      $lookup: {
        from: 'Department',
        localField: 'department_id',
        foreignField: '_id',
        as: 'department',
      },
    },
    {
      $unwind: {
        path: '$department',
      },
    },
    {
      $group: {
        _id: {
          department: '$department.name',
          gender: '$user.gender',
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $group: {
        _id: '$_id.department',
        genders: {
          $push: {
            gender: '$_id.gender',
            count: '$count',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        department: '$_id',
        female: {
          $arrayElemAt: ['$genders.count', 0],
        },
        male: {
          $arrayElemAt: ['$genders.count', 1],
        },
        total: {
          $sum: '$genders.count',
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
  ];
  const client: any = (await mongodb) as any;
  const coll = client.db('point').collection('Employee');
  const cursor = await coll.aggregate(agg);
  const results = (await cursor.toArray()) as any;
  return results.map((item: any) => ({ ...item, department: word(item.department) }));
};

export default async function AdminDashboard() {
  const matrices = await getUsers();
  const data = await employeeCountsByDepartmentAndGender();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Admin Dashboard"
        text="Welcome to the Admin Dashboard ."
      ></DashboardHeader>
      <section className="grid gap-4">
        <Cards {...matrices} />
        <StackedBar data={data} />
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data && <Pie data={data} />}
          {inventoryStats && <EnvBarChart data={inventoryStats} />}
          <ScanScarlet />
        </div> */}
      </section>
    </DashboardShell>
  );
}
