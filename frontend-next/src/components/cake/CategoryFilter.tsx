"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Sparkles, Scale } from "lucide-react";

interface CategoryFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedWeight: string;
  onWeightChange: (weight: string) => void;
}

export function CategoryFilter({
  searchQuery,
  onSearchChange,
  selectedWeight,
  onWeightChange,
}: CategoryFilterProps) {
  
  const weightFilters = [
    { label: "All Weights", value: "all" },
    { label: "1.0 LB - Personal", value: "1" },
    { label: "2.0 LB - Medium", value: "2" },
    { label: "3.0+ LB - Party", value: "3" },
  ];

  return (
    <div className="flex flex-col gap-4 bg-card border border-border/40 p-4 sm:p-5 rounded-2xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input Bar */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            type="text"
            placeholder="Search custom cakes, flavors..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 rounded-xl bg-muted/30 border-border/60 focus:bg-background transition-colors font-medium text-sm"
          />
        </div>

        {/* Filters Wrapper */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar scroll-smooth">
          <div className="flex items-center gap-1 text-muted-foreground mr-1 shrink-0">
            <Scale className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Weight:</span>
          </div>

          {weightFilters.map((filter) => {
            const isActive = selectedWeight === filter.value;
            return (
              <Button
                key={filter.value}
                onClick={() => onWeightChange(filter.value)}
                variant={isActive ? "default" : "outline"}
                className={`rounded-xl font-bold text-xs px-4 py-1.5 h-9 shrink-0 transition-all ${
                  isActive ? "shadow-md shadow-primary/10" : "bg-muted/10 border-border/60 hover:bg-muted/30"
                }`}
                size="sm"
              >
                {filter.label}
              </Button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
