import { DashboardShell } from '@/components/shell';
import Cards from './components/cards';
import Card from './components/card';
import StackedBar from './components/stacked-bar';
import BarChart from './components/bar';
import { DashboardHeader } from '@/components/header';
import { word } from '@/helpers';
import mongodb from '@/lib/mongodb';
import { Grid } from '@tremor/react';
import get_new_hires from './queries/get_new_hires';
import get_employees_salary from './queries/get_employees_salary';
import get_new_employees from './queries/get_new_employees';
import get_emp_type from './queries/get_emp_type';
import Line from './components/line';
import display_matrices from './queries/display_matrices';
import metrics from './queries/metrics';
import get_salary_cost_by_department from './queries/get_salary_cost_by_department';
import Donut from './components/dount';
import Kpis from './components/kpis';

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

const genderRatio = async () => {
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
      $group: {
        _id: '$user.gender',
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        metrics: {
          count: '$count',
        },
      },
    },
  ];

  const client: any = (await mongodb) as any;
  const coll = client.db('point').collection('Employee');
  const cursor = await coll.aggregate(agg);
  const results = (await cursor.toArray()) as any;
  return results;
  // return metrics(results, { title: 'Hey', aggregate: 'count' });
};

export default async function AdminDashboard() {
  const new_employees = await get_new_employees();
  const new_hires = await get_new_hires();
  const data = await employeeCountsByDepartmentAndGender();
  const employees_salary = await get_employees_salary();
  const emp_type = await get_emp_type();
  const salary_cost = await get_salary_cost_by_department();
  const gender_ratio = await genderRatio();
  console.log('🚀 ~ file: page.tsx:145 ~ AdminDashboard ~ gender_ratio:', gender_ratio);

  const employeesTotalSalary = display_matrices(
    employees_salary.map((item: any) => ({ ...item, total: item.salary.sum })),
    'Salary Cost',
    {
      style: 'currency',
      currency: 'USD',
    }
  );

  const employeesAvgSalary = display_matrices(
    employees_salary.map((item: any) => ({ ...item, total: item.salary.avg })),
    'Avg Employees Salary'
  );
  const employeesSumSalary = display_matrices(
    employees_salary.map((item: any) => ({ ...item, total: item.salary.sum })),
    'Sum Employees Salary'
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="HR Dashboard"
        text="View core metrics on the state of your company."
      ></DashboardHeader>
      <section className="grid gap-4">
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
          <Card {...new_employees} />
          <Card {...new_hires} />
          <Card {...employeesTotalSalary} />
        </Grid>
        <Grid numItems={2} className="gap-6">
          <BarChart {...employeesSumSalary} />
          <BarChart {...employeesAvgSalary} color="amber" />
        </Grid>
        <Grid numItems={3} className="gap-6">
          <Donut title="Salary Cost By Department" data={salary_cost} category="cost" currency />
          <Donut title="Gender ratio" data={gender_ratio} category="metrics.count" />
          {/* <Donut {...gender_ratio} /> */}
        </Grid>
        <Kpis />
        <Grid numItems={2} className="gap-2">
          <StackedBar data={data} />
          <Line {...emp_type} />
        </Grid>

        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data && <Pie data={data} />}
          {inventoryStats && <EnvBarChart data={inventoryStats} />}
          <ScanScarlet />
        </div> */}
      </section>
    </DashboardShell>
  );
}
