import mongodb from '@/lib/mongodb';
import display_matrices from './display_matrices';

const get_employees_avg_salary = async () => {
  const client = await mongodb;
  const coll = client.db('point').collection('Employee');

  const agg = [
    {
      $group: {
        _id: {
          year: {
            $year: '$hire_date',
          },
          month: {
            $month: '$hire_date',
          },
        },
        avg_salary: {
          $avg: '$salary',
        },
        sum_salary: {
          $sum: '$salary',
        },
        min_salary: {
          $min: '$salary',
        },
        max_salary: {
          $max: '$salary',
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        salary: {
          sum: '$sum_salary',
          avg: '$avg_salary',
          min: '$min_salary',
          max: '$max_salary',
        },
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ];

  const cursor = await coll.aggregate(agg);
  const results = (await cursor.toArray()) as any;

  return results;
};

export default get_employees_avg_salary;
