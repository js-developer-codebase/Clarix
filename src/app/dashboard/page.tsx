import { MetricCard } from "@/components/dashboard/MetricCard";
import { 
  Building2, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  BarChart4, 
  Box, 
  Users,
  ShieldAlert
} from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { formatINRCompact } from "@/lib/formatINR";
import { auth } from "@/lib/auth";
import { SpendChart } from "@/components/dashboard/SpendChart";
import { DeptBreakdown } from "@/components/dashboard/DeptBreakdown";
import { OptimizationTable } from "@/components/dashboard/OptimizationTable";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

export default async function DashboardOverview() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "SUPER_ADMIN") {
    redirect("/super-admin");
  }

  if (!session.user.companyId) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <ShieldAlert className="w-12 h-12 text-zinc-800" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">No Organization Context</h2>
          <p className="text-sm text-zinc-500 max-w-sm">
            Your account is not associated with any company. Please contact support or clear your cookies and try again.
          </p>
        </div>
      </div>
    );
  }

  const companyId = new ObjectId(session.user.companyId);
  const client = await clientPromise;
  const db = client.db();

  // Aggregate stats using MongoDB aggregation pipeline
  const stats = await db.collection("subscriptions").aggregate([
    { $match: { companyId, status: 'ACTIVE' } },
    {
      $group: {
        _id: null,
        totalMonthlyCost: { $sum: "$monthlyCostINR" },
        totalLicenses: { $sum: "$licenses" },
        totalActiveUsers: { $sum: "$activeUsers" }
      }
    }
  ]).toArray();

  const statDoc = stats[0] || { totalMonthlyCost: 0, totalLicenses: 0, totalActiveUsers: 0 };

  const lowUsageCount = await db.collection("subscriptions").countDocuments({
    companyId,
    status: 'ACTIVE'
  });

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const renewalsThisMonth = await db.collection("subscriptions").countDocuments({
    companyId,
    renewalDate: {
      $gte: now,
      $lte: nextMonth
    }
  });

  const totalSpend = statDoc.totalMonthlyCost || 0;
  const totalLicenses = statDoc.totalLicenses || 0;
  const activeUsers = statDoc.totalActiveUsers || 0;
  const utilization = totalLicenses > 0 ? (activeUsers / totalLicenses) * 100 : 0;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Enterprise Overview</h2>
        <p className="text-sm text-zinc-500 font-medium">Monitoring and optimization for your subscription stack.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Monthly Spend" 
          value={formatINRCompact(totalSpend)} 
          icon={TrendingUp}
          trend={{ value: 1.4, isUp: true }}
          description="Consolidated spend across all departments."
        />
        <MetricCard 
          title="Reclaimable Spend" 
          value={formatINRCompact(totalSpend * 0.14)} 
          icon={Zap}
          description="Potential savings from under-utilized tools."
        />
        <MetricCard 
          title="Low-Usage Tools" 
          value={3} 
          icon={AlertTriangle}
          trend={{ value: 5, isUp: false }}
          description="Assets with utilization below 30% threshold."
        />
        <MetricCard 
          title="Renewals Pending" 
          value={renewalsThisMonth} 
          icon={BarChart4}
          description="Subscription renewals due this month."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Purchased Licenses" 
          value={totalLicenses} 
          icon={Box}
          className="bg-[#0c0c0c]"
        />
        <MetricCard 
          title="Active Users" 
          value={activeUsers} 
          icon={Users}
          className="bg-[#0c0c0c]"
        />
        <MetricCard 
          title="Avg. Utilization" 
          value={`${utilization.toFixed(1)}%`} 
          icon={TrendingUp}
          className="bg-[#0c0c0c]"
        />
        <MetricCard 
          title="Entry-Level/Trial" 
          value={2} 
          icon={CreditCard}
          className="bg-[#0c0c0c]"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SpendChart />
        <DeptBreakdown />
      </div>

      <div className="space-y-4">
        <OptimizationTable />
      </div>
    </div>
  );
}
