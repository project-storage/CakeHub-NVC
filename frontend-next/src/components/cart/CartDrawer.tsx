"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/button";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useRef, useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, getTotalPrice, getTotalItems } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  const cartTotal = getTotalPrice();
  const cartCount = getTotalItems();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // disable background scrolling
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark Overlay backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-md h-full bg-card border-l border-border shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-extrabold tracking-tight text-foreground">Shopping Cart</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-black text-primary">
              {cartCount}
            </span>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-accent/60 h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary/40 mb-5">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-foreground">Your cart is empty</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[240px] font-medium leading-relaxed">
                Add beautiful premium cakes from our catalogs to start booking!
              </p>
              <Button
                onClick={onClose}
                className="mt-6 rounded-xl font-bold px-6 py-5 shadow-lg shadow-primary/10"
              >
                Browse Cakes
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item) => (
                <CartItem key={item.cake.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-border/40 bg-muted/10 px-6 py-6 space-y-5">
            {/* Price Calculations */}
            <div className="space-y-2.5 text-sm font-semibold">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax & Service Fee</span>
                <span className="text-foreground font-bold">$0.00</span>
              </div>
              <div className="flex justify-between text-base font-black pt-3.5 border-t border-border/40">
                <span className="text-foreground">Total Price</span>
                <span className="text-primary">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid gap-3">
              <Button
                asChild
                onClick={onClose}
                className="w-full rounded-xl py-6 font-bold text-sm shadow-lg shadow-primary/10 group/btn"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full rounded-xl py-6 text-muted-foreground hover:text-foreground text-xs font-bold"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
