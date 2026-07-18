"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
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
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-300/20 to-warm-300/20">
            <SearchX className="h-12 w-12 text-brand-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="mb-4 text-8xl font-bold gradient-text">404</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="h-5 w-5" />
              Return to Home
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
        </motion.div>
      </div>
    </div>
  );
}