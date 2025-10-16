'use client';

import { Activity } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DailyCollectionData } from '@/lib/actions/analytics-actions';

interface DailyBonusCollectionsChartProps {
    data: DailyCollectionData[];
}

export function DailyBonusCollectionsChart({ data }: DailyBonusCollectionsChartProps) {
  const chartConfig = {
    collections: {
      label: 'Collections',
      color: 'hsl(var(--primary))',
    },
  };
  
   if (!data || data.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Daily Bonus Collections</CardTitle>
          <CardDescription>Bonus collections over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">No data available to display.</p>
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Daily Bonus Collections</CardTitle>
          <CardDescription>
            Total bonuses collected by all users over the last 7 days.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillCollections" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-collections)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-collections)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <Tooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  />
                }
              />
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillCollections)"
                stroke="var(--color-collections)"
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
