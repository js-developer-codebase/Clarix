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

export function NewCompanyDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      slug: (formData.get("name") as string).toLowerCase().replace(/\s+/g, '-'),
      industry: formData.get("industry"),
      plan: formData.get("plan"),
      adminEmail: formData.get("adminEmail"),
      adminPassword: formData.get("adminPassword"),
    };

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create company");

      toast.success("Company created successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Error creating company");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gold-500 text-black hover:bg-gold-600 font-bold gap-2">
          <Plus className="w-5 h-5" />
          New Company
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f0f0f] border-[#1a1a1a] text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">On-board Enterprise Tenant</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Company Identity</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="e.g., SpaceX India" 
              className="bg-[#0a0a0a] border-zinc-800 text-sm h-11 focus-visible:ring-gold-500" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Industry Vertical</Label>
            <Select name="industry" required>
              <SelectTrigger className="bg-[#0a0a0a] border-zinc-800 h-11">
                <SelectValue placeholder="Select vertical" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f0f] border-zinc-800">
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                <SelectItem value="FINANCE">Finance</SelectItem>
                <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                <SelectItem value="RETAIL">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2 border-t border-[#1a1a1a] mt-2">
            <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-3">Initial Admin Access</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="text-[10px] font-bold text-zinc-500 uppercase">Admin Email</Label>
                <Input id="adminEmail" name="adminEmail" type="email" placeholder="admin@tenant.com" className="bg-[#0a0a0a] border-zinc-800" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword" className="text-[10px] font-bold text-zinc-500 uppercase">Initial Password</Label>
                <Input id="adminPassword" name="adminPassword" type="password" placeholder="Min. 4 characters" className="bg-[#0a0a0a] border-zinc-800" minLength={4} required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Platform Tier</Label>
            <Select name="plan" required defaultValue="STARTER">
              <SelectTrigger className="bg-[#0a0a0a] border-zinc-800 h-11">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f0f] border-zinc-800">
                <SelectItem value="STARTER">Starter Pack</SelectItem>
                <SelectItem value="GROWTH">Growth Scale</SelectItem>
                <SelectItem value="ENTERPRISE">Full Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold h-11"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Finalize On-boarding
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
