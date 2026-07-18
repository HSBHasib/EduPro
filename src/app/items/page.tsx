"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ItemCard } from "@/components/ui/ItemCard";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { api, LearningItem } from "@/lib/api";

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "Programming", label: "Programming" },
  { value: "Technology", label: "Technology" },
  { value: "Science", label: "Science" },
  { value: "Design", label: "Design" },
  { value: "Business", label: "Business" },
];

const priorityOptions = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [items, setItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const loadItems = useCallback(async (searchVal: string, cat: string, pri: string, pg: number) => {
    setLoading(true);
    try {
      const res = await api.items.list({
        search: searchVal || undefined,
        category: cat || undefined,
        priority: pri || undefined,
        page: pg,
        limit: 12,
      });
      setItems(res.data);
      setTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems(search, category, priority, page);
  }, [page, category, priority, loadItems, search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadItems(search, category, priority, 1);
  }

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearch(val);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      setPage(1);
      loadItems(search, category, priority, 1);
    }
  }

  function handleCategoryChange(val: string) {
    setCategory(val);
    setPage(1);
  }

  function handlePriorityChange(val: string) {
    setPriority(val);
    setPage(1);
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Explore Learning Materials
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover curated resources to accelerate your learning.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search materials..."
                  value={search}
                  onChange={handleSearchInput}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-10"
                />
              </div>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-dark-600 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-800">
              <div className="w-48">
                <Select
                  label="Category"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  options={categoryOptions}
                />
              </div>
              <div className="w-48">
                <Select
                  label="Priority"
                  value={priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  options={priorityOptions}
                />
              </div>
              {(category || priority) && (
                <button
                  onClick={() => { setCategory(""); setPriority(""); setPage(1); }}
                  className="mt-6 text-sm text-brand-400 hover:text-brand-500"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No materials found. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="pt-24 pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="mt-2 h-4 w-96" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}