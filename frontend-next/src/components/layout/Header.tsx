"use client";

import { useUIStore } from "@/store/useUIStore";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
         {/* User profile, Theme switch, Notifications */}
         <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
           U
         </div>
      </div>
    </header>
  );
}
