import { SuperAdminSidebar } from "@/components/layout/SuperAdminSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MobileNav />
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:block">
          <SuperAdminSidebar />
        </div>
        <main className="flex-1 flex flex-col md:pl-[240px] pt-14 md:pt-0">
          <TopBar />
          <div className="flex-1 overflow-y-auto p-6 md:p-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
