"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteLoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPending) {
      setVisible(true);
      setProgress(0);

      const step = () => {
        setProgress((prev) => {
          if (prev < 70) return prev + 10;
          if (prev < 90) return prev + 3;
          return prev;
        });
      };

      const interval = setInterval(step, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [isPending]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 top-0 z-[100] h-0.5 w-full">
      <div
        className="h-full bg-gradient-to-r from-brand-300 to-warm-300 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
