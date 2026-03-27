import clientPromise from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { 
  Bell, 
  AlertTriangle, 
  RefreshCcw, 
  Trash2,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateWithTime } from "@/lib/formatINR";
import { ObjectId } from "mongodb";

export default async function AlertsPage() {
  const session = await auth();
  if (!session?.user?.companyId) return null;

  const client = await clientPromise;
  const db = client.db();
  const companyId = new ObjectId(session.user.companyId);
  
  const alerts = await db.collection("alerts")
    .find({ companyId })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans italic">
            <span className="bg-gold-500 text-black px-1.5 rounded mr-2">E</span>
            Exception Monitoring
          </h2>
          <p className="text-sm text-zinc-500 font-medium">Auto-detected anomalies requiring administrative intervention.</p>
        </div>
        <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 gap-2">
          Dismiss All
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="h-64 border border-dashed border-[#1a1a1a] rounded-lg flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
            <p className="text-zinc-500 text-sm">System is healthy. No active exceptions detected.</p>
          </div>
        ) : (
          alerts.map((alert: any) => (
            <div key={alert._id.toString()} className="bg-[#0f0f0f] border border-[#1a1a1a] p-4 rounded-lg flex items-start gap-4 hover:border-zinc-800 transition-colors group">
              <div className="h-9 w-9 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800">
                {alert.type === 'LOW_USAGE' ? (
                  <RefreshCcw className="w-4 h-4 text-amber-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[8px] font-bold uppercase py-0 h-4 border-zinc-800">
                    {alert.type}
                  </Badge>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    {formatDateWithTime(alert.createdAt || new Date())}
                  </span>
                </div>
                <p className="text-sm text-white font-medium">{alert.message}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8 text-zinc-500 hover:text-white">Resolve</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-rose-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
