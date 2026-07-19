import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LearningItem } from "@/lib/models";
import { verifySession } from "@/lib/auth-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const item = await LearningItem.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true });
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }
    const relatedItems = await LearningItem.find({
      _id: { $ne: item._id },
      category: item.category,
    }).limit(4).lean();

    return NextResponse.json({ success: true, data: { item, relatedItems } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifySession(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const item = await LearningItem.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifySession(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const item = await LearningItem.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }
}
