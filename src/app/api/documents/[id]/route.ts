import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DocumentSummary } from "@/lib/models";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const doc = await DocumentSummary.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: doc });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch document" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const doc = await DocumentSummary.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete document" }, { status: 500 });
  }
}
