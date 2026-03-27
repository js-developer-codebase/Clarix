import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Key, Bell, Database, Globe } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SuperAdminSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-white font-sans italic">
          <span className="bg-gold-500 text-black px-1.5 rounded mr-2">C</span>
          Core Configuration
        </h2>
        <p className="text-sm text-zinc-500 font-medium">Platform-wide governance and infrastructure parameters.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="w-5 h-5 text-gold-500" /> Database Engine
            </CardTitle>
            <CardDescription className="text-zinc-500">Connected to native MongoDB cluster.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono">mongodb+srv://webshield:WebShield2003...</span>
              <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold uppercase border-zinc-800">Test Connection</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-gold-500" /> Platform Governance
            </CardTitle>
            <CardDescription className="text-zinc-500">Control global security and tenant policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Maintenance Mode</p>
                <p className="text-xs text-zinc-500 font-medium">Prevent all tenants from accessing their dashboards.</p>
              </div>
              <Button size="sm" variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10">Activate</Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Public Registrations</p>
                <p className="text-xs text-zinc-500 font-medium">Allow new companies to sign up without invitations.</p>
              </div>
              <Button size="sm" variant="outline" className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">Disabled</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
