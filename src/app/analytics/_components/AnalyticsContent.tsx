"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Eye, BarChart3, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { api, MyStats } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#FF9A86", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

const priorityVariant = {
  low: "success" as const,
  medium: "warning" as const,
  high: "danger" as const,
};

export function AnalyticsContent() {
  const [stats, setStats] = useState<MyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await api.items.mineStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="mb-6 h-6 w-32" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/items"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          My Analytics
        </h1>

        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalItems || 0}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/20">
                  <BookOpen className="h-6 w-6 text-brand-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalViews || 0}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/20">
                  <Eye className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.categories?.length || 0}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm-100 dark:bg-warm-900/20">
                  <BarChart3 className="h-6 w-6 text-warm-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg Views/Item</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalItems
                      ? Math.round((stats.totalViews / stats.totalItems) * 10) / 10
                      : 0}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/20">
                  <PieChart className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Monthly Items Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items Created Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.monthlyData && stats.monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="items" fill="#FF9A86" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-gray-400">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Priority Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.priorityData && stats.priorityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={stats.priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.priorityData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-gray-400">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        {stats?.categories && stats.categories.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.categories.map((cat) => (
                  <div key={cat._id} className="flex items-center gap-3">
                    <Badge variant="outline">{cat._id}</Badge>
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-700">
                        <div
                          className="h-full rounded-full bg-brand-400"
                          style={{
                            width: `${(cat.count / (stats.totalItems || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Items */}
        {stats?.recentItems && stats.recentItems.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Recent Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentItems.map((item) => (
                  <Link
                    key={item._id}
                    href={`/${item._id}`}
                    className="flex items-center justify-between rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-dark-700 dark:hover:bg-dark-800/50"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.category} &middot;{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={priorityVariant[item.priority]}>
                        {item.priority}
                      </Badge>
                      <span className="text-xs text-gray-400">{item.viewCount} views</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
