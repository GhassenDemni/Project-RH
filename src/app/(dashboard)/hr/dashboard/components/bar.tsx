import { Card, Title, BarChart, Subtitle } from '@tremor/react';

export default function Bar({ data, kpi, color = 'blue' }: any) {
  return (
    <Card>
      <Title>{kpi.title}</Title>
      <Subtitle>{kpi?.description}</Subtitle>
      <BarChart
        className="mt-6"
        data={data}
        index={kpi.index}
        categories={[kpi.title]}
        colors={[color]}
        yAxisWidth={48}
      />
    </Card>
  );
}
