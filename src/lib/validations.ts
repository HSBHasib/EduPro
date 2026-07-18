import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const addItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be under 2000 characters"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high"]),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  tags: z.string().optional(),
  sourceUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const documentAnalysisSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  content: z.string().min(10, "Document must be at least 10 characters"),
});

export const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(5000, "Message too long"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddItemInput = z.infer<typeof addItemSchema>;
export type DocumentAnalysisInput = z.infer<typeof documentAnalysisSchema>;
export type ChatInput = z.infer<typeof chatSchema>;