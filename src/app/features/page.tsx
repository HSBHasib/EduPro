"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DocumentIntelligence } from "@/components/features/DocumentIntelligence";
import { ChatAssistant } from "@/components/features/ChatAssistant";

export default function FeaturesPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            AI-Powered Features
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Leverage AI to enhance your learning experience.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <DocumentIntelligence />
          <ChatAssistant />
        </div>
      </div>
    </div>
  );
}