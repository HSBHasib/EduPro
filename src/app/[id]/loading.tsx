import { Skeleton } from "@/components/ui/Skeleton";

export default function ItemDetailLoading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-4 w-32" />
        <Skeleton className="mb-4 h-8 w-2/3" />
        <Skeleton className="mb-8 h-4 w-full" />
        <Skeleton className="mb-6 h-10 w-32" />
        <Skeleton className="mb-6 h-64 w-full rounded-2xl" />
        <Skeleton className="mb-4 h-6 w-48" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-3/4" />
        <Skeleton className="mb-8 h-4 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
