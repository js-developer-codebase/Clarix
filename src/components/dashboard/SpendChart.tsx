"use client";

import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINRCompact } from "@/lib/formatINR";

const data = [
  { month: "Oct", spend: 120000 },
  { month: "Nov", spend: 135000 },
  { month: "Dec", spend: 142000 },
  { month: "Jan", spend: 138000 },
  { month: "Feb", spend: 154000 },
  { month: "Mar", spend: 158000 },
];

export function SpendChart() {
  return (
    <Card className="bg-[#0f0f0f] border-[#1a1a1a] h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">
          Monthly Spend Trend (₹)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5c842" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f5c842" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis 
              dataKey="month" 
              fontSize={10} 
              tick={{ fill: '#71717a' }} 
              axisLine={false} 
              tickLine={false}
              dy={10}
            />
            <YAxis 
              fontSize={10} 
              tick={{ fill: '#71717a' }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(val) => formatINRCompact(val)}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161616', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#f5c842' }}
              labelStyle={{ color: '#fff', marginBottom: '4px' }}
              formatter={(val: any) => [formatINRCompact(Number(val) || 0), "Monthly Spend"]}
              cursor={{ stroke: '#f5c842', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="spend" 
              stroke="#f5c842" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSpend)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
