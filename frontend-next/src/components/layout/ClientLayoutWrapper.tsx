"use client";

import { useUIStore } from "@/store/useUIStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/utils/utils";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div 
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarOpen ? "md:pl-64" : "pl-0"
        )}
      >
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
