"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
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
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Programming",
    priority: "medium",
    content: "",
    author: "",
    tags: "",
    sourceUrl: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.items.create({
        ...form,
        priority: form.priority as "low" | "medium" | "high",
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Title"
                placeholder="e.g., Introduction to React Hooks"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  options={categoryOptions}
                />
                <Select
                  label="Priority"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  options={priorityOptions}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of this learning material..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content / Notes
                </label>
                <textarea
                  placeholder="Full content or study notes..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Author"
                  placeholder="Your name"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                />
                <Input
                  label="Tags (comma-separated)"
                  placeholder="react, hooks, javascript"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              <Input
                label="Source URL (optional)"
                placeholder="https://..."
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              />

              <Button type="submit" size="lg" disabled={loading} className="w-full gap-2">
                <Send className="h-4 w-4" />
                {loading ? "Adding..." : "Add Material"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}