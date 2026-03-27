"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

export function TopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return "Dashboard";
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
  };

  return (
    <header className="h-14 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-sm font-semibold text-zinc-400">
        {getPageTitle()}
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search..." 
            className="pl-9 bg-[#0f0f0f] border-[#1a1a1a] h-9 text-sm focus-visible:ring-gold-500"
          />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-zinc-400 hover:text-white hover:bg-[#111]"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-gold-500 border-2 border-[#0a0a0a]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-zinc-400 hover:text-white hover:bg-[#111]"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-[#1a1a1a] text-zinc-400">
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#1a1a1a]" />
            <DropdownMenuItem className="hover:bg-[#1a1a1a] hover:text-white cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#1a1a1a] hover:text-white cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#1a1a1a]" />
            <DropdownMenuItem className="hover:bg-[#1a1a1a] hover:text-white cursor-pointer text-red-400">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
