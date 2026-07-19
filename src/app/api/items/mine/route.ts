import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LearningItem } from "@/lib/models";
import { verifySession } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const userId = await verifySession(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      LearningItem.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      LearningItem.countDocuments({ userId }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch items" }, { status: 500 });
  }
}
