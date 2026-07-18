"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

function buildURL(base: string, params: Record<string, string>) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, val]) => {
    if (val) url.searchParams.set(key, val);
    else url.searchParams.delete(key);
  });
  return url.pathname + url.search;
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const priority = searchParams.get("priority") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const loadItems = useCallback(async (s: string, c: string, p: string, pg: number) => {
    setLoading(true);
    try {
      const res = await api.items.list({
        search: s || undefined,
        category: c || undefined,
        priority: p || undefined,
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
  }, [search, category, priority, page, loadItems]);

  function updateParams(updates: Record<string, string>) {
    const base = window.location.origin + "/items";
    const current: Record<string, string> = {};
    searchParams.forEach((val, key) => { current[key] = val; });
    const path = buildURL(base, { ...current, ...updates, page: updates.page || (updates.search !== undefined || updates.category !== undefined || updates.priority !== undefined ? "1" : current.page || "1") });
    router.push(path, { scroll: false });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ search: searchInput });
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      updateParams({ search: searchInput });
    }
  }

  function handleCategoryChange(val: string) {
    updateParams({ category: val });
  }

  function handlePriorityChange(val: string) {
    updateParams({ priority: val });
  }

  function handlePageChange(newPage: number) {
    updateParams({ page: String(newPage) });
  }

  function clearFilters() {
    router.push("/items", { scroll: false });
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
              {(category || priority || search) && (
                <button
                  onClick={clearFilters}
                  className="mt-6 text-sm text-brand-400 hover:text-brand-500"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {(search || category || priority) && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-300/10 px-3 py-1 text-brand-500">
                  Search: &ldquo;{search}&rdquo;
                  <button onClick={() => { setSearchInput(""); updateParams({ search: "" }); }} className="ml-1 hover:text-brand-600">&times;</button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  {category}
                  <button onClick={() => updateParams({ category: "" })} className="ml-1 hover:text-blue-700">&times;</button>
                </span>
              )}
              {priority && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                  {priority}
                  <button onClick={() => updateParams({ priority: "" })} className="ml-1 hover:text-amber-700">&times;</button>
                </span>
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
              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
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