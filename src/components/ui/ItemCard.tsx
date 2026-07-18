"use client";

import { useRouter } from "next/navigation";
import { Eye, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth";
import type { LearningItem } from "@/lib/api";

interface ItemCardProps {
  item: LearningItem;
}

const priorityVariant = {
  low: "success" as const,
  medium: "warning" as const,
  high: "danger" as const,
};

export function ItemCard({ item }: ItemCardProps) {
  const router = useRouter();
  const { data: session } = useSession();

  function handleClick() {
    if (!session) {
      router.push(`/unauthorized?callbackUrl=${encodeURIComponent(`/${item._id}`)}`);
    } else {
      router.push(`/${item._id}`);
    }
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="group h-full">
        <div className="relative overflow-hidden rounded-t-2xl">
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                "h-40 bg-gradient-to-br transition-all duration-300 group-hover:scale-105",
                item.priority === "high"
                  ? "from-red-400/20 to-red-500/10"
                  : item.priority === "medium"
                  ? "from-warm-300/30 to-warm-400/10"
                  : "from-green-400/20 to-green-500/10"
              )}
            >
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl font-bold text-gray-200/50 dark:text-dark-600">
                  {item.title.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="absolute right-3 top-3">
            <Badge variant={priorityVariant[item.priority]}>{item.priority}</Badge>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-brand-400" />
            <span className="text-xs font-medium text-brand-500">{item.category}</span>
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-brand-500 dark:text-white">
            {item.title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {item.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{item.viewCount} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}