"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, LogOut, Menu, ShieldAlert, Cake as CakeIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface NavbarProps {
  onCartToggle?: () => void;
}

export function Navbar({ onCartToggle }: NavbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getTotalItems();
  const isAuth = !!user;

  // Don't show public navbar on login/register/dashboard
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isDashboard || isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <img src="/nvc.png" alt="NVC Logo" className="h-9 w-auto object-contain" />
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            CakeHub NVC
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Browse Cakes
          </Link>
          {isAuth && (
            <Link
              href="/orders"
              className={`transition-colors hover:text-primary ${
                pathname === "/orders" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              My Orders
            </Link>
          )}
          {user?.role === "ADMIN" || user?.role === "ADVISOR" ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs text-accent-foreground font-bold hover:bg-accent/80 transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5" /> Dashboard
            </Link>
          ) : null}
        </nav>

        {/* Actions Menu */}
        <div className="flex items-center gap-3">
          {/* Cart Icon Button */}
          <Button
            onClick={onCartToggle}
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-accent/60 transition-colors"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground animate-bounce">
                {cartCount}
              </span>
            )}
          </Button>

          {/* User Account / Login */}
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/60 transition-colors">
                  <User className="h-5 w-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-border bg-card">
                <DropdownMenuLabel className="font-semibold px-3 py-2">
                  <p className="text-sm text-foreground">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl cursor-pointer" asChild>
                  <Link href="/orders">My Bookings</Link>
                </DropdownMenuItem>
                {user?.role === "ADMIN" || user?.role === "ADVISOR" ? (
                  <DropdownMenuItem className="rounded-xl cursor-pointer" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-xl font-bold px-5 shadow-lg shadow-primary/10">
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/98 p-4 space-y-3 shadow-inner">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold p-2 hover:bg-accent rounded-lg"
          >
            Browse Cakes
          </Link>
          {isAuth && (
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold p-2 hover:bg-accent rounded-lg"
            >
              My Orders
            </Link>
          )}
          {user?.role === "ADMIN" || user?.role === "ADVISOR" ? (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-bold text-primary p-2 hover:bg-accent rounded-lg"
            >
              <ShieldAlert className="h-4 w-4" /> Go to Dashboard
            </Link>
          ) : null}
        </div>
      )}
    </header>
  );
}
