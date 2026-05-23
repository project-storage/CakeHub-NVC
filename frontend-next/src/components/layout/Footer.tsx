"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cake as CakeIcon } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard and auth pages
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isDashboard || isAuthPage) return null;

  return (
    <footer className="w-full border-t border-border/40 bg-card py-8 md:py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CakeIcon className="h-4 w-4" />
          </div>
          <span className="text-sm font-extrabold tracking-tight text-foreground">
            CakeHub Enterprise
          </span>
        </div>

        {/* Copy / Tagline */}
        <p className="text-xs text-muted-foreground font-medium text-center md:text-left">
          &copy; {new Date().getFullYear()} CakeHub. All rights reserved. Designed for elite bakery bookings.
        </p>

        {/* Support Links */}
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <span className="text-border">|</span>
          <Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link>
          <span className="text-border">|</span>
          <Link href="/login" className="hover:text-primary transition-colors">Staff Access</Link>
        </div>

      </div>
    </footer>
  );
}
