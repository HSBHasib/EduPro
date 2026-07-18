"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is EduPro?",
    answer:
      "EduPro is an AI-driven personal learning platform that helps you organize study materials, get AI-powered document analysis, and chat with an intelligent assistant for learning support.",
  },
  {
    question: "How does the AI Document Intelligence work?",
    answer:
      "Simply upload or paste your document content, and our Gemini AI engine will analyze it to provide a comprehensive summary, key topics, and actionable items automatically.",
  },
  {
    question: "Is the AI Chat Assistant free to use?",
    answer:
      "Yes! The AI Chat Assistant is available to all users. It maintains conversation context and can help answer questions about any learning topic.",
  },
  {
    question: "Can I add my own study materials?",
    answer:
      "Absolutely! Navigate to the 'Add Item' page to contribute your own learning materials. You can categorize them by priority and topic.",
  },
  {
    question: "How do I search for specific topics?",
    answer:
      "Use the Explore page to search by keywords, filter by category, or sort by priority. Our search system makes it easy to find exactly what you need.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-gray-200 bg-gray-50 py-14 dark:border-dark-700 dark:bg-dark-900/50 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Got questions? We have answers.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-dark-700 dark:bg-dark-800"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <p className="px-6 pb-6 text-sm text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}