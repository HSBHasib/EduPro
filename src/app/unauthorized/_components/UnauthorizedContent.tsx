"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-red-400/20 to-red-500/10">
            <Lock className="h-12 w-12 text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Access Restricted
          </h1>
          <p className="mb-8 text-gray-500 dark:text-gray-400">
            You need to sign in to access this page. Please authenticate to continue.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
            <Button size="lg" className="gap-2">
              Sign In
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <Home className="h-5 w-5" />
              Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}