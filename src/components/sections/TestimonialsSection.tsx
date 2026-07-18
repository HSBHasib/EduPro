"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    content:
      "EduPro has completely transformed how I study. The AI document analysis saves me hours of summarizing notes.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Data Science Learner",
    content:
      "The chat assistant is incredibly helpful for understanding complex topics. It's like having a tutor available 24/7.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Design Student",
    content:
      "I love how organized everything is. Finding relevant study materials is so easy with the category filtering.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function TestimonialsSection() {
  return (
    <section className="pb-14 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Loved by <span className="gradient-text">Learners</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            See what students and professionals are saying about EduPro.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-warm-300 text-warm-300"
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-warm-300 text-sm font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}