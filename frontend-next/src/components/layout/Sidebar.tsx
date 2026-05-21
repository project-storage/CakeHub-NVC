"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { useUIStore } from "@/store/useUIStore";
import { Home, ShoppingCart, Users, Layers, Cake, LogOut, CreditCard, FileText, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "motion/react";

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
  const { sidebarOpen } = useUIStore();
  const { logout, user } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-white dark:bg-slate-950 shadow-sm"
        >
          <div className="flex h-24 items-center px-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl blue-sky-premium-gradient text-white shadow-lg shadow-primary/30">
                <Cake className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">
                CakeHub
              </span>
            </Link>
          </div>

          <div className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar mt-4">
            <div>
              <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                Platform
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
                        "group relative flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-bold transition-all duration-200",
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-900"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-primary"
                      )} />
                      <span className="flex-1">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-dot"
                          className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-sm"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 mt-auto border-t border-border/50">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-sm font-bold text-primary border border-primary/10">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</span>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{user?.role}</span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-bold text-rose-500 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
