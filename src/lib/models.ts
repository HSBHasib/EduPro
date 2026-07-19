import mongoose, { Schema, Document } from "mongoose";

// ── LearningItem ──
export interface ILearningItem extends Document {
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  content: string;
  author: string;
  tags: string[];
  thumbnailUrl?: string;
  sourceUrl?: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const learningItemSchema = new Schema<ILearningItem>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    content: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    thumbnailUrl: { type: String, default: "" },
    sourceUrl: { type: String, default: "" },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

learningItemSchema.index({ title: "text", description: "text", tags: "text" });
learningItemSchema.index({ category: 1, priority: 1 });
learningItemSchema.index({ createdAt: -1 });

export const LearningItem =
  mongoose.models.LearningItem || mongoose.model<ILearningItem>("LearningItem", learningItemSchema);

// ── ChatSession ──
export interface IChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  sessionId: string;
  title: string;
  messages: IChatMessage[];
  context?: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  role: { type: String, enum: ["user", "model"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    title: { type: String, default: "New Chat" },
    messages: [chatMessageSchema],
    context: { type: String, default: "" },
  },
  { timestamps: true }
);

chatSessionSchema.index({ sessionId: 1 });
chatSessionSchema.index({ updatedAt: -1 });

export const ChatSession =
  mongoose.models.ChatSession || mongoose.model<IChatSession>("ChatSession", chatSessionSchema);

// ── DocumentSummary ──
export interface IDocumentSummary extends Document {
  originalName: string;
  originalContent: string;
  summary: string;
  actionItems: string[];
  keyTopics: string[];
  wordCount: number;
  createdAt: Date;
}

const documentSummarySchema = new Schema<IDocumentSummary>(
  {
    originalName: { type: String, required: true },
    originalContent: { type: String, required: true },
    summary: { type: String, required: true },
    actionItems: [{ type: String }],
    keyTopics: [{ type: String }],
    wordCount: { type: Number, required: true },
  },
  { timestamps: true }
);

documentSummarySchema.index({ createdAt: -1 });

export const DocumentSummary =
  mongoose.models.DocumentSummary ||
  mongoose.model<IDocumentSummary>("DocumentSummary", documentSummarySchema);
