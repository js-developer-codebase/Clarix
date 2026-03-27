import { SpendChart } from "@/components/dashboard/SpendChart";
import { DeptBreakdown } from "@/components/dashboard/DeptBreakdown";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { BarChart3, TrendingDown, Target, Zap } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans italic">
          <span className="bg-gold-500 text-black px-1.5 rounded mr-2">A</span>
          Economic Intelligence
        </h2>
        <p className="text-sm text-zinc-500 font-medium">Deep dive into spend patterns and optimization vectors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpendChart />
        <DeptBreakdown />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5" /> Forecast Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">96.4%</div>
            <p className="text-[10px] text-zinc-500 mt-1">Reliability of upcoming renewal predictions.</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Reclaim Vector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">₹4.2L</div>
            <p className="text-[10px] text-zinc-500 mt-1">Available fiscal headroom from optimizations.</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Efficiency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold-500">B+</div>
            <p className="text-[10px] text-zinc-500 mt-1">Performance compared to industry peers.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
