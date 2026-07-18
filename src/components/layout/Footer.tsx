import Link from "next/link";
import { BookOpen } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Explore", href: "/items" },
    { label: "Add Material", href: "/items/add" },
    { label: "Manage", href: "/items/manage" },
  ],
  Features: [
    { label: "AI Chat Assistant", href: "/#features" },
    { label: "Document Intelligence", href: "/#features" },
    { label: "Smart Search", href: "/items" },
  ],
  Support: [
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
    { label: "Privacy Policy", href: "/#privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-dark-700 dark:bg-dark-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-300 to-warm-300">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Edu</span>
                <span>Pro</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Empowering your learning journey with AI-driven insights and curated study materials.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-brand-400 dark:text-gray-400 dark:hover:text-brand-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-dark-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} EduPro. All rights reserved. Built with AI-powered learning.
          </p>
        </div>
      </div>
    </footer>
  );
}