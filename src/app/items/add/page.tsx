import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AuthGuard } from "@/components/ui/AuthGuard";
import { AddItemForm } from "./_components/AddItemForm";

export const metadata: Metadata = {
  title: "Add New Study Material | EduPro",
  description: "Upload files or input text to let Gemini analyze your notes.",
};

export default function AddItemPage() {
  return (
    <AuthGuard>
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/items"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Add Learning Material</CardTitle>
            </CardHeader>
            <CardContent>
              <AddItemForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}