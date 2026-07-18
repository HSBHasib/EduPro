import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EduPro - AI-Driven Personal Learning Platform",
  description:
    "Empower your learning journey with AI-powered insights, curated study materials, and intelligent document analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <HeroUIProvider>
          <ToastProvider />
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </HeroUIProvider>
      </body>
    </html>
  );
}