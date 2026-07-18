"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function CategoriesSection() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    api.items.categories().then((res) => setCategories(res.data));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Discover materials organized by topic and find exactly what you need.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((category) => {
            const Icon = iconMap[category] || iconMap.default;
            const color = colorMap[category] || colorMap.default;

            return (
              <motion.div key={category} variants={itemVariants}>
                <Link href={`/items?category=${encodeURIComponent(category)}`}>
                  <Card className="group h-full cursor-pointer text-center">
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}