"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { useUIStore } from "@/store/useUIStore";
import { Home, ShoppingCart, Users, Layers, Cake, LogOut, CreditCard, FileText, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["ADMIN", "ADVISOR", "USER"] },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart, roles: ["ADMIN", "ADVISOR", "USER"] },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard, roles: ["ADMIN", "ADVISOR"] },
  { name: "Cakes", href: "/dashboard/cakes", icon: Cake, roles: ["ADMIN", "ADVISOR"] },
  { name: "Students", href: "/dashboard/students", icon: Users, roles: ["ADMIN", "ADVISOR"] },
  { name: "Groups", href: "/dashboard/groups", icon: Layers, roles: ["ADMIN", "ADVISOR"] },
  { name: "Reports", href: "/dashboard/reports", icon: FileText, roles: ["ADMIN"] },
  { name: "Users", href: "/dashboard/users", icon: Users, roles: ["ADMIN"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { logout, user } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-card shadow-xl md:shadow-none"
        >
          <div className="flex h-20 items-center justify-between px-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl blue-sky-premium-gradient text-white shadow-lg shadow-primary/20">
                <Cake className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-primary">
                CakeHub
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden rounded-xl h-9 w-9"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="flex-1 px-3 space-y-6 overflow-y-auto custom-scrollbar mt-4">
            <div>
              <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                Menu
              </p>
              <div className="space-y-1">
                {navItems.map((item) => {
                  if (item.roles && !item.roles.includes(user?.role || "")) {
                    return null;
                  }
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className="flex-1">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute right-3 w-1.5 h-1.5 bg-primary-foreground rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 mt-auto border-t border-border/50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-sm font-bold text-primary border border-primary/10">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</span>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">{user?.role}</span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-destructive transition-all duration-200 hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
