"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const slides = [
  {
    icon: Sparkles,
    tag: "AI-Powered Learning",
    title: "Learn Smarter with AI-Driven Insights",
    description:
      "Empower your learning journey with intelligent document analysis, AI chat assistance, and a curated library of study materials.",
    cta: "Start Exploring",
    ctaHref: "/items",
    gradient: "from-brand-300/20 via-brand-400/10 to-transparent",
    accent: "from-brand-300 to-brand-400",
  },
  {
    icon: Brain,
    tag: "Document Intelligence",
    title: "Analyze Documents Instantly with AI",
    description:
      "Upload any document and get comprehensive summaries, key topics, and actionable items powered by Gemini AI in seconds.",
    cta: "Try Document AI",
    ctaHref: "/features",
    gradient: "from-purple-400/20 via-purple-500/10 to-transparent",
    accent: "from-purple-400 to-purple-500",
  },
  {
    icon: BookOpen,
    tag: "Curated Resources",
    title: "Explore a World of Knowledge",
    description:
      "Browse hundreds of organized learning materials across programming, science, design, and business categories.",
    cta: "Browse Materials",
    ctaHref: "/items",
    gradient: "from-warm-300/20 via-warm-400/10 to-transparent",
    accent: "from-warm-300 to-warm-400",
  },
];

export function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];
  const Icon = slide.icon;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section className="relative overflow-hidden py-30">
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${slide.gradient} transition-all duration-700`}
      />
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-300/10 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl text-center">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/25 px-4 py-1.5 text-sm font-medium backdrop-blur-sm dark:border-white/10">
                <Icon className="h-4 w-4 text-brand-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {slide.tag}
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                {slide.title.split(" ").map((word, i) => (
                  <span key={i}>
                    {i >= slide.title.split(" ").length - 2 ? (
                      <span className="gradient-text">{word} </span>
                    ) : (
                      <>{word} </>
                    )}
                  </span>
                ))}
              </h1>

              <p className="mb-10 text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
                {slide.description}
              </p>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href={slide.ctaHref}>
                  <Button size="lg" className="gap-2">
                    {slide.cta}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg">
                    AI Features
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4"></div>

          {/* Dots */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-gradient-to-r from-brand-300 to-brand-400"
                    : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-dark-600 dark:hover:bg-dark-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
