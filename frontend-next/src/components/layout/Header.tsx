"use client";

import { useUIStore } from "@/store/useUIStore";
import { Menu, User, Bell, Search, Settings, HelpCircle, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 md:h-20 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 md:px-8">
      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="rounded-xl hover:bg-accent transition-colors h-10 w-10"
        >
          <Menu className="h-5 w-5 text-foreground/70" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:flex flex-1 max-w-md relative mx-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search..." 
          className="pl-10 h-10 bg-accent/50 border-transparent focus-visible:ring-primary/20 focus-visible:bg-background focus-visible:border-primary/20 transition-all rounded-xl text-sm"
        />
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1 md:gap-3">
        {/* Mobile Search Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden rounded-xl h-10 w-10"
          onClick={() => setSearchVisible(!searchVisible)}
        >
          <Search className="h-5 w-5 text-foreground/70" />
        </Button>

        <div className="hidden sm:flex items-center gap-1 md:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl h-10 w-10 hover:bg-accent"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground/70" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground/70" />
          </Button>

          <Button variant="ghost" size="icon" className="relative rounded-xl h-10 w-10 hover:bg-accent">
            <Bell className="h-5 w-5 text-foreground/70" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-1 md:px-2 h-11 rounded-xl hover:bg-accent transition-all group">
              <div className="h-8 w-8 rounded-lg blue-sky-premium-gradient flex items-center justify-center text-xs font-bold text-white shadow-md shadow-primary/10 group-hover:scale-105 transition-transform">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col items-start text-left">
                <span className="font-semibold text-xs text-foreground leading-tight">{user?.firstName} {user?.lastName}</span>
                <span className="text-muted-foreground font-bold text-[8px] uppercase tracking-wider">{user?.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border-border bg-card">
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Account
            </DropdownMenuLabel>
            <div className="px-3 py-3 mb-1 flex items-center gap-3 bg-accent/50 rounded-xl">
              <div className="h-10 w-10 rounded-lg blue-sky-premium-gradient flex items-center justify-center text-sm font-bold text-white shadow-inner">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm truncate">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator className="mx-1 my-1" />
            <DropdownMenuItem className="cursor-pointer rounded-lg p-2 focus:bg-accent transition-all">
              <User className="mr-2 h-4 w-4 opacity-70" /> 
              <span className="font-semibold text-sm">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg p-2 focus:bg-accent transition-all">
              <Settings className="mr-2 h-4 w-4 opacity-70" /> 
              <span className="font-semibold text-sm">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-1 my-1" />
            <DropdownMenuItem
              className="text-destructive cursor-pointer rounded-lg p-2 focus:bg-destructive/10 transition-all"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> 
              <span className="font-semibold text-sm">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-0 z-30 flex h-16 items-center gap-2 bg-background px-4 md:hidden"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input 
              autoFocus
              placeholder="Search..." 
              className="flex-1 h-10 bg-accent/50 border-transparent focus-visible:ring-primary/20 rounded-xl text-sm"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchVisible(false)}
              className="rounded-lg font-semibold"
            >
              Cancel
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
