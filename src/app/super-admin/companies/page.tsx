import clientPromise from "@/lib/mongodb";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatINRCompact, formatDateIN } from "@/lib/formatINR";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NewCompanyDialog } from "@/components/super-admin/NewCompanyDialog";
import { CompanyActions } from "@/components/super-admin/CompanyActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CompaniesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const client = await clientPromise;
  const db = client.db();

  // Aggregate companies with counts using MongoDB aggregation
  const companies = await db.collection("companies").aggregate([
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "companyId",
        as: "users"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "companyId",
        as: "subscriptions"
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        industry: 1,
        plan: 1,
        isActive: 1,
        createdAt: 1,
        userCount: { $size: "$users" },
        subCount: { $size: "$subscriptions" },
        totalSpend: { $sum: "$subscriptions.monthlyCostINR" }
      }
    },
    { $sort: { createdAt: -1 } }
  ]).toArray();

  const planStyles = {
    STARTER: "bg-zinc-800 text-zinc-300 border-zinc-700",
    GROWTH: "bg-blue-950 text-blue-400 border-blue-800",
    ENTERPRISE: "bg-yellow-950 text-yellow-400 border-yellow-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Enterprise Tenants</h2>
          <p className="text-sm text-zinc-500 font-medium">Manage and monitor all companies on the Clarix platform.</p>
        </div>
        <NewCompanyDialog />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search by company name, industry or slug..." 
            className="pl-9 bg-[#0f0f0f] border-[#1a1a1a] h-11 text-sm focus-visible:ring-gold-500"
          />
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0a0a0a]">
            <TableRow className="border-[#1a1a1a] hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold py-5">Company</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Industry</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Plan</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Users/Subs</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Monthly Spend</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Member Since</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company: any) => {
              return (
                <TableRow key={company._id.toString()} className="border-[#141414] hover:bg-[#111] transition-colors group cursor-pointer">
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-zinc-800 rounded mx-auto overflow-hidden">
                        <AvatarFallback className="bg-zinc-900 text-zinc-400 text-xs rounded-none text-center">
                          {company.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">{company.name}</span>
                        <span className="text-[10px] text-zinc-500">/{company.slug}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400">{company.industry}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={planStyles[company.plan as keyof typeof planStyles]}>
                      {company.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400">
                    <span className="text-white font-medium">{company.userCount}</span> users / 
                    <span className="text-white font-medium ml-1">{company.subCount}</span> subs
                  </TableCell>
                  <TableCell className="font-bold text-white text-sm">
                    {formatINRCompact(company.totalSpend)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={cc('h-1.5 w-1.5 rounded-full', company.isActive !== false ? 'bg-emerald-500' : 'bg-red-500')} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {company.isActive !== false ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400">
                    {formatDateIN(company.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <CompanyActions companyId={company._id.toString()} isActive={company.isActive !== false} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function cc(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
