import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { hash } from "bcryptjs";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const body = await req.json();
    const { password, isActive } = body;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const client = await clientPromise;
    const db = client.db();

    const targetUser = await db.collection("users").findOne({ _id: new ObjectId(params.id) });
    if (!targetUser) return new Response("User not found", { status: 404 });

    // Hierarchy check: 
    // Super admins can change anyone.
    // Company admins can change their own company users.
    const isSuperAdmin = session.user.role === "SUPER_ADMIN";
    const isOwner = session.user.role === "COMPANY_ADMIN" && targetUser.companyId?.toString() === session.user.companyId;

    if (!isSuperAdmin && !isOwner) {
      return new Response("Forbidden", { status: 403 });
    }

    const updateDoc: any = { updatedAt: new Date() };
    if (password) {
      updateDoc.password = await hash(password, 10);
    }
    if (isActive !== undefined) {
      updateDoc.isActive = isActive;
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateDoc }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
