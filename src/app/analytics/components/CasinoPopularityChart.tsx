'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface CasinoPopularityChartProps {
    data: { name: string; count: number }[];
}

export function CasinoPopularityChart({ data }: CasinoPopularityChartProps) {
  if (!data || data.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Sweeps Casino Popularity</CardTitle>
          <CardDescription>Top 10 sweeps casinos by user registrations.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">No data available to display.</p>
            </div>
        </CardContent>
      </Card>
    )
  }
  
  const chartConfig = {
    registrations: {
      label: 'Registrations',
      color: 'hsl(var(--primary))',
    },
  };

  const chartHeight = Math.max(300, data.length * 30);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sweeps Casino Popularity</CardTitle>
        <CardDescription>Top 10 sweeps casinos by user registrations.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[--chart-height] w-full" style={{'--chart-height': `${chartHeight}px`} as React.CSSProperties}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                width={120} 
                tick={{ fontSize: 12 }} 
              />
              <XAxis type="number" allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="count" fill="var(--color-registrations)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <TrendingUp className="h-4 w-4" /> Most popular sweeps casinos are shown.
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Based on user registrations in the tracker.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
