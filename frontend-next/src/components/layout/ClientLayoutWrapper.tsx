"use client";

import { useUIStore } from "@/store/useUIStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/utils/utils";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const pathname = usePathname();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      } else if (!isMobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    // Initial check
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <Sidebar />
      
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <div 
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0",
          sidebarOpen ? "md:pl-64" : "pl-0"
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1400px] mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
      
      {/* Subtle decorative elements */}
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-20 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />
    </div>
  );
}
