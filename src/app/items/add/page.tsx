"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { addItemSchema, type AddItemInput } from "@/lib/validations";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

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

export default function AddItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddItemInput>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      priority: "medium",
      category: "Programming",
    },
  });

  async function onSubmit(data: AddItemInput) {
    setLoading(true);
    try {
      await api.items.create({
        ...data,
        priority: data.priority as "low" | "medium" | "high",
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      });
      toast.success("Material added successfully!");
      router.push("/items");
    } catch (err) {
      toast.error("Failed to add material. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/items"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Add Learning Material</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <input
                  {...register("title")}
                  placeholder="e.g., Introduction to React Hooks"
                  className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <select
                    {...register("category")}
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority *
                  </label>
                  <select
                    {...register("priority")}
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white"
                  >
                    {priorityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Brief description of this learning material..."
                  rows={3}
                  className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content / Notes *
                </label>
                <textarea
                  {...register("content")}
                  placeholder="Full content or study notes..."
                  rows={8}
                  className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
                />
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Author *
                  </label>
                  <input
                    {...register("author")}
                    placeholder="Your name"
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
                  />
                  {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags (comma-separated)
                  </label>
                  <input
                    {...register("tags")}
                    placeholder="react, hooks, javascript"
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Source URL (optional)
                </label>
                <input
                  {...register("sourceUrl")}
                  placeholder="https://..."
                  className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
                />
                {errors.sourceUrl && <p className="mt-1 text-xs text-red-500">{errors.sourceUrl.message}</p>}
              </div>

              <Button type="submit" size="lg" disabled={loading} className="w-full gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "Adding..." : "Add Material"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}