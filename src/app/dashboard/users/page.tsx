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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateIN } from "@/lib/formatINR";
import { UserPlus, MoreHorizontal, Mail, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { AddUserDialog } from "@/components/dashboard/AddUserDialog";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user?.companyId || session.user.role !== "COMPANY_ADMIN") {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <ShieldCheck className="w-12 h-12 text-rose-500" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-sm text-zinc-500 max-w-sm">Only Company Administrators can manage users and organizational hierarchies.</p>
        </div>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db();
  const companyId = new ObjectId(session.user.companyId);
  
  const users = await db.collection("users")
    .find({ companyId })
    .sort({ createdAt: -1 })
    .toArray();

  const roleStyles: Record<string, string> = {
    COMPANY_ADMIN: "bg-gold-500/10 text-gold-500 border-gold-500/20",
    USER: "bg-zinc-800 text-zinc-400 border-zinc-700",
    SUPER_ADMIN: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">User Management</h2>
          <p className="text-sm text-zinc-500 font-medium">Control access, define roles and monitor active members.</p>
        </div>
        <AddUserDialog />
      </div>

      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0a0a0a]">
            <TableRow className="border-[#1a1a1a] hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold py-4">Identity</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Email Address</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Role Hierarchy</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Department</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">Joined On</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user._id.toString()} className="border-[#141414] hover:bg-[#111] transition-colors group cursor-pointer">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-zinc-800">
                      <AvatarFallback className="bg-zinc-900 text-zinc-400 text-xs">
                        {user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-white text-sm">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-zinc-400 group-hover:text-gold-400 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-[9px] uppercase font-bold py-0 h-5", roleStyles[user.role] || roleStyles.USER)}>
                    {user.role === 'COMPANY_ADMIN' ? 'Administrator' : 'Department Member'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-400 uppercase tracking-tighter">{user.department || "Organization-wide"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('h-1.5 w-1.5 rounded-full', user.isActive !== false ? 'bg-emerald-500' : 'bg-red-500')} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {user.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-zinc-400">
                  {formatDateIN(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-transparent">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
