"use client";

import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Cell 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINRCompact } from "@/lib/formatINR";

const data = [
  { dept: "Engineering", spend: 94000 },
  { dept: "Marketing", spend: 32000 },
  { dept: "Operations", spend: 18000 },
  { dept: "Sales", spend: 28000 },
  { dept: "Finance", spend: 12000 },
  { dept: "HR", spend: 34000 },
];

const COLORS = ['#f5c842', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

export function DeptBreakdown() {
  return (
    <Card className="bg-[#0f0f0f] border-[#1a1a1a] h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">
          Spend by Department (₹)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] pt-4 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis 
              type="number"
              fontSize={10} 
              tick={{ fill: '#71717a' }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(val) => formatINRCompact(val)}
            />
            <YAxis 
              dataKey="dept"
              type="category"
              fontSize={10} 
              tick={{ fill: '#71717a' }} 
              axisLine={false} 
              tickLine={false}
              width={80}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161616', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#fff', marginBottom: '4px' }}
              formatter={(val: any) => [formatINRCompact(Number(val) || 0), "Monthly Spend"]}
              cursor={{ fill: 'transparent', stroke: '#1a1a1a' }}
            />
            <Bar 
              dataKey="spend" 
              radius={[0, 4, 4, 0]} 
              barSize={12}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
