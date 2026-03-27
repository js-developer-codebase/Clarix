import { SpendChart } from "@/components/dashboard/SpendChart";
import { DeptBreakdown } from "@/components/dashboard/DeptBreakdown";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Globe, Users, Building2 } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { formatINRCompact } from "@/lib/formatINR";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SuperAdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const client = await clientPromise;
  const db = client.db();

  const [totalUsers, totalCompanies, stats] = await Promise.all([
    db.collection("users").countDocuments({}),
    db.collection("companies").countDocuments({}),
    db.collection("subscriptions").aggregate([
      { $group: { _id: null, totalMonthlyCost: { $sum: "$monthlyCostINR" } } }
    ]).toArray(),
  ]);

  const totalMRR = stats[0]?.totalMonthlyCost || 0;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans italic">
          <span className="bg-gold-500 text-black px-1.5 rounded mr-2">G</span>
          Global Economic Analytics
        </h2>
        <p className="text-sm text-zinc-500 font-medium">Platform-wide spend velocity and tenant growth vectors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Total Platform MRR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{formatINRCompact(totalMRR)}</div>
            <p className="text-[10px] text-emerald-500 mt-1 font-bold">+12% from last quarter</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> Market Penetration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{totalCompanies}</div>
            <p className="text-[10px] text-zinc-500 mt-1 font-bold">ENTITIES ON-BOARDED</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Managed Identities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{totalUsers}</div>
            <p className="text-[10px] text-zinc-500 mt-1 font-bold">ACTIVE SEATS GLOBALLY</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-600 px-1">Across All Tenants (Monthly Spend)</h3>
          <SpendChart />
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-600 px-1">Global Department Distribution</h3>
          <DeptBreakdown />
        </div>
      </div>
    </div>
  );
}
