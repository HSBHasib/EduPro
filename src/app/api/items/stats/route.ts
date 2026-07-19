import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LearningItem } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const [totalItems, totalViews, categories, recentItems] = await Promise.all([
      LearningItem.countDocuments(),
      LearningItem.aggregate([{ $group: { _id: null, total: { $sum: "$viewCount" } } }]),
      LearningItem.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      LearningItem.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalItems,
        totalViews: totalViews[0]?.total || 0,
        categories,
        recentItems,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
