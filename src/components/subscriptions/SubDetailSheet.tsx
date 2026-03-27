"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDateIN } from "@/lib/formatINR";
import { Calendar, CreditCard, Link as LinkIcon, User, Package, PieChart, PenTool } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function SubDetailSheet({ 
  sub, 
  open, 
  onOpenChange 
}: { 
  sub: any; 
  open: boolean; 
  onOpenChange: (open: boolean) => void 
}) {
  if (!sub) return null;

  const usagePercent = Math.round((sub.activeUsers / sub.licenses) * 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#0f0f0f] border-l border-[#1a1a1a] w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-gold-500/10 text-gold-500 border-gold-500/20 uppercase text-[10px] tracking-widest font-bold">
              {sub.category}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500">
              <PenTool className="h-4 w-4" />
            </Button>
          </div>
          <SheetTitle className="text-2xl font-bold text-white tracking-tight">
            {sub.name}
          </SheetTitle>
          <SheetDescription className="text-zinc-500">
            Managed by {sub.owner?.name} in {sub.department}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8 pb-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
              <p className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Monthly Cost</p>
              <p className="text-lg font-bold text-white tracking-tight">{formatINR(sub.monthlyCostINR)}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
              <p className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Annual Value</p>
              <p className="text-lg font-bold text-white tracking-tight">{formatINR(sub.monthlyCostINR * 12)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                <PieChart className="w-3.5 h-3.5" /> Utilization Report
              </h4>
              <span className="text-xs font-bold text-white">{usagePercent}%</span>
            </div>
            <Progress value={usagePercent} className="h-2 bg-zinc-900" />
            <div className="flex justify-between text-xs font-medium">
              <span className="text-zinc-500">Total Licenses: <span className="text-white">{sub.licenses}</span></span>
              <span className="text-zinc-500">Active Users: <span className="text-white">{sub.activeUsers}</span></span>
            </div>
          </div>

          <Separator className="bg-[#1a1a1a]" />

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
              <Package className="w-3.5 h-3.5" /> Asset Attributes
            </h4>
            <div className="grid gap-3">
              {[
                { icon: CreditCard, label: "Vendor", value: sub.vendor },
                { icon: Calendar, label: "Renewal", value: formatDateIN(sub.renewalDate) },
                { icon: User, label: "Dept Owner", value: sub.owner?.name },
                { icon: LinkIcon, label: "Contract", value: sub.contractUrl || "Not Attached", isLink: !!sub.contractUrl },
              ].map((item, id) => (
                <div key={id} className="flex items-center justify-between text-sm py-1 border-b border-[#141414] last:border-0 pb-1.5 cursor-default hover:bg-[#111] transition-all px-1 -mx-1 rounded">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-tight">{item.label}</span>
                  </div>
                  <span className={cc("text-white font-medium", item.isLink && "text-blue-400 underline decoration-blue-900")}>
                    {item.value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {sub.notes && (
            <div className="bg-zinc-900/40 rounded-lg p-4 border border-zinc-800/50">
              <p className="text-[10px] uppercase font-bold text-zinc-600 mb-2">Audit Notes</p>
              <p className="text-xs text-zinc-400 leading-relaxed italic">
                "{sub.notes}"
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function cc(...classes: any[]) { return classes.filter(Boolean).join(' '); }
