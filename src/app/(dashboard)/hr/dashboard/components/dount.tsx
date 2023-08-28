'use client';
import { Card, Title, DonutChart } from '@tremor/react';

const valueFormatter = (number: number) => `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export default function Donut({
  title,
  data,
  variant,
  colors,
  key = '_id',
  category = 'total',
}: any) {
  return (
    <Card className="max-w-lg">
      <Title>{title}</Title>
      <DonutChart
        className="mt-6"
        data={data}
        category={category}
        variant={variant}
        index={key}
        valueFormatter={valueFormatter}
        colors={colors || ['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
      />
    </Card>
  );
}

// 'use client';
// import { Card, Title, DonutChart } from '@tremor/react';

// const valueFormatter = (number: number) => `$ ${Intl.NumberFormat('us').format(number).toString()}`;

// export default function Donut({
//   kpi: { title, key, category },
//   data,
//   variant,
//   colors = ['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber'],
// }: //   currency = false,
// any) {
//   return (
//     <Card className="max-w-lg">
//       <Title>{title}</Title>
//       <DonutChart
//         className="mt-6"
//         data={data}
//         category={category}
//         variant={variant}
//         index={key}
//         // valueFormatter={currency && valueFormatter}
//         colors={colors}
//       />
//     </Card>
//   );
// }
