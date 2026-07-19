import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI!;
let client: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client;
}

export async function verifySession(request: NextRequest): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";");
    let token: string | null = null;

    for (const pair of cookies) {
      const [name, rawValue] = pair.trim().split("=");
      if (name === "better-auth.session_token" || name === "__Secure-better-auth.session_token") {
        if (!rawValue) continue;
        token = decodeURIComponent(rawValue).split(".")[0];
        break;
      }
    }

    if (!token || token.length < 10) return null;

    const mongo = await getClient();
    const db = mongo.db("EduPro");
    const session = await db.collection("session").findOne({ token });

    if (!session) return null;
    if (new Date(session.expiresAt) < new Date()) {
      await db.collection("session").deleteOne({ token });
      return null;
    }

    return session.userId.toString();
  } catch {
    return null;
  }
}
