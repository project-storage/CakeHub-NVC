"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/api/students";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Student, StudentDto } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, MoreHorizontal, Users } from "lucide-react";
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
import { StudentForm } from "./components/StudentForm";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentService.findAll(1, 1000),
  });

  const createMutation = useMutation({
    mutationFn: (newStudent: StudentDto) => studentService.create(newStudent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student created successfully");
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<StudentDto> }) =>
      studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully");
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully");
    },
  });

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "studentCode",
      header: "Student ID",
      cell: ({ row }) => <span className="font-mono font-bold text-primary">{row.original.studentCode}</span>
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => <span className="font-bold text-foreground">{row.original.fullName}</span>
    },
    {
      accessorKey: "group.name",
      header: "Group / Class",
      cell: ({ row }) => {
          const group = row.original.group;
          return group ? (
              <Badge variant="secondary" className="rounded-lg font-semibold px-2.5">
                  {group.name}
              </Badge>
          ) : (
              <span className="text-muted-foreground italic text-xs">No group assigned</span>
          );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;
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
                  setSelectedStudent(student);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4 opacity-70" /> Edit Student
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 font-semibold py-2"
                onClick={() => {
                  if (confirm("Are you sure you want to remove this student?")) {
                    deleteMutation.mutate(student.id);
                  }
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Remove Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const onSubmit = (formData: StudentDto) => {
    if (selectedStudent) {
      updateMutation.mutate({ id: selectedStudent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="p-12 text-center font-bold text-muted-foreground animate-pulse">Loading student directory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Student Directory</h1>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Manage student records and classroom assignments.</p>
        </div>
        <Button
          onClick={() => {
            setSelectedStudent(null);
            setIsDialogOpen(true);
          }}
          className="rounded-xl font-bold shadow-lg shadow-primary/10"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Student
        </Button>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
        <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey="fullName"
            searchPlaceholder="Search students..."
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-lg border-none shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold">{selectedStudent ? "Edit Student Details" : "Register Student"}</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              {selectedStudent
                ? "Update the student's personal information and group assignment."
                : "Register a new student and assign them to an academic group."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 border-t border-border/50 mt-4">
            <StudentForm
                initialData={selectedStudent}
                onSubmit={onSubmit}
                loading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
