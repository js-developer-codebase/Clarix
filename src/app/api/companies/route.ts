import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { companySchema } from "@/lib/validations/company";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { adminEmail, adminPassword, ...companyData } = body;
    const validatedCompany = companySchema.parse(companyData);

    const client = await clientPromise;
    const db = client.db();

    // slug check
    const existing = await db.collection("companies").findOne({ slug: validatedCompany.slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const companyResult = await db.collection("companies").insertOne({
      ...validatedCompany,
      isActive: true,
      maxUsers: validatedCompany.plan === 'ENTERPRISE' ? 1000 : validatedCompany.plan === 'GROWTH' ? 100 : 20,
      maxSubs: validatedCompany.plan === 'ENTERPRISE' ? 500 : validatedCompany.plan === 'GROWTH' ? 50 : 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const companyId = companyResult.insertedId;

    // Create the initial admin user
    if (adminEmail && adminPassword) {
      const hashedPassword = await hash(adminPassword, 10);
      await db.collection("users").insertOne({
        name: `${validatedCompany.name} Admin`,
        email: adminEmail,
        password: hashedPassword,
        role: "COMPANY_ADMIN",
        companyId: companyId,
        isActive: true,
        department: "MANAGEMENT",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, id: companyId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const companies = await db.collection("companies").find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(companies);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
