import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className 
}: MetricCardProps) {
  return (
    <Card className={cn(
      "bg-[#0f0f0f] border-[#1a1a1a] transition-all duration-300 hover:border-gold-500/30 overflow-hidden group relative",
      className
    )}>
      <div className="absolute top-0 right-0 p-4">
        {Icon && (
          <div className="p-2 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] group-hover:border-gold-500/10 transition-colors">
            <Icon className="w-4 h-4 text-zinc-500 group-hover:text-gold-500 transition-colors" />
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-2">
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">
            {value}
          </span>
          {trend && (
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded transition-all",
              trend.isUp ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
            )}>
              {trend.isUp ? "+" : "-"}{trend.value}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-[10px] text-zinc-600 mt-2 font-medium">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
