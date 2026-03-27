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
import { formatINRCompact } from "@/lib/formatINR";
import { Sparkles } from "lucide-react";

const optimizations = [
  { name: "Notion", issue: "Low usage (26%)", action: "CANCEL", saving: 4800 },
  { name: "Canva Pro", issue: "Low usage (20%)", action: "CANCEL", saving: 3200 },
  { name: "Zoom", issue: "Unused licenses (32)", action: "DOWNSIZE", saving: 5600 },
  { name: "Trello", issue: "Redundant with Jira", action: "CONSOLIDATE", saving: 2100 },
  { name: "Chargebee", issue: "Underutilized tier", action: "DOWNSIZE", saving: 1500 },
];

const actionStyles = {
  CANCEL: "bg-red-950 text-red-400 border-red-800",
  DOWNSIZE: "bg-amber-950 text-amber-400 border-amber-800",
  CONSOLIDATE: "bg-blue-950 text-blue-400 border-blue-800",
  REVIEW: "bg-zinc-800 text-zinc-300 border-zinc-700",
  KEEP: "bg-emerald-950 text-emerald-400 border-emerald-800",
};

export function OptimizationTable() {
  return (
    <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">
          Optimization Opportunities
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 border-gold-500/20 text-gold-500 hover:bg-gold-500/10 hover:text-gold-500 bg-transparent gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Analyze All
        </Button>
      </div>
      <Table>
        <TableHeader className="bg-[#0a0a0a]">
          <TableRow className="border-[#1a1a1a] hover:bg-transparent">
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Tool</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Issue</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Recommended Action</TableHead>
            <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold text-right">Potential Saving</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimizations.map((opt) => (
            <TableRow key={opt.name} className="border-[#141414] hover:bg-[#111] transition-colors group cursor-pointer">
              <TableCell className="font-medium text-white text-sm py-4">{opt.name}</TableCell>
              <TableCell className="text-zinc-500 text-xs py-4">{opt.issue}</TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className={actionStyles[opt.action as keyof typeof actionStyles]}>
                  {opt.action}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold text-emerald-400 text-sm py-4">
                {formatINRCompact(opt.saving)}/mo
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
