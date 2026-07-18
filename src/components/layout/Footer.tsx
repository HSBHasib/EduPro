import Link from "next/link";
import { BookOpen, Github, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Explore", href: "/items" },
    { label: "Add Material", href: "/items/add" },
    { label: "Manage", href: "/items/manage" },
    { label: "Analytics", href: "/analytics" },
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

const socialLinks = [
  { label: "GitHub", href: "https://github.com/HSBHasib", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hasibur-rahman19", icon: Linkedin },
  { label: "Email", href: "mailto:hasibhsb19@gmail.com", icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-dark-700 dark:bg-dark-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-16">
          <div className="max-w-xs">
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
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-brand-400 hover:text-brand-400 dark:border-dark-600 dark:text-gray-400 dark:hover:border-brand-400 dark:hover:text-brand-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-10 md:gap-14">
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
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-dark-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} EduPro. All rights reserved. Built by{" "}
            <a
              href="https://hasib-portfolio-silk.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-400 hover:text-brand-500"
            >
              Hasibur Rahman
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
