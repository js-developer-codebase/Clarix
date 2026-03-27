"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddSubscriptionDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      vendor: formData.get("vendor"),
      category: formData.get("category"),
      monthlyCostINR: parseFloat(formData.get("monthlyCostINR") as string),
      renewalDate: formData.get("renewalDate"),
      licenses: parseInt(formData.get("licenses") as string),
      activeUsers: parseInt(formData.get("activeUsers") as string),
      billingCycle: formData.get("billingCycle"),
      action: "KEEP",
    };

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add subscription");

      toast.success("Subscription added to stack!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Error adding subscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gold-500 text-black hover:bg-gold-600 font-bold gap-2 shadow-[0_0_15px_rgba(245,200,66,0.2)] transition-shadow">
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f0f0f] border-[#1a1a1a] text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Expand Subscription Stack</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4 px-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Service Name</Label>
              <Input name="name" placeholder="Cursor AI" className="bg-[#0a0a0a] border-zinc-800" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Vendor</Label>
              <Input name="vendor" placeholder="Anysphere" className="bg-[#0a0a0a] border-zinc-800" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Financial Category</Label>
            <Select name="category" required defaultValue="DEVTOOLS">
              <SelectTrigger className="bg-[#0a0a0a] border-zinc-800">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f0f] border-zinc-800">
                <SelectItem value="PRODUCTIVITY">Productivity</SelectItem>
                <SelectItem value="MARKETING">Marketing</SelectItem>
                <SelectItem value="FINANCE">Finance</SelectItem>
                <SelectItem value="ENGINEERING">Engineering</SelectItem>
                <SelectItem value="DEVTOOLS">DevTools</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Monthly Burn (₹)</Label>
              <Input name="monthlyCostINR" type="number" placeholder="1600" className="bg-[#0a0a0a] border-zinc-800" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Billing Cycle</Label>
              <Select name="billingCycle" required defaultValue="MONTHLY">
                <SelectTrigger className="bg-[#0a0a0a] border-zinc-800">
                  <SelectValue placeholder="Cycle" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-zinc-800">
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Next Renewal Date</Label>
            <Input name="renewalDate" type="date" className="bg-[#0a0a0a] border-zinc-800" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Total Seats</Label>
              <Input name="licenses" type="number" placeholder="10" className="bg-[#0a0a0a] border-zinc-800" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Active Seats</Label>
              <Input name="activeUsers" type="number" placeholder="8" className="bg-[#0a0a0a] border-zinc-800" required />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold h-11"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add to Infrastructure
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
