'use client';
import { Card, Metric, Text, AreaChart, BadgeDelta, Flex, DeltaType, Grid } from '@tremor/react';

export default function KPICards({ data, kpi, style }: any) {
  return (
    <Card>
      <Flex alignItems="start">
        <Text>{kpi.title}</Text>
        <BadgeDelta deltaType={kpi.delta.type}>{kpi.delta.value}</BadgeDelta>
      </Flex>
      <Flex className="space-x-3 truncate" justifyContent="start" alignItems="baseline">
        <Metric>{kpi.metric}</Metric>
        <Text>
          from <strong>{kpi.metric_prev}</strong> to previous month
        </Text>
      </Flex>
      <AreaChart
        className="mt-6 h-28"
        data={data.reverse()}
        index="month"
        valueFormatter={(number: number) => `${Intl.NumberFormat(undefined, style).format(number)}`}
        categories={[kpi.title]}
        colors={['blue', 'green']}
        showXAxis={true}
        showGridLines={false}
        startEndOnly={true}
        showYAxis={false}
        showLegend={false}
      />
    </Card>
  );
}
