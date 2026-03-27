"use client";

import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Power, Trash2, Key } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CompanyActions({ companyId, isActive }: { companyId: string, isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleStatus() {
    setLoading(true);
    try {
      const res = await fetch(`/api/companies/${companyId}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(isActive ? "Company Access Suspended" : "Company Access Restored");
      router.refresh();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCompany() {
    if (!confirm("Are you sure? This will delete ALL data for this tenant.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/companies/${companyId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Tenant fully decommissioned");
      router.refresh();
    } catch (error) {
      toast.error("Deletion failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-zinc-800 text-white">
        <DropdownMenuLabel className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Lifecycle Management</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem onClick={toggleStatus} className="gap-2 cursor-pointer focus:bg-zinc-900 focus:text-white">
          <Power className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-emerald-500'}`} />
          {isActive ? 'Suspend Access' : 'Restore Access'}
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-zinc-900 focus:text-white">
          <Key className="w-4 h-4 text-gold-500" />
          Reset Root Admin
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem onClick={deleteCompany} className="gap-2 cursor-pointer text-rose-500 focus:bg-rose-950 focus:text-rose-400">
          <Trash2 className="w-4 h-4" />
          Decommission Tenant
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
