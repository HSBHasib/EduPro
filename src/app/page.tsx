import type { Metadata } from "next";
import { BannerSlider } from "@/components/sections/BannerSlider";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

export const metadata: Metadata = {
  title: "EduPro - AI-Driven Personal Learning Platform",
  description: "Accelerate your learning velocity with custom AI-powered insights.",
};

export default function HomePage() {
  return (
    <>
      <BannerSlider />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CategoriesSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}