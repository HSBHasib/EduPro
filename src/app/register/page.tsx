import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterContent } from "./_components/RegisterContent";

export const metadata: Metadata = {
  title: "Create Account | EduPro",
  description: "Join EduPro and start your AI-powered learning journey today.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}