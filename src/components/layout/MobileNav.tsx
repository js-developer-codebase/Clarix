"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isSuperAdmin = pathname.startsWith("/super-admin");

  return (
    <div className="md:hidden flex items-center h-14 border-b border-[#1a1a1a] px-4 fixed top-0 left-0 right-0 bg-[#0a0a0a] z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 border-[#1a1a1a] bg-[#080808]">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-6 h-14 border-b border-[#1a1a1a]">
              <span className="text-xl font-bold font-sans tracking-tight">
                Clarix<span className="text-gold-500">.</span>
              </span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {isSuperAdmin ? <SuperAdminSidebar /> : <DashboardSidebar />}
          </div>
        </SheetContent>
      </Sheet>
      <div className="ml-4 font-bold tracking-tight">Clarix</div>
    </div>
  );
}
