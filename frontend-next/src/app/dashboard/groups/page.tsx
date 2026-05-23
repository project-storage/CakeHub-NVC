"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService, Group } from "@/services/api/groups";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, MoreHorizontal, Layers } from "lucide-react";
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
import { GroupForm } from "./components/GroupForm";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function GroupsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (newGroup: any) => groupService.create(newGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created successfully");
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      groupService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group updated successfully");
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => groupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group deleted successfully");
    },
  });

  const columns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Group Name",
      cell: ({ row }) => <span className="font-bold text-foreground">{row.original.name}</span>
    },
    {
      accessorKey: "advisor.firstName",
      header: "Advisor",
      cell: ({ row }) => {
        const advisor = row.original.advisor;
        return (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10">
              {advisor ? `${advisor.firstName.charAt(0)}${advisor.lastName.charAt(0)}` : "?"}
            </div>
            <span className="text-sm font-medium">{advisor ? `${advisor.firstName} ${advisor.lastName}` : "No Advisor"}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "degree.degreeName",
      header: "Degree",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.degree?.degreeName || "N/A"}</span>
    },
    {
      accessorKey: "department.departmentName",
      header: "Department",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.department?.departmentName || "N/A"}</span>
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const group = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-accent transition-colors">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-2 shadow-xl border-border bg-card">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-2 py-1.5">Options</DropdownMenuLabel>
              <DropdownMenuItem
                className="rounded-lg cursor-pointer font-semibold py-2"
                onClick={() => {
                  setSelectedGroup(group);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4 opacity-70" /> Edit Group
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                    className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 font-semibold py-2"
                    onClick={() => {
                    if (confirm("Are you sure you want to delete this group?")) {
                        deleteMutation.mutate(group.id);
                    }
                    }}
                >
                    <Trash className="mr-2 h-4 w-4" /> Delete Group
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <div className="p-12 text-center font-bold text-muted-foreground animate-pulse">Loading academic groups...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <Layers className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Academic Groups</h1>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Manage classrooms and study groups under your supervision.</p>
        </div>
        {isAdmin && (
            <Button
                onClick={() => {
                    setSelectedGroup(null);
                    setIsDialogOpen(true);
                }}
                className="rounded-xl font-bold shadow-lg shadow-primary/10"
            >
                <Plus className="mr-2 h-4 w-4" /> Add New Group
            </Button>
        )}
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
        <DataTable
            columns={columns}
            data={data || []}
            searchKey="name"
            searchPlaceholder="Search groups..."
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-lg border-none shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold">{selectedGroup ? "Edit Group Details" : "Create New Group"}</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              {selectedGroup ? "Update the academic level and department information for this group." : "Initialize a new classroom and assign an advisor."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 border-t border-border/50 mt-4">
            <GroupForm
                initialData={selectedGroup}
                onSubmit={(data) => {
                if (selectedGroup) {
                    updateMutation.mutate({ id: selectedGroup.id, data });
                } else {
                    createMutation.mutate(data);
                }
                }}
                loading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
