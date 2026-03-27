"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Building2, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  ShieldCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/super-admin" },
  { label: "Companies", icon: Building2, href: "/super-admin/companies" },
  { label: "Analytics", icon: BarChart3, href: "/super-admin/analytics" },
  { label: "Platform Settings", icon: Settings, href: "/super-admin/settings" },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-[240px] h-screen bg-[#080808] border-r border-[#1a1a1a] flex flex-col fixed left-0 top-0">
      <div className="h-14 border-b border-[#1a1a1a] flex items-center px-6">
        <span className="text-xl font-bold font-sans tracking-tight">
          Clarix<span className="text-gold-500">.</span>
        </span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 rounded-l-none" 
                  : "text-zinc-500 hover:text-white hover:bg-[#111]"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-gold-500" : "text-zinc-500 group-hover:text-white")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 px-2 py-3 bg-[#0f0f0f] rounded-lg border border-[#1a1a1a]">
          <Avatar className="h-8 w-8 border border-zinc-800">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-zinc-900 text-zinc-400 text-xs">
              {session?.user?.name?.[0] || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-medium text-white truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Super Admin
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-transparent"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
