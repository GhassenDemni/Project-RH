import { date_range } from '@/helpers';
import mongodb from '@/lib/mongodb';
import display_matrices from './display_matrices';

const date = date_range(120);

const agg = [
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
      _id: '$department.name',
      cost: {
        $sum: '$salary',
      },
    },
  },
];

const get_salary_cost_by_department = async () => {
  const client = await mongodb;
  const coll = client.db('point').collection('Employee');
  const cursor = await coll.aggregate(agg);
  const results = (await cursor.toArray()) as any;

  return results;
};

export default get_salary_cost_by_department;
