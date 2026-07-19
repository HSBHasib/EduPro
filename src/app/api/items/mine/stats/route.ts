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
    const [totalItems, totalViews, categories, monthlyItems, priorityBreakdown, recentItems] =
      await Promise.all([
        LearningItem.countDocuments({ userId }),
        LearningItem.aggregate([
          { $match: { userId } },
          { $group: { _id: null, total: { $sum: "$viewCount" } } },
        ]),
        LearningItem.aggregate([
          { $match: { userId } },
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        LearningItem.aggregate([
          { $match: { userId } },
          {
            $group: {
              _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          { $limit: 12 },
        ]),
        LearningItem.aggregate([
          { $match: { userId } },
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),
        LearningItem.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyData = monthlyItems.map((item: { _id: { year: number; month: number }; count: number }) => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      items: item.count,
    }));
    const priorityData = priorityBreakdown.map((item: { _id: string; count: number }) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }));

    return NextResponse.json({
      success: true,
      data: { totalItems, totalViews: totalViews[0]?.total || 0, categories, monthlyData, priorityData, recentItems },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
