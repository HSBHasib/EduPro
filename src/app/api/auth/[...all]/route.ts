import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb+srv://EduPro:CEaplltxGkzsKr8C@cluster0.bwbvnds.mongodb.net/EduPro?appName=Cluster0"
);

const db = client.db();

export const auth = betterAuth({
  database: {
    type: "mongodb",
    db,
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    "http://localhost:3000",
  ],
});

export async function GET(request: Request) {
  return auth.handler(request);
}

export async function POST(request: Request) {
  return auth.handler(request);
}