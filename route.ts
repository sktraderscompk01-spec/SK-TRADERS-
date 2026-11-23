import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export async function POST(request: NextRequest) {
  try {
    await ensureSeeded();
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const [saved] = await db
      .insert(contactMessages)
      .values({
        name: String(body.name).trim(),
        email: String(body.email).trim(),
        phone: String(body.phone || "").trim(),
        subject: String(body.subject || "Concierge Inquiry").trim(),
        message: String(body.message).trim(),
      })
      .returning();

    return NextResponse.json({ message: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact message" },
      { status: 500 }
    );
  }
}
