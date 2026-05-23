"use client";

import { Cake } from "@/types/cake";
import { CakeCard } from "./CakeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, HelpCircle } from "lucide-react";

interface ProductGridProps {
  cakes: Cake[];
  isLoading: boolean;
}

export function ProductGrid({ cakes, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3.5 border border-border/40 p-4 rounded-2xl bg-card shadow-sm animate-pulse">
            <Skeleton className="h-44 w-full rounded-xl bg-muted/60" />
            <Skeleton className="h-5 w-3/4 rounded-md bg-muted/50" />
            <Skeleton className="h-4 w-1/2 rounded-md bg-muted/50" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-1/4 rounded-md bg-muted/50" />
              <Skeleton className="h-8 w-1/3 rounded-xl bg-muted/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cakes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border-2 border-dashed border-border/50 bg-card shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 shadow-lg shadow-primary/5">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground">No Cakes Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm font-medium">
          We couldn&apos;t find any cake varieties matching your search. Please check your keywords or adjust filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cakes.map((cake) => (
        <div key={cake.id} className="transition-all duration-300">
          <CakeCard cake={cake} />
        </div>
      ))}
    </div>
  );
}
