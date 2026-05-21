"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { useUIStore } from "@/store/useUIStore";
import { Home, ShoppingCart, Users, Layers, Cake, LogOut, CreditCard, FileText } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

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

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-xl font-bold text-primary flex items-center gap-2">
          <Cake className="h-6 w-6" />
          Orders Cake
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
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
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
