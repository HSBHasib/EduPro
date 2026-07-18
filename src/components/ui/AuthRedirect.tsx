"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth";

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (!isPending && session) {
      router.replace(callbackUrl);
    }
  }, [session, isPending, router, callbackUrl]);

  if (isPending || session) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-300 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}