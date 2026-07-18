import type { Metadata } from "next";
import { Suspense } from "react";
import { UnauthorizedContent } from "./_components/UnauthorizedContent";

export const metadata: Metadata = {
  title: "Access Restricted | EduPro",
  description: "You need to sign in to access this page.",
};

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={null}>
      <UnauthorizedContent />
    </Suspense>
  );
}