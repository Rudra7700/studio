'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'January', sprays: 12, detections: 5 },
  { month: 'February', sprays: 19, detections: 8 },
  { month: 'March', sprays: 25, detections: 15 },
  { month: 'April', sprays: 32, detections: 22 },
  { month: 'May', sprays: 45, detections: 30 },
  { month: 'June', sprays: 38, detections: 26 },
];

const chartConfig = {
  sprays: {
    label: 'Sprays',
    color: 'hsl(var(--chart-1))',
  },
  detections: {
    label: 'Detections',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function Analytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Analytics</CardTitle>
        <CardDescription>Monthly sprays and disease detections.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="sprays" fill="var(--color-sprays)" radius={4} />
                <Bar dataKey="detections" fill="var(--color-detections)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
