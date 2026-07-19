import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DocumentSummary } from "@/lib/models";
import { generateDocumentSummary } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { content, fileName } = await request.json();

    if (!content || content.length < 10) {
      return NextResponse.json(
        { success: false, error: "Document content is too short to analyze" },
        { status: 400 }
      );
    }

    const result = await generateDocumentSummary(content);
    const docSummary = await DocumentSummary.create({
      originalName: fileName,
      originalContent: content,
      summary: result.summary,
      actionItems: result.actionItems,
      keyTopics: result.keyTopics,
      wordCount: content.split(/\s+/).length,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: docSummary._id,
        summary: result.summary,
        actionItems: result.actionItems,
        keyTopics: result.keyTopics,
        wordCount: docSummary.wordCount,
        createdAt: docSummary.createdAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to analyze document";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
