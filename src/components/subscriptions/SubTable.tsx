"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileEdit, Eye, Trash2, AlertCircle } from "lucide-react";
import { formatINR, formatDateIN } from "@/lib/formatINR";
import { cn } from "@/lib/utils";

interface Subscription {
  _id?: string | any;
  id?: string;
  name: string;
  vendor: string;
  department: string;
  monthlyCostINR: number;
  licenses: number;
  activeUsers: number;
  status: string;
  action: string;
  renewalDate: Date | string;
  owner?: { name: string };
}

interface SubTableProps {
  data: Subscription[];
}

const statusStyles = {
  ACTIVE: "bg-emerald-950 text-emerald-400 border-emerald-800",
  INACTIVE: "bg-zinc-900 text-zinc-500 border-zinc-800",
  TRIAL: "bg-amber-950 text-amber-400 border-amber-800",
  CANCELLED: "bg-red-950 text-red-400 border-red-800",
};

const actionStyles = {
  KEEP: "bg-emerald-950 text-emerald-400 border-emerald-800",
  CANCEL: "bg-red-950 text-red-400 border-red-800",
  DOWNSIZE: "bg-amber-950 text-amber-400 border-amber-800",
  CONSOLIDATE: "bg-blue-950 text-blue-400 border-blue-800",
  REVIEW: "bg-zinc-800 text-zinc-300 border-zinc-700",
};

export function SubTable({ data }: SubTableProps) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-[#0a0a0a]">
          <TableRow className="border-[#1a1a1a] hover:bg-transparent">
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold py-4">Tool</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Dept</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Cost (₹/mo)</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Seats (Used/Total)</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Usage</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Status/Action</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Renewal</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sub) => {
            const usagePercent = Math.round((sub.activeUsers / sub.licenses) * 100);
            return (
              <TableRow key={sub._id?.toString() || sub.id} className="border-[#141414] hover:bg-[#111] transition-colors group cursor-pointer">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-sm">{sub.name}</span>
                    <span className="text-[10px] text-zinc-500">{sub.vendor}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-zinc-400">{sub.department}</TableCell>
                <TableCell className="font-medium text-white text-sm">{formatINR(sub.monthlyCostINR)}</TableCell>
                <TableCell className="text-xs text-zinc-400">
                  <span className="text-white font-medium">{sub.activeUsers}</span> / {sub.licenses}
                </TableCell>
                <TableCell className="min-w-[120px]">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center px-0.5">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase">{usagePercent}%</span>
                    </div>
                    <Progress value={usagePercent} className="h-1 bg-zinc-900 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-500",
                          usagePercent > 70 ? "bg-emerald-500" : 
                          usagePercent > 30 ? "bg-amber-500" : "bg-rose-500"
                        )} 
                        style={{ width: `${usagePercent}%` }} 
                      />
                    </Progress>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <Badge variant="outline" className={cn("text-[8px] uppercase font-bold py-0 h-4 border-zinc-800", statusStyles[sub.status as keyof typeof statusStyles])}>
                      {sub.status}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[8px] uppercase font-bold py-0 h-4", actionStyles[sub.action as keyof typeof actionStyles])}>
                      {sub.action}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-zinc-400">
                  {formatDateIN(sub.renewalDate)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-transparent">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-[#1a1a1a] text-zinc-400">
                      <DropdownMenuItem className="hover:bg-[#1a1a1a] hover:text-white cursor-pointer flex gap-2">
                        <Eye className="w-4 h-4" /> View Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-[#1a1a1a] hover:text-white cursor-pointer flex gap-2">
                        <FileEdit className="w-4 h-4" /> Edit Tool
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-[#1a1a1a] hover:text-white cursor-pointer flex gap-2">
                        <AlertCircle className="w-4 h-4" /> Flag for Review
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-[#1a1a1a] hover:text-red-400 cursor-pointer flex gap-2 text-red-400">
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
