
'use client';
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ReferenceLine } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { subDays, format } from 'date-fns';

const chartData = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(new Date(), 29 - i);
  return {
    date: date.toISOString(),
    health: 80 + Math.sin(i / 3) * 15 + Math.random() * 5,
  };
}).map(d => ({...d, health: Math.min(98, Math.max(20, d.health))}));


const treatmentDate = subDays(new Date(), 10).toISOString();

export function FieldHealthChart() {
  return (
    <div className="w-full">
        <p className="text-xs font-medium mb-2">Health Trend (30 Days)</p>
        <ChartContainer
            config={{
                health: {
                    label: 'Health Score',
                    color: 'hsl(var(--chart-1))',
                },
            }}
            className="h-[60px] w-full"
        >
            <AreaChart
                data={chartData}
                margin={{
                    left: 0,
                    right: 0,
                    top: 5,
                    bottom: 0,
                }}
                accessibilityLayer
            >
                <defs>
                    <linearGradient id="fillHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor="var(--color-health)"
                        stopOpacity={0.8}
                    />
                    <stop
                        offset="95%"
                        stopColor="var(--color-health)"
                        stopOpacity={0.1}
                    />
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <Tooltip 
                    cursor={false}
                    content={<ChartTooltipContent 
                        indicator="line" 
                        labelFormatter={(label, payload) => {
                             if(payload && payload.length > 0) {
                                return format(new Date(payload[0].payload.date), "MMM d");
                             }
                             return '';
                        }}
                        formatter={(value) => `${Number(value).toFixed(0)}/100`}
                    />} 
                />
                <Area
                    dataKey="health"
                    type="natural"
                    fill="url(#fillHealth)"
                    stroke="var(--color-health)"
                    stackId="a"
                />
                <ReferenceLine 
                    x={treatmentDate} 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                />
            </AreaChart>
        </ChartContainer>
    </div>
  );
}
