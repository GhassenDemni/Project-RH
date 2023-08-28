'use client';
import { Card, Title, LineChart } from '@tremor/react';

const chartdata = [
  {
    year: 1970,
    'Export Growth Rate': 2.04,
    'Import Growth Rate': 1.53,
  },
  {
    year: 1971,
    'Export Growth Rate': 1.96,
    'Import Growth Rate': 1.58,
  },
  {
    year: 1972,
    'Export Growth Rate': 1.96,
    'Import Growth Rate': 1.61,
  },
  {
    year: 1973,
    'Export Growth Rate': 1.93,
    'Import Growth Rate': 1.61,
  },
  {
    year: 1974,
    'Export Growth Rate': 1.88,
    'Import Growth Rate': 1.67,
  },
  //...
];

const dataFormatter = (number: number) => `${Intl.NumberFormat('us').format(number).toString()}%`;

export default function Line({ data, categories, kpi }: any) {
  return (
    <Card>
      <Title>{kpi.title}</Title>
      <LineChart
        className="mt-6"
        data={data}
        index="year"
        categories={categories}
        colors={['blue', 'amber', 'fuchsia', 'green']}
        yAxisWidth={40}
      />
    </Card>
  );
}
