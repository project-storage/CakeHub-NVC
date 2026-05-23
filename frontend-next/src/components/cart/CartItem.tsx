"use client";

import { CartItem as CartItemType, useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, Scale } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { cake, quantity } = item;

  const handleIncrease = () => {
    updateQuantity(cake.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(cake.id, quantity - 1);
    } else {
      removeItem(cake.id);
    }
  };

  const itemTotal = cake.price * quantity;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/40 py-4.5 last:border-0">
      {/* Product Avatar & Details */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl select-none shadow-sm">
          🎂
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground truncate">{cake.cakeName}</h4>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mt-0.5">
            <Scale className="h-3 w-3" />
            <span>{cake.pound} LB weight</span>
          </div>
          <p className="text-xs text-primary font-bold mt-1">${cake.price.toFixed(2)} each</p>
        </div>
      </div>

      {/* Adjust quantity and remove buttons */}
      <div className="flex flex-col items-end gap-2.5">
        <div className="flex items-center gap-1.5 border border-border/60 rounded-lg p-0.5 bg-muted/20">
          <Button
            onClick={handleDecrease}
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md hover:bg-background text-muted-foreground transition-colors"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-xs font-bold w-6 text-center text-foreground">{quantity}</span>
          <Button
            onClick={handleIncrease}
            disabled={quantity >= cake.stock}
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md hover:bg-background text-muted-foreground transition-colors"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center gap-3.5">
          <span className="text-sm font-extrabold text-foreground">${itemTotal.toFixed(2)}</span>
          <Button
            onClick={() => removeItem(cake.id)}
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all"
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
