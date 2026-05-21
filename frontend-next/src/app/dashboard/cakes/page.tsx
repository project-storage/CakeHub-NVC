"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cakeService } from "@/services/api/cakes";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Cake, CakeDto } from "@/types/cake";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, MoreHorizontal } from "lucide-react";
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
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
    },
    {
      accessorKey: "pound",
      header: "Pound",
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;
        return (
          <Badge variant={stock > 10 ? "success" : stock > 0 ? "warning" : "destructive"}>
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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCake(cake);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this cake?")) {
                    deleteMutation.mutate(cake.id);
                  }
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cake Inventory</h1>
        <Button
          onClick={() => {
            setSelectedCake(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Cake
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="cakeName"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCake ? "Edit Cake" : "Add New Cake"}</DialogTitle>
            <DialogDescription>
              {selectedCake
                ? "Update the details for the existing cake in inventory."
                : "Enter the details for the new cake variety."}
            </DialogDescription>
          </DialogHeader>
          <CakeForm
            initialData={selectedCake}
            onSubmit={onSubmit}
            loading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
