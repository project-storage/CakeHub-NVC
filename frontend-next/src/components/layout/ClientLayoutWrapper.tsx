"use client";

import { useUIStore } from "@/store/useUIStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/utils/utils";
import { motion, AnimatePresence } from "motion/react";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex min-h-screen background-gradient text-foreground selection:bg-primary/20">
      <Sidebar />
      <div 
        className={cn(
          "flex flex-1 flex-col transition-all duration-500 ease-in-out",
          sidebarOpen ? "md:pl-64" : "pl-0"
        )}
      >
        <Header />
        <main className="flex-1 p-6 md:p-10 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1600px] mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
      
      {/* Decorative premium elements */}
      <div className="fixed top-0 right-0 -z-10 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed -bottom-40 -left-40 -z-10 h-[600px] w-[600px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none opacity-40" />
    </div>
  );
}
