"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, Image, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { addItemSchema, type AddItemInput } from "@/lib/validations";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const IMGBB_API_KEY = "6fe9beb1db1baee2381d2eac85688bce";

const categoryOptions = [
  { value: "Programming", label: "Programming" },
  { value: "Technology", label: "Technology" },
  { value: "Science", label: "Science" },
  { value: "Design", label: "Design" },
  { value: "Business", label: "Business" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

async function uploadToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.data.url;
}

export function AddItemForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddItemInput>({
    resolver: zodResolver(addItemSchema),
    defaultValues: { priority: "medium", category: "Programming" },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setPreview(URL.createObjectURL(file));
    setUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setImageUrl(url);
      toast.success("Image uploaded!");
    } catch { toast.error("Failed to upload image"); setPreview(null); }
    finally { setUploadingImage(false); }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage() { setPreview(null); setImageUrl(""); }

  async function onSubmit(data: AddItemInput) {
    setLoading(true);
    try {
      await api.items.create({
        ...data,
        priority: data.priority as "low" | "medium" | "high",
        thumbnailUrl: imageUrl,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      toast.success("Material added successfully!");
      reset();
      setPreview(null);
      setImageUrl("");
      router.push("/items");
    } catch { toast.error("Failed to add material. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail Image</label>
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="h-48 w-full rounded-xl object-cover" />
            <button type="button" onClick={removeImage} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70">
              <X className="h-4 w-4" />
            </button>
            {uploadingImage && <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition-colors hover:border-brand-300 hover:bg-brand-300/5 dark:border-dark-600 dark:bg-dark-800 dark:hover:border-brand-400">
            <Image className="h-10 w-10 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload an image</span>
            <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
          </label>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
        <input {...register("title")} placeholder="e.g., Introduction to React Hooks" className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
          <select {...register("category")} className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white">
            {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Priority *</label>
          <select {...register("priority")} className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white">
            {priorityOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
        <textarea {...register("description")} placeholder="Brief description of this learning material..." rows={3} className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500" />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Content / Notes *</label>
        <textarea {...register("content")} placeholder="Full content or study notes..." rows={8} className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500" />
        {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Author *</label>
          <input {...register("author")} placeholder="Your name" className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500" />
          {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
          <input {...register("tags")} placeholder="react, hooks, javascript" className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Source URL (optional)</label>
        <input {...register("sourceUrl")} placeholder="https://..." className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500" />
        {errors.sourceUrl && <p className="mt-1 text-xs text-red-500">{errors.sourceUrl.message}</p>}
      </div>
      <Button type="submit" size="lg" disabled={loading || uploadingImage} className="w-full gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? "Adding..." : "Add Material"}
      </Button>
    </form>
  );
}