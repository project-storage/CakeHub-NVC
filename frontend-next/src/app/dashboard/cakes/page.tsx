"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cakeService } from "@/services/api/cakes";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Cake, CakeDto } from "@/types/cake";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, MoreHorizontal, Cake as CakeIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CakeForm } from "./components/CakeForm";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function CakesPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["cakes"],
    queryFn: () => cakeService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (newCake: CakeDto) => cakeService.create(newCake),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cakes"] });
      toast.success("Cake created successfully");
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CakeDto> }) =>
      cakeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cakes"] });
      toast.success("Cake updated successfully");
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => cakeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cakes"] });
      toast.success("Cake deleted successfully");
    },
  });

  const columns: ColumnDef<Cake>[] = [
    {
      accessorKey: "cakeName",
      header: "Name",
      cell: ({ row }) => <span className="font-bold text-foreground">{row.original.cakeName}</span>
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span className="font-semibold">${row.original.price.toFixed(2)}</span>
    },
    {
      accessorKey: "pound",
      header: "Pound",
      cell: ({ row }) => <span className="text-muted-foreground font-medium">{row.original.pound} lb</span>
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;
        return (
          <Badge 
            variant={stock > 10 ? "success" : stock > 0 ? "warning" : "destructive"}
            className="rounded-lg font-bold px-2.5"
          >
            {stock} units
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const cake = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-accent transition-colors">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-2 shadow-xl border-border bg-card">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-2 py-1.5">Management</DropdownMenuLabel>
              <DropdownMenuItem
                className="rounded-lg cursor-pointer font-semibold py-2"
                onClick={() => {
                  setSelectedCake(cake);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4 opacity-70" /> Edit Cake
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 font-semibold py-2"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this cake?")) {
                    deleteMutation.mutate(cake.id);
                  }
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete Cake
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const onSubmit = (formData: CakeDto) => {
    if (selectedCake) {
      updateMutation.mutate({ id: selectedCake.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="p-12 text-center font-bold text-muted-foreground animate-pulse">Loading cake inventory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <CakeIcon className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Cake Inventory</h1>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Manage your cake varieties and stock levels.</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCake(null);
            setIsDialogOpen(true);
          }}
          className="rounded-xl font-bold shadow-lg shadow-primary/10"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Cake
        </Button>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
        <DataTable
          columns={columns}
          data={data?.data || []}
          searchKey="cakeName"
          searchPlaceholder="Search cakes..."
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-lg border-none shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold">{selectedCake ? "Edit Cake Details" : "Add New Cake"}</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              {selectedCake
                ? "Update the pricing and stock information for this cake."
                : "Initialize a new cake variety in your inventory."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 border-t border-border/50 mt-4">
            <CakeForm
                initialData={selectedCake}
                onSubmit={onSubmit}
                loading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
