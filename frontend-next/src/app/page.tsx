"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cakeService } from "@/services/cake.service";
import { ProductGrid } from "@/components/cake/ProductGrid";
import { CategoryFilter } from "@/components/cake/CategoryFilter";
import { Cake as CakeIcon, Gift, Award, Star } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("all");

  const { data: response, isLoading } = useQuery({
    queryKey: ["cakes", searchQuery, selectedWeight],
    queryFn: () => cakeService.findAll(1, 100, searchQuery),
  });

  const cakes = response?.data || [];

  // Client-side weight filtering to provide immediate responsive feedback
  const filteredCakes = cakes.filter((cake) => {
    if (selectedWeight === "all") return true;
    if (selectedWeight === "1") return cake.pound >= 1 && cake.pound < 2;
    if (selectedWeight === "2") return cake.pound >= 2 && cake.pound < 3;
    if (selectedWeight === "3") return cake.pound >= 3;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden bg-card border-b border-border/40 py-16 sm:py-24">
        {/* Soft background decor */}
        <div className="absolute inset-0 bg-[radial-gradient(#2563EB_0.5px,transparent_0.5px)] opacity-5 [background-size:24px_24px]"></div>
        <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]" />
        
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-black tracking-wide text-primary uppercase">
            <Star className="h-3.5 w-3.5 fill-primary" /> Premium Bakery Booking 2026
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Handcrafted Luxury Cakes for <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Magical Moments</span>
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed">
            Order premium customized pastries and manage class cake bookings with absolute checkout security, elegant tracking, and rapid service.
          </p>

          {/* Quick Perks */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/40 max-w-md mx-auto text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div className="flex flex-col items-center gap-1.5">
              <Award className="h-5 w-5 text-primary" />
              <span>Elite Quality</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Gift className="h-5 w-5 text-primary" />
              <span>Perfect Gift</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <CakeIcon className="h-5 w-5 text-primary" />
              <span>Fresh Baked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 space-y-8 flex-grow">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Explore Our Varieties</h2>
          <p className="text-sm text-muted-foreground font-medium">Browse from fresh baked options available for instant school & advisor reservation.</p>
        </div>

        {/* Filter controls */}
        <CategoryFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedWeight={selectedWeight}
          onWeightChange={setSelectedWeight}
        />

        {/* Catalog Grid */}
        <ProductGrid cakes={filteredCakes} isLoading={isLoading} />
      </section>
      
    </div>
  );
}
