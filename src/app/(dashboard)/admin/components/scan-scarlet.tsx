"use client"
import { Card, Title, Text, ScatterChart } from "@tremor/react";

const scanData = [
  {
    Target: "Server",
    Vulnerability_Count: 12,
    Scan_Duration: 45,
    Criticality_Score: 8,
  },
  {
    Target: "Notebook",
    Vulnerability_Count: 22,
    Scan_Duration: 32,
    Criticality_Score: 6,
  },
  {
    Target: "Other Computer",
    Vulnerability_Count: 22,
    Scan_Duration: 38,
    Criticality_Score: 7,
  },
  {
    Target: "Desktop",
    Vulnerability_Count: 44,
    Scan_Duration: 55,
    Criticality_Score: 9,
  },
  {
    Target: "Cloud Instance",
    Vulnerability_Count: 22,
    Scan_Duration: 60,
    Criticality_Score: 6,
  },
  {
    Target: "Virtual Machine",
    Vulnerability_Count: 22,
    Scan_Duration: 42,
    Criticality_Score: 5,
  },
  {
    Target: "Others",
    Vulnerability_Count: 22,
    Scan_Duration: 28,
    Criticality_Score: 4,
  },
];

export default function ScanScatterChart() {
  return (
    <Card>
      <Title>Cybersecurity Scan Analysis</Title>
      <Text>
        This scatter chart shows the results of cybersecurity scans performed on different targets.
      </Text>
      <ScatterChart
        className="h-80 mt-6 -ml-2"
        yAxisWidth={50}
        data={scanData}
        category="Target"
        x="Vulnerability_Count"
        y="Scan_Duration"
        size="Criticality_Score"
        showOpacity={true}
        minYValue={0}
        valueFormatter={{
          x: (count) => `${count} vulnerabilities`,
          y: (duration) => `${duration} minutes`,
          size: (score) => `Score: ${score}`,
        }}
        showLegend={false}
      />
    </Card>
  );
}
