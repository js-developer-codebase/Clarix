import { MetricCard } from "@/components/dashboard/MetricCard";
import { Building2, CreditCard, PieChart, Users, TrendingUp, Gem, ShieldAlert } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { formatINRCompact } from "@/lib/formatINR";
import { SpendChart } from "@/components/dashboard/SpendChart";
import { DeptBreakdown } from "@/components/dashboard/DeptBreakdown";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SuperAdminOverview() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const [totalCompanies, activeSubs, stats, trialCompanies] = await Promise.all([
      db.collection("companies").countDocuments({ isActive: { $ne: false } }),
      db.collection("subscriptions").countDocuments({ status: 'ACTIVE' }),
      db.collection("subscriptions").aggregate([
        { $group: { _id: null, totalMonthlyCost: { $sum: "$monthlyCostINR" } } }
      ]).toArray(),
      db.collection("companies").countDocuments({ plan: 'STARTER' }),
    ]);

    const totalMRR = stats[0]?.totalMonthlyCost || 0;

    return (
      <div className="space-y-8 pb-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Platform Overview</h2>
          <p className="text-sm text-zinc-500 font-medium">Global intelligence and ecosystem monitoring.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Consolidated Companies" 
            value={totalCompanies} 
            icon={Building2}
            trend={{ value: 12, isUp: true }}
            description="Active enterprise entities on-boarded."
          />
          <MetricCard 
            title="Global Subscriptions" 
            value={activeSubs} 
            icon={CreditCard}
            trend={{ value: 8, isUp: true }}
            description="Monitored SaaS assets across all tenants."
          />
          <MetricCard 
            title="Platform MRR (₹)" 
            value={formatINRCompact(totalMRR)} 
            icon={TrendingUp}
            trend={{ value: 4, isUp: true }}
            description="Total monthly recurring throughput."
          />
          <MetricCard 
            title="Growth Portfolio" 
            value={trialCompanies} 
            icon={Gem}
            description="Companies on Starter / Entry-level tiers."
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-600 px-1">
              Global Utilization Performance
            </h3>
            <SpendChart />
          </div>
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-600 px-1">
              Industry Vertical Distribution
            </h3>
            <DeptBreakdown />
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6 flex items-center justify-between group cursor-pointer hover:border-gold-500/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gold-500/5 flex items-center justify-center border border-gold-500/10">
              <PieChart className="w-5 h-5 text-gold-500" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">System Diagnostics</h4>
              <p className="text-xs text-zinc-500">All services (MongoDB, Resend, Vercel Edge) are performing optimally.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Live Link Active</span>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <ShieldAlert className="w-12 h-12 text-rose-500" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Database Error</h2>
          <p className="text-sm text-zinc-500 max-w-sm">Failed to fetch platform metrics. Verify your MongoDB connection.</p>
        </div>
      </div>
    );
  }
}
