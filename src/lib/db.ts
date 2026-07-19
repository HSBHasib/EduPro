import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = global as typeof globalThis & { mongoose: typeof mongoose | null };

if (!cached.mongoose) {
  cached.mongoose = null;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.mongoose) return cached.mongoose;

  const conn = await mongoose.connect(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  cached.mongoose = conn;
  return conn;
}
