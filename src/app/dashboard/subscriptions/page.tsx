import clientPromise from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateIN, formatINR } from "@/lib/formatINR";
import { 
  CreditCard, 
  ExternalLink, 
  Filter, 
  MoreVertical, 
  Plus, 
  Search,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { AddSubscriptionDialog } from "@/components/dashboard/AddSubscriptionDialog";

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user?.companyId) return null;

  const client = await clientPromise;
  const db = client.db();
  const companyId = new ObjectId(session.user.companyId);
  
  const subscriptions = await db.collection("subscriptions")
    .find({ companyId })
    .sort({ monthlyCostINR: -1 })
    .toArray();

  const totalMonthlySpend = subscriptions.reduce((acc: number, sub: any) => acc + sub.monthlyCostINR, 0);

  const categoryStyles: Record<string, string> = {
    PRODUCTIVITY: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MARKETING: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    FINANCE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    ENGINEERING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    DEVTOOLS: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    COMMUNICATION: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    DEFAULT: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans italic">
            <span className="bg-gold-500 text-black px-1.5 rounded mr-2">S</span>
            Subscription Stack
          </h2>
          <p className="text-sm text-zinc-500 font-medium">Monitor and manage your organization&apos;s active SaaS landscape.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <AddSubscriptionDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 rounded-lg space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Total Monthly Burn</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">{formatINR(totalMonthlySpend)}</h3>
            <span className="text-emerald-500 text-xs font-bold">+2.4% vs last month</span>
          </div>
        </div>
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 rounded-lg space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Active Licenses</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">{subscriptions.reduce((acc: number, s: any) => acc + s.licenses, 0)}</h3>
            <span className="text-zinc-500 text-xs font-medium">Across {subscriptions.length} platforms</span>
          </div>
        </div>
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 rounded-lg space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Average Utilization</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">84%</h3>
            <span className="text-rose-500 text-xs font-bold">-5% dropping</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a] flex flex-col md:flex-row gap-4 justify-between bg-[#0a0a0a]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Search by vendor or category..." 
              className="bg-[#050505] border-zinc-800 pl-10 focus-visible:ring-gold-500 text-sm"
            />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-[#0a0a0a]">
            {/* Headers headers same as before */}
            <TableRow className="border-[#1a1a1a] hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold py-4">Software Vendor</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Category</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Billing Cycle</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Monthy Cost</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Next Renewal</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Users</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub: any) => (
              <TableRow key={sub._id.toString()} className="border-[#141414] hover:bg-[#111] transition-colors group cursor-pointer">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-[#151515] flex items-center justify-center border border-zinc-800">
                      <CreditCard className="w-4 h-4 text-gold-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{sub.name}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">{sub.vendor}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-[9px] uppercase font-bold py-0 h-5", categoryStyles[sub.category] || categoryStyles.DEFAULT)}>
                    {sub.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-400 font-medium">{sub.billingCycle}</TableCell>
                <TableCell className="text-sm font-bold text-white">{formatINR(sub.monthlyCostINR)}</TableCell>
                <TableCell className="text-xs text-zinc-500">{formatDateIN(sub.renewalDate)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase">
                      <span>{Math.round((sub.activeUsers / sub.licenses) * 100)}% Used</span>
                      <span>{sub.activeUsers}/{sub.licenses}</span>
                    </div>
                    <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                      <div 
                        className={cn("h-full", (sub.activeUsers / sub.licenses) > 0.8 ? "bg-emerald-500" : "bg-gold-500")}
                        style={{ width: `${(sub.activeUsers / sub.licenses) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-[#151515]">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-[#151515]">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
