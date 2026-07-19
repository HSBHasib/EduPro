import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ChatSession } from "@/lib/models";
import { streamChat, createChatHistory } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { sessionId, message, context } = await request.json();

    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = await ChatSession.create({
        sessionId,
        title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        messages: [],
        context,
      });
    }

    session.messages.push({ role: "user", content: message, timestamp: new Date() });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          const history = createChatHistory(
            session!.messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }))
          );
          const systemInstruction = context
            ? `You are EduPro AI, an educational assistant. Context: ${context}. Help students learn effectively.`
            : "You are EduPro AI, a helpful educational assistant. Provide clear, concise, and accurate information.";

          for await (const chunk of streamChat(message, history.slice(0, -1), systemInstruction)) {
            fullResponse += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
          }

          session!.messages.push({ role: "model", content: fullResponse, timestamp: new Date() });
          await session!.save();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, sessionId })}\n\n`));
          controller.close();
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: "Chat failed" }, { status: 500 });
  }
}
