import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const today = new Date();
    const checks = [30, 60, 90];
    let alertsCreated = 0;

    // 1. Renewal Checks
    for (const days of checks) {
      const targetDateStart = new Date();
      targetDateStart.setDate(today.getDate() + days);
      targetDateStart.setHours(0, 0, 0, 0);
      
      const targetDateEnd = new Date(targetDateStart);
      targetDateEnd.setHours(23, 59, 59, 999);
      
      const expiringSubs = await db.collection("subscriptions")
        .find({
          status: "ACTIVE",
          renewalDate: {
            $gte: targetDateStart,
            $lte: targetDateEnd
          }
        }).toArray();

      const alertType = `RENEWAL_${days}`;

      for (const sub of expiringSubs) {
        // Check if alert already exists for same type/sub
        const existingAlert = await db.collection("alerts").findOne({
          subscriptionId: sub._id,
          type: alertType
        });

        if (!existingAlert) {
          await db.collection("alerts").insertOne({
            type: alertType,
            message: `Subscription for ${sub.name} is renewing in ${days} days.`,
            companyId: sub.companyId,
            subscriptionId: sub._id,
            isResolved: false,
            createdAt: new Date(),
          });
          alertsCreated++;
        }
      }
    }

    // 2. Low Usage Checks
    const activeSubs = await db.collection("subscriptions")
      .find({ status: "ACTIVE" })
      .toArray();

    for (const sub of activeSubs) {
      const utilization = sub.activeUsers / sub.licenses;
      if (utilization < 0.3) {
        // Create LOW_USAGE alert if not created recently (using a simple weekly check logic)
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const lastLowUsageAlert = await db.collection("alerts").findOne({
          subscriptionId: sub._id,
          type: "LOW_USAGE",
          createdAt: { $gte: sevenDaysAgo }
        });

        if (!lastLowUsageAlert) {
          await db.collection("alerts").insertOne({
            type: "LOW_USAGE",
            message: `${sub.name} has low utilization (${Math.round(utilization * 100)}%). Consider downsizing or cancelling.`,
            companyId: sub.companyId,
            subscriptionId: sub._id,
            isResolved: false,
            createdAt: new Date(),
          });
          alertsCreated++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: activeSubs.length, 
      alertsCreated 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
