import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthRedirect } from "@/components/ui/AuthRedirect";
import { RegisterContent } from "./_components/RegisterContent";

export const metadata: Metadata = {
  title: "Create Account | EduPro",
  description: "Join EduPro and start your AI-powered learning journey today.",
};

export default function RegisterPage() {
  return (
    <AuthRedirect>
      <Suspense fallback={null}>
        <RegisterContent />
      </Suspense>
    </AuthRedirect>
  );
}