"use client";

import { BookOpen, Brain, MessageSquare, FileText, Search, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const features = [
  {
    icon: BookOpen,
    title: "Curated Learning Materials",
    description: "Access a growing library of carefully organized study resources across multiple categories.",
    color: "from-brand-300 to-brand-400",
  },
  {
    icon: Brain,
    title: "AI Document Intelligence",
    description: "Upload documents and get instant summaries, key topics, and actionable insights powered by Gemini AI.",
    color: "from-purple-400 to-purple-500",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Get instant answers to your questions with our context-aware AI assistant that remembers your conversation.",
    color: "from-blue-400 to-blue-500",
  },
  {
    icon: Search,
    title: "Smart Search & Filter",
    description: "Find exactly what you need with powerful search and category/priority filtering.",
    color: "from-warm-300 to-warm-400",
  },
  {
    icon: FileText,
    title: "Community Contributions",
    description: "Share your knowledge by adding study materials that help other learners succeed.",
    color: "from-green-400 to-green-500",
  },
  {
    icon: Shield,
    title: "Clean & Secure",
    description: "Built with modern security practices and a clean, distraction-free interface.",
    color: "from-red-400 to-red-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Powerful Features for{" "}
            <span className="gradient-text">Effective Learning</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Everything you need to organize, understand, and retain knowledge efficiently.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group">
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}