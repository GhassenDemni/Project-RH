'use client';
import { Card, Title, BarChart, Text } from '@tremor/react';

export default function StackedBar({ data }: any) {
  return (
    <Card>
      <Title>
        Gender distribution by department (D-{data.length} & E-
        {data.reduce((acc: any, item: any) => (acc += item.total), 0)})
      </Title>
      <Text>Gender distribution within different departments</Text>
      <BarChart
        className="mt-4 h-80"
        data={data}
        index="department"
        categories={['female', 'male']}
        colors={['fuchsia', 'sky']}
        stack={true}
        relative={false} // Set to false if you want actual counts, not percentages
      />
    </Card>
  );
}
