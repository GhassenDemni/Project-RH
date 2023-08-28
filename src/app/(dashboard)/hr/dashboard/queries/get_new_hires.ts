import { date_range } from '@/helpers';
import mongodb from '@/lib/mongodb';
import display_matrices from './display_matrices';

const date = date_range(120);

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
      total: {
        $sum: 1,
      },
    },
  },
  {
    $project: {
      _id: 0,
      date: {
        year: '$_id.year',
        month: '$_id.month',
      },
      total: 1,
    },
  },
  {
    $sort: {
      date: -1,
    },
  },
];

const gen_new_hires = async () => {
  const client = await mongodb;
  const coll = client.db('point').collection('Employee');
  const cursor = await coll.aggregate(agg);
  const results = (await cursor.toArray()) as any;
  const matrices = display_matrices(results, 'Hires');

  return matrices;
};

export default gen_new_hires;
