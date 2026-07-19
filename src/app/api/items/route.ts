import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LearningItem } from "@/lib/models";
import { verifySession } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const sort = searchParams.get("sort");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);

    const filter: Record<string, unknown> = {};
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case "oldest": sortOption = { createdAt: 1 }; break;
      case "most_viewed": sortOption = { viewCount: -1 }; break;
      case "title_asc": sortOption = { title: 1 }; break;
      case "title_desc": sortOption = { title: -1 }; break;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      LearningItem.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
      LearningItem.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await verifySession(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const item = await LearningItem.create({ ...body, userId });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
  }
}
