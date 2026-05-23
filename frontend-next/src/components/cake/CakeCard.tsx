"use client";

import { Cake } from "@/types/cake";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Sparkles, Scale } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface CakeCardProps {
  cake: Cake;
}

export function CakeCard({ cake }: CakeCardProps) {
  const { addItem } = useCartStore();
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cake.stock <= 0) {
      toast.error("Sorry, this cake is currently out of stock!");
      return;
    }
    
    addItem(cake, 1);
    toast.success(`Added ${cake.cakeName} to your cart! 🎂`, {
      description: "You can modify the quantity in the cart drawer.",
    });
  };

  // Generate a premium unique gradient background for each card visual
  const gradientStyles = [
    "from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950",
    "from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-950",
    "from-sky-100 to-indigo-100 dark:from-sky-950 dark:to-indigo-950",
    "from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950"
  ];
  const bgGradient = gradientStyles[cake.id % gradientStyles.length];

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 flex flex-col h-full">
      {/* Product Image Container */}
      <div className={`relative aspect-[4/3] w-full bg-gradient-to-tr ${bgGradient} flex items-center justify-center p-6 select-none overflow-hidden`}>
        {/* Soft floating particles in background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {cake.stock > 10 ? (
            <Badge variant="secondary" className="glass-effect rounded-lg font-black tracking-wide text-[10px] px-2 py-0.5 uppercase bg-white/70 dark:bg-slate-900/70">
              In Stock
            </Badge>
          ) : cake.stock > 0 ? (
            <Badge variant="outline" className="rounded-lg font-black tracking-wide text-[10px] px-2 py-0.5 uppercase bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400">
              Low Stock ({cake.stock})
            </Badge>
          ) : (
            <Badge variant="destructive" className="rounded-lg font-black tracking-wide text-[10px] px-2 py-0.5 uppercase">
              Sold Out
            </Badge>
          )}
          
          {cake.price > 50 && (
            <Badge className="bg-primary hover:bg-primary/95 text-primary-foreground font-black text-[9px] px-2 py-0.5 rounded-lg w-fit flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Premium
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-border/20 text-muted-foreground transition-all hover:scale-105 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-800"
          aria-label="Add to favorites"
        >
          <Heart className={`h-4.5 w-4.5 transition-colors ${isLiked ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
        </button>

        {/* Scaled bakery graphics placeholder */}
        <div className="relative transform transition-transform duration-500 group-hover:scale-110 flex flex-col items-center">
          <span className="text-6xl filter drop-shadow-md">🎂</span>
          <div className="mt-2 text-[10px] tracking-widest font-black uppercase text-muted-foreground/40 dark:text-muted-foreground/60">
            {cake.pound} LB DELIGHT
          </div>
        </div>
      </div>

      <CardHeader className="p-4 pb-1 space-y-1.5">
        <h3 className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
          {cake.cakeName}
        </h3>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5" />
            <span>{cake.pound} LB weight</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 flex-grow">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          Handcrafted luxury cake prepared using premium baker flour, pure butter cream, and exquisite frosting blends. Perfect for high-class birthday events, graduations, and memorable bookings.
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t border-border/30 mt-auto flex items-center justify-between gap-4">
        {/* Pricing */}
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-widest text-muted-foreground/50 uppercase">Price</span>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            ${cake.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart button */}
        <Button
          onClick={handleAddToCart}
          disabled={cake.stock <= 0}
          className="rounded-xl font-bold px-4 shadow-md shadow-primary/5 group/btn transition-all active:scale-[0.98]"
          size="sm"
        >
          <ShoppingBag className="mr-1.5 h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
