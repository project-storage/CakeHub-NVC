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
import { motion } from "motion/react";

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-24 items-center gap-4 border-b border-border/50 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80 px-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <Menu className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl relative mx-4">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Search for orders, cakes, or students..." 
          className="pl-14 h-14 bg-slate-50 border-transparent focus-visible:ring-primary/10 focus-visible:bg-white focus-visible:border-primary/20 transition-all rounded-[14px] text-base placeholder:text-slate-400"
        />
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-2xl h-11 w-11 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-600" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-400" />
          </Button>

          <Button variant="ghost" size="icon" className="relative rounded-2xl h-11 w-11 hover:bg-slate-100 dark:hover:bg-slate-900">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
          </Button>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2 h-14 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group border border-transparent hover:border-border">
              <div className="h-10 w-10 rounded-xl blue-sky-premium-gradient flex items-center justify-center text-sm font-bold text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col items-start text-left">
                <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{user?.firstName} {user?.lastName}</span>
                <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">{user?.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-3 rounded-[20px] shadow-2xl border-border bg-white dark:bg-slate-950">
            <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              User Profile
            </DropdownMenuLabel>
            <div className="px-4 py-4 mb-2 flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <div className="h-12 w-12 rounded-2xl blue-sky-premium-gradient flex items-center justify-center text-lg font-bold text-white shadow-inner">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-base truncate">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator className="mx-2 mb-2 bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuItem className="cursor-pointer rounded-xl p-3 focus:bg-primary/5 focus:text-primary transition-all">
              <User className="mr-3 h-5 w-5 opacity-70" /> 
              <span className="font-bold text-sm">Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl p-3 focus:bg-primary/5 focus:text-primary transition-all">
              <Settings className="mr-3 h-5 w-5 opacity-70" /> 
              <span className="font-bold text-sm">System Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-2 my-2 bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuItem
              className="text-rose-500 cursor-pointer rounded-xl p-3 focus:bg-rose-50 dark:focus:bg-rose-900/20 transition-all"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              <LogOut className="mr-3 h-5 w-5" /> 
              <span className="font-bold text-sm">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
