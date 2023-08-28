'use client';
import { Card, Title, BarChart, Subtitle } from '@tremor/react';

const dataFormatter = (number: number) => {
  return Intl.NumberFormat(undefined).format(number);
};

export default function BarChartComponent({ data }: any) {
  const cat = data
    .flatMap((item: any) => Object.keys(item))
    .filter((key: string) => key !== 'type');

  return (
    <Card>
      <Title>
        IT Equipment Inventory in{' '}
        {new Intl.DateTimeFormat(undefined, {
          month: 'long',
          year: 'numeric',
        }).format(new Date())}
      </Title>

      <Subtitle>
        This bar chart displays the distribution of IT equipment items among different categories.
      </Subtitle>
      <BarChart
        className="mt-6"
        data={data}
        index="type"
        allowDecimals={false}
        categories={cat}
        colors={['blue', 'teal', 'amber', 'rose', 'indigo', 'emerald']}
        valueFormatter={dataFormatter}
        yAxisWidth={48}
      />
    </Card>
  );
}
