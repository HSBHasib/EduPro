"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth";
import { Skeleton } from "@/components/ui/Skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPending) return;

    redirectTimer.current = setTimeout(() => {
      if (!session) {
        router.push(`/unauthorized?callbackUrl=${encodeURIComponent(pathname)}`);
      } else {
        setChecked(true);
      }
    }, 300);

    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, [session, isPending, router, pathname]);

  if (isPending || !checked) {
    return (
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="mb-6 h-4 w-32" />
          <Skeleton className="mb-8 h-10 w-full" />
          <Skeleton className="mb-4 h-40 w-full" />
          <Skeleton className="mb-4 h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}