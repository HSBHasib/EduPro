"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Clock, Tag, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ItemCard } from "@/components/ui/ItemCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { api, LearningItem } from "@/lib/api";
import NotFound from "@/app/not-found";

const priorityVariant = {
  low: "success" as const,
  medium: "warning" as const,
  high: "danger" as const,
};

export function ItemDetailContent({ id }: { id: string }) {
  const [item, setItem] = useState<LearningItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    try {
      const res = await api.items.get(id);
      setItem(res.data.item);
      setRelatedItems(res.data.relatedItems);
    } catch {
      setItem(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="mb-6 h-4 w-32" />
          <Skeleton className="mb-4 h-8 w-2/3" />
          <Skeleton className="mb-8 h-4 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <NotFound />
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/items"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        <article>
          {item.thumbnailUrl && (
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="mb-6 h-64 w-full rounded-2xl object-cover"
            />
          )}

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant={priorityVariant[item.priority]}>{item.priority}</Badge>
            <Badge variant="outline">{item.category}</Badge>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {item.title}
          </h1>

          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">{item.description}</p>

          <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{item.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{item.viewCount} views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {item.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-dark-700 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Card>
            <CardContent className="p-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {item.content.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-500"
            >
              View Source &rarr;
            </a>
          )}
        </article>

        {relatedItems.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Related Materials
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedItems.map((related) => (
                <ItemCard key={related._id} item={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}