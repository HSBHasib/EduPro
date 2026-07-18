"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { api, LearningItem } from "@/lib/api";
import toast from "react-hot-toast";

const priorityVariant = {
  low: "success" as const,
  medium: "warning" as const,
  high: "danger" as const,
};

export default function ManageItemsPage() {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const res = await api.items.list({ limit: 100 });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.items.delete(id);
      setItems(items.filter((item) => item._id !== id));
      toast.success("Item deleted successfully");
    } catch (err) {
      toast.error("Failed to delete item");
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/items"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Manage Learning Materials</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No materials found.</p>
                <Link href="/items/add" className="mt-4 inline-block">
                  <Button>Add Your First Material</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-700">
                      <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Title</th>
                      <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Category</th>
                      <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Priority</th>
                      <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Views</th>
                      <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                      <th className="pb-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50">
                        <td className="py-4 pr-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                            {item.description}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="py-4 pr-4">
                          <Badge variant={priorityVariant[item.priority]}>{item.priority}</Badge>
                        </td>
                        <td className="py-4 pr-4 text-gray-500 dark:text-gray-400">
                          {item.viewCount}
                        </td>
                        <td className="py-4 pr-4 text-gray-500 dark:text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex justify-end gap-2">
                            <Link href={`/${item._id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item._id, item.title)}
                              className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}