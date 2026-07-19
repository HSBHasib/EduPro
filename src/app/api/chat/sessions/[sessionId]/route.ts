import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ChatSession } from "@/lib/models";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    await connectDB();
    const { sessionId } = await params;
    const session = await ChatSession.findOne({ sessionId }).lean();
    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: session });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch session" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    await connectDB();
    const { sessionId } = await params;
    const session = await ChatSession.findOneAndDelete({ sessionId });
    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Session deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete session" }, { status: 500 });
  }
}
