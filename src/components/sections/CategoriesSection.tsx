"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Code, Cpu, BookMarked, Palette, Briefcase, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { api } from "@/lib/api";

const iconMap: Record<string, React.ElementType> = {
  Programming: Code,
  Technology: Cpu,
  Science: BookMarked,
  Design: Palette,
  Business: Briefcase,
  default: GraduationCap,
};

const colorMap: Record<string, string> = {
  Programming: "from-blue-400 to-blue-500",
  Technology: "from-purple-400 to-purple-500",
  Science: "from-green-400 to-green-500",
  Design: "from-pink-400 to-pink-500",
  Business: "from-warm-300 to-warm-400",
  default: "from-brand-300 to-brand-400",
};

export function CategoriesSection() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    api.items.categories().then((res) => setCategories(res.data));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Discover materials organized by topic and find exactly what you need.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = iconMap[category] || iconMap.default;
            const color = colorMap[category] || colorMap.default;

            return (
              <Link key={category} href={`/items?category=${encodeURIComponent(category)}`}>
                <Card className="group cursor-pointer text-center">
                  <CardContent className="p-6">
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}