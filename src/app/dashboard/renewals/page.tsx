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
import { Calendar, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ObjectId } from "mongodb";

export default async function RenewalsPage() {
  const session = await auth();
  if (!session?.user?.companyId) return null;

  const client = await clientPromise;
  const db = client.db();
  const companyId = new ObjectId(session.user.companyId);
  
  // Fetch subscriptions with owner info via lookup
  const subscriptions = await db.collection("subscriptions").aggregate([
    { $match: { companyId, status: "ACTIVE" } },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "ownerInfo"
      }
    },
    {
      $addFields: {
        ownerName: { $ifNull: [{ $arrayElemAt: ["$ownerInfo.name", 0] }, "N/A"] }
      }
    },
    { $sort: { renewalDate: 1 } }
  ]).toArray();

  const today = new Date();
  
  const sections = [
    { 
      title: "This Month", 
      subs: subscriptions.filter((s: any) => {
        const d = new Date(s.renewalDate);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      })
    },
    { 
      title: "Next Month", 
      subs: subscriptions.filter((s: any) => {
        const d = new Date(s.renewalDate);
        const nextMonth = (today.getMonth() + 1) % 12;
        const nextYear = today.getFullYear() + (today.getMonth() === 11 ? 1 : 0);
        return d.getMonth() === nextMonth && d.getFullYear() === nextYear;
      })
    },
    { 
      title: "Beyond 60 Days", 
      subs: subscriptions.filter((s: any) => {
        const d = new Date(s.renewalDate);
        const sixtyDaysFromNow = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
        return d > sixtyDaysFromNow;
      })
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Renewal Intelligence</h2>
        <p className="text-sm text-zinc-500 font-medium">Mitigate financial risk and prevent service disruptions.</p>
      </div>

      <div className="bg-gold-500/5 border border-gold-500/10 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-500">Scheduled Outflow</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {formatINR(sections[0].subs.reduce((acc: number, s: any) => acc + (s.monthlyCostINR * 12), 0))}
          </h3>
          <p className="text-xs text-zinc-500">Value of contracts renewing in the next 30 days.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gold-500 text-black hover:bg-gold-600 font-bold px-8">Audit All Renewals</Button>
        </div>
      </div>

      {sections.map((section, idx) => (
        section.subs.length > 0 && (
          <div key={idx} className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {section.title}
            </h3>
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-[#0a0a0a]">
                  <TableRow className="border-[#1a1a1a] hover:bg-transparent">
                    <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold py-4">Tool</TableHead>
                    <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Owner</TableHead>
                    <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Annual Cost</TableHead>
                    <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Renewal Date</TableHead>
                    <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold text-center">Urgency</TableHead>
                    <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.subs.map((sub: any) => {
                    const diffDays = Math.ceil((new Date(sub.renewalDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <TableRow key={sub._id.toString()} className="border-[#141414] hover:bg-[#111] transition-colors group cursor-pointer">
                        <TableCell className="py-4">
                          <span className="font-semibold text-white text-sm">{sub.name}</span>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-400">{sub.ownerName}</TableCell>
                        <TableCell className="font-medium text-white text-sm">{formatINR(sub.monthlyCostINR * 12)}</TableCell>
                        <TableCell className="text-xs text-zinc-400">
                          {formatDateIN(sub.renewalDate)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[8px] uppercase font-bold py-0 h-5 border-zinc-900 mx-auto w-fit",
                              diffDays < 14 ? "bg-red-950 text-red-500 border-red-900" :
                              diffDays <= 30 ? "bg-amber-950 text-amber-500 border-amber-900" :
                              "bg-emerald-950 text-emerald-500 border-emerald-900"
                            )}>
                            {diffDays < 0 ? "Expired" : `${diffDays} Days Left`}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-8 border-[#1a1a1a] text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-500">
                            Renew Contract
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      ))}
    </div>
  );
}
