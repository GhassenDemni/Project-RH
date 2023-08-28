import mongodb from '@/lib/mongodb';
import display_matrices from './display_matrices';

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
  // {
  //   $match: {
  //     'user.created_at': { $gte: date.from },
  //   },
  // },
  {
    $group: {
      _id: {
        year: {
          $year: '$user.created_at',
        },
        month: {
          $month: '$user.created_at',
        },
      },
      total: {
        $sum: 1,
      },
    },
  },
  {
    $addFields: {
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

const getEmployees = async () => {
  const client = await mongodb;
  const coll = client.db('point').collection('Employee');
  const cursor = await coll.aggregate(agg);
  const results = (await cursor.toArray()) as any;

  const data = display_matrices(results, 'Employees');

  return data;
};

export default getEmployees;
