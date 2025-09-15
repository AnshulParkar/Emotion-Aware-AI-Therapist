
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(4).max(10),
      role: z.enum(["patient", "therapist"]),
    });
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 });
    }
    const { email, password, role } = result.data;
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || "ai_therapist");
    const existing = await db.collection("users").findOne({ email, role });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }
    const hashed = await hash(password, 10);
    const user = {
      email,
      password: hashed,
      role, // "patient" or "therapist"
      createdAt: new Date(),
    };
    await db.collection("users").insertOne(user);
    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
