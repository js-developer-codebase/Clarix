"use client";

import { 
  Plus, 
  Download, 
  Search, 
  Filter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function SubFilters() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search tools, vendors..." 
            className="pl-9 bg-[#0f0f0f] border-[#1a1a1a] h-10 text-sm focus-visible:ring-gold-500"
          />
        </div>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-40 bg-[#0f0f0f] border-[#1a1a1a] h-10 text-sm">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="bg-[#161616] border-[#1a1a1a]">
            <SelectItem value="all">All Depts</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-40 bg-[#0f0f0f] border-[#1a1a1a] h-10 text-sm">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent className="bg-[#161616] border-[#1a1a1a]">
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="keep">Keep</SelectItem>
            <SelectItem value="cancel">Cancel</SelectItem>
            <SelectItem value="downsize">Downsize</SelectItem>
            <SelectItem value="consolidate">Consolidate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button 
          variant="outline" 
          className="bg-transparent border-[#1a1a1a] hover:bg-[#111] hover:text-white text-zinc-400 gap-2 h-10 px-4"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
        <Button 
          className="bg-gold-500 text-black hover:bg-gold-600 font-bold gap-2 h-10 px-4"
        >
          <Plus className="w-5 h-5 stroke-[2.5px]" />
          New Subscription
        </Button>
      </div>
    </div>
  );
}
