import type { Metadata } from "next";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { AnalyticsContent } from "./_components/AnalyticsContent";

export const metadata: Metadata = {
  title: "Analytics | EduPro",
  description: "View your learning analytics and statistics.",
};

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <AnalyticsContent />
    </AuthGuard>
  );
}
