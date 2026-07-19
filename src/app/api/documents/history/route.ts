import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DocumentSummary } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const documents = await DocumentSummary.find()
      .select("originalName summary wordCount createdAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return NextResponse.json({ success: true, data: documents });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch history" }, { status: 500 });
  }
}
