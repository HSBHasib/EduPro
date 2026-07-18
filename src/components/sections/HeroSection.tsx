"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-300/5 via-transparent to-transparent" />
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-300/10 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-300/30 bg-brand-300/10 px-4 py-1.5 text-sm font-medium text-brand-500">
            <Sparkles className="h-4 w-4" />
            AI-Powered Learning
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Learn Smarter with{" "}
            <span className="gradient-text">AI-Driven</span>{" "}
            Insights
          </h1>

          <p className="mb-10 text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
            Empower your learning journey with intelligent document analysis,
            AI chat assistance, and a curated library of study materials.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/items">
              <Button size="lg" className="gap-2">
                Start Exploring
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/items/add">
              <Button variant="outline" size="lg">
                Add Materials
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" size="lg" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}