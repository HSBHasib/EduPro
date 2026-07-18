import type { Metadata } from "next";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { ManageContent } from "./_components/ManageContent";

export const metadata: Metadata = {
  title: "Manage Dashboard | EduPro",
  description: "Track and organize your compiled learning assets.",
};

export default function ManageItemsPage() {
  return (
    <AuthGuard>
      <ManageContent />
    </AuthGuard>
  );
}