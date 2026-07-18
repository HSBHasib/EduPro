"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Menu, X, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Explore" },
  { href: "/features", label: "AI Features" },
];

const protectedLinks = [
  { href: "/items/add", label: "Add Item" },
  { href: "/items/manage", label: "Manage" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  const navLinks = session ? [...publicLinks, ...protectedLinks] : publicLinks;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-dark-700/50 dark:bg-dark-900/80"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-300 to-warm-300"
          >
            <BookOpen className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold">
            <span className="gradient-text">Edu</span>
            <span className="text-gray-900 dark:text-white">Pro</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-brand-300/10 text-brand-500"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-dark-700 dark:hover:text-white"
                )}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-dark-700">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile menu button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-72 border-l border-gray-200 bg-white shadow-2xl dark:border-dark-700 dark:bg-dark-900 md:hidden"
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-dark-700">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-300 to-warm-300">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">
                  <span className="gradient-text">Edu</span>
                  <span className="text-gray-900 dark:text-white">Pro</span>
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-700 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* User info */}
            {session && (
              <div className="border-b border-gray-200 px-5 py-4 dark:border-dark-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-warm-300 text-sm font-bold text-white">
                    {(session.user?.name || session.user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {session.user?.name || "User"}
                    </div>
                    <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {session.user?.email}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                        pathname === link.href
                          ? "bg-brand-300/10 text-brand-500"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-dark-700 dark:hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-t border-gray-200 px-5 py-4 dark:border-dark-700"
            >
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}