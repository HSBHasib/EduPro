import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { google } from "better-auth/social-providers";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://EduPro:CEaplltxGkzsKr8C@cluster0.bwbvnds.mongodb.net/EduPro?appName=Cluster0";

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db("EduPro");

const authInstance = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || "edupro-super-secret-key-change-in-production",
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
});

export async function GET(request: Request) {
  return authInstance.handler(request);
}

export async function POST(request: Request) {
  return authInstance.handler(request);
}