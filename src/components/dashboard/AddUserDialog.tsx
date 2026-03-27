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
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      department: formData.get("department"),
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to invite user");

      toast.success("User invited successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Error creating user profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gold-500 text-black hover:bg-gold-600 font-bold gap-2">
          <UserPlus className="w-4 h-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f0f0f] border-[#1a1a1a] text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">Invite Organization Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Full Legal Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Aman Sharma" 
              className="bg-[#0a0a0a] border-zinc-800 h-11 focus-visible:ring-gold-500" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Enterprise Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="aman@infospark.in" 
              className="bg-[#0a0a0a] border-zinc-800 h-11 focus-visible:ring-gold-500" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Access Tier</Label>
            <Select name="role" required defaultValue="USER">
              <SelectTrigger className="bg-[#0a0a0a] border-zinc-800 h-11">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f0f] border-zinc-800">
                <SelectItem value="COMPANY_ADMIN">Owner / Administrator</SelectItem>
                <SelectItem value="USER">Department Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Department</Label>
            <Select name="department" required defaultValue="ENGINEERING">
              <SelectTrigger className="bg-[#0a0a0a] border-zinc-800 h-11">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f0f] border-zinc-800">
                <SelectItem value="ENGINEERING">Engineering</SelectItem>
                <SelectItem value="MARKETING">Marketing</SelectItem>
                <SelectItem value="FINANCE">Finance</SelectItem>
                <SelectItem value="PRODUCTIVITY">Productivity</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
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
              Send Invite Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
