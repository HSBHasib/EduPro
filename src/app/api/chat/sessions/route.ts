import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ChatSession } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const sessions = await ChatSession.find()
      .select("sessionId title createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();
    return NextResponse.json({ success: true, data: sessions });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch sessions" }, { status: 500 });
  }
}
