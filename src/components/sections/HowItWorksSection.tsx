"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload or Add Materials",
    description:
      "Add your study materials by typing content, uploading PDF files, or pasting text. Organize them with categories and priorities.",
    color: "from-blue-400 to-blue-500",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analyzes Everything",
    description:
      "Our Gemini AI engine automatically generates summaries, extracts key topics, identifies action items, and creates structured insights.",
    color: "from-purple-400 to-purple-500",
  },
  {
    icon: BookOpen,
    step: "03",
    title: "Learn & Retain",
    description:
      "Use the AI chat assistant to ask questions, download formatted PDF summaries, and track your learning progress across categories.",
    color: "from-brand-300 to-brand-400",
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-t border-gray-200 bg-gray-50 py-14 dark:border-dark-700 dark:bg-dark-900/50 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Three simple steps to transform how you study and retain knowledge.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+40px)] top-10 hidden w-[calc(100%-80px)] md:block">
                  <ArrowRight className="h-6 w-6 text-gray-300 dark:text-dark-600" />
                </div>
              )}

              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-md dark:border-dark-700 dark:bg-dark-800">
                <div className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-dark-400">
                  Step {step.step}
                </div>
                <div
                  className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                >
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link href="/items/add">
            <Button size="lg" className="gap-2">
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}