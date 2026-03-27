import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { subscriptionSchema } from "@/lib/validations/subscription";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || !session.user.companyId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = subscriptionSchema.parse(body);

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("subscriptions").insertOne({
      ...validatedData,
      companyId: new ObjectId(session.user.companyId),
      ownerId: new ObjectId(session.user.id), // Default to creator
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      renewalDate: new Date(validatedData.renewalDate),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
