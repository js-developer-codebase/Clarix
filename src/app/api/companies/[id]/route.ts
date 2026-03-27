import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { isActive } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    await db.collection("companies").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { isActive, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Cascading delete simplified for demo: just delete company
    await db.collection("companies").deleteOne({ _id: new ObjectId(params.id) });
    // Should also delete associated users and subscriptions in a real app
    await db.collection("users").deleteMany({ companyId: new ObjectId(params.id) });
    await db.collection("subscriptions").deleteMany({ companyId: new ObjectId(params.id) });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
