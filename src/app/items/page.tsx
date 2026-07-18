import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { ExploreContent } from "./_components/ExploreContent";

export const metadata: Metadata = {
  title: "Explore Courses & Modules | EduPro",
  description: "Search and filter through premium learning resources tailored for you.",
};

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