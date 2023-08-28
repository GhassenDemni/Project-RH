"use client"
import {
  Card,
  DeltaType,
  DonutChart,
  Flex,
  Legend,
  List,
  ListItem,
  Title,
  Badge,
} from "@tremor/react"

type Result = {
  label: string
  color: string
  value: number
  delta: number
  deltaType?: DeltaType
}

interface Data {
  data: {
    total: number
    result: Result[]
  }
}

export default function Pie({ data }: Data) {
  return (
    <Card>
      <Flex className="space-x-8" justifyContent="start" alignItems="center">
        <Title>
          Monthly CVSS Insights -
          {new Intl.DateTimeFormat(undefined, {
            month: "long",
            year: "numeric",
          }).format(new Date())}{" "}
          ({data.total})
        </Title>
      </Flex>
      <Legend
        colors={["green", "amber", "red", "gray"]}
        categories={["Low", "Medium", "High", "Critical"]}
        className="mt-6"
      />
      <DonutChart
        label={`Σ ${data.total}`}
        className="mt-6"
        data={data.result}
        showLabel={true}
        index="label"
        category="value"
        colors={["gray", "red", "amber", "green"]}
      />
      <List className="mt-6">
        {data.result.map(({ label, value, color, delta }) => (
          <ListItem key={label}>
            {label}
            <Badge size="xs" color={color}>
              {value}Σ - {delta}%
            </Badge>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}
