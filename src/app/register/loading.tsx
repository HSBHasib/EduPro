import { Skeleton } from "@/components/ui/Skeleton";

export default function RegisterLoading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-20 pb-14">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Skeleton className="mb-4 h-14 w-14 rounded-2xl" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-52" />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-dark-700 dark:bg-dark-800">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="my-4 h-px w-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
