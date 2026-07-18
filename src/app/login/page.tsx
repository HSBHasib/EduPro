import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthRedirect } from "@/components/ui/AuthRedirect";
import { LoginContent } from "./_components/LoginContent";

export const metadata: Metadata = {
  title: "Sign In | EduPro",
  description: "Sign in to your EduPro account and continue your learning journey.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthRedirect>
        <LoginContent />
      </AuthRedirect>
    </Suspense>
  );
}