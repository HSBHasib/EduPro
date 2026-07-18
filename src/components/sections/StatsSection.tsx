"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Eye, TrendingUp } from "lucide-react";
import { api, Stats } from "@/lib/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.items.stats().then((res) => setStats(res.data));
  }, []);

  const statItems = [
    {
      icon: BookOpen,
      label: "Learning Materials",
      value: stats?.totalItems || 0,
      color: "text-brand-400",
    },
    {
      icon: Eye,
      label: "Total Views",
      value: stats?.totalViews || 0,
      color: "text-purple-400",
    },
    {
      icon: TrendingUp,
      label: "Categories",
      value: stats?.categories?.length || 0,
      color: "text-warm-400",
    },
    {
      icon: Users,
      label: "Active Learners",
      value: "100+",
      color: "text-green-400",
    },
  ];

  return (
    <section className="border-y border-gray-200 bg-gray-50 py-12 dark:border-dark-700 dark:bg-dark-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {statItems.map((item) => (
            <motion.div key={item.label} variants={itemVariants} className="text-center">
              <div className="mb-3 flex justify-center">
                <div className={`rounded-xl bg-gray-100 p-3 dark:bg-dark-800 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}