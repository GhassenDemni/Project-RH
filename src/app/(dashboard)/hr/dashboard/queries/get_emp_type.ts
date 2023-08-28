import { date_range, word } from '@/helpers';
import mongodb from '@/lib/mongodb';
import display_matrices from './display_matrices';
import 'core-js/actual/array/group';
import display_matrices2 from './display_matrices2';

const agg = [
  {
    $group: {
      _id: {
        year: {
          $year: '$hire_date',
        },
        employment_type: '$employment_type',
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
      },
      employment_type: '$_id.employment_type',
      total: 1,
    },
  },
  {
    $sort: {
      date: -1,
    },
  },
];

// Define the function with async/await
const get_emp_type_in_year = async (): Promise<{ data: any[]; categories: string[] }> => {
  const client = await mongodb; // Modify the connection string as needed
  const coll = client?.db('point').collection('Employee');
  const cursor = await coll.aggregate(agg);
  const results = (await cursor.toArray()) as any[];

  // Get unique categories
  const categories = [...new Set(results.map(item => word(item.employment_type)))];

  // Group the data by year and initialize all category counts to zero
  const byYear = results.reduce((acc, entry) => {
    const year = entry.date.year;

    if (!acc[year]) {
      acc[year] = { year };
    }

    // Initialize all categories to zero
    categories.forEach(category => {
      acc[year][category] = 0;
    });

    // Set the actual total for the category
    acc[year][word(entry.employment_type)] = entry.total;

    return acc;
  }, {});

  // Convert the grouped data object to an array of values
  const output = Object.values(byYear);

  const kpi = {
    title: `Export/Import Growth Rate (${output.at(0).year} to ${output.at(-1).year})`,
  };

  return { data: output, categories, kpi };
};

export default get_emp_type_in_year;
