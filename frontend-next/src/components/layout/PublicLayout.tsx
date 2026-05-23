"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      <Navbar onCartToggle={() => setCartOpen(true)} />
      
      <main className="flex-grow flex flex-col w-full">
        {children}
      </main>

      <Footer />
      
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      
      {/* Toast notifications */}
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
