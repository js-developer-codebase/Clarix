import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { userSchema } from "@/lib/validations/user";
import { hash } from "bcryptjs";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "COMPANY_ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = userSchema.parse(body);

    const client = await clientPromise;
    const db = client.db();

    const existing = await db.collection("users").findOne({ email: validatedData.email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await hash("Clarix@1234", 10); // Default password

    const result = await db.collection("users").insertOne({
      ...validatedData,
      password: hashedPassword,
      companyId: new ObjectId(session.user.companyId), // Consistent ObjectId
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "COMPANY_ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection("users")
      .find({ companyId: new ObjectId(session.user.companyId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
