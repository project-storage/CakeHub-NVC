"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Group } from "@/services/api/groups";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/api/users";
import { degreeService } from "@/services/api/degrees";
import { departmentService } from "@/services/api/departments";

const groupSchema = z.object({
  name: z.string().min(2, "Group name is required"),
  advisorId: z.number().min(1, "Advisor is required"),
  degreeId: z.number().min(1, "Degree is required"),
  departmentId: z.number().min(1, "Department is required"),
});

type GroupDto = z.infer<typeof groupSchema>;

interface GroupFormProps {
  initialData: Group | null;
  onSubmit: (data: GroupDto) => void;
  loading: boolean;
}

export function GroupForm({ initialData, onSubmit, loading }: GroupFormProps) {
  const { data: users } = useQuery({
    queryKey: ["users", "advisors"],
    queryFn: () => userService.findAll(1, 1000),
  });

  const { data: degrees } = useQuery({
    queryKey: ["degrees"],
    queryFn: () => degreeService.findAll(),
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentService.findAll(),
  });

  const advisors = users?.data.filter(u => u.role === "ADVISOR" || u.role === "ADMIN") || [];

  const form = useForm<GroupDto>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: initialData?.name || "",
      advisorId: initialData?.advisorId || 0,
      degreeId: initialData?.degreeId || 0,
      departmentId: initialData?.departmentId || 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Group Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., D-66-1" className="h-11 rounded-xl bg-accent/30 border-transparent focus:bg-background transition-all" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="degreeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Level (Degree)</FormLabel>
              <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className="h-11 rounded-xl bg-accent/30 border-transparent focus:bg-background transition-all">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  {degrees?.map((d) => (
                    <SelectItem key={d.id} value={d.id.toString()}>{d.degreeName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Department</FormLabel>
              <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className="h-11 rounded-xl bg-accent/30 border-transparent focus:bg-background transition-all">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  {departments?.map((d) => (
                    <SelectItem key={d.id} value={d.id.toString()}>{d.departmentName || "N/A"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="advisorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Class Advisor</FormLabel>
              <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className="h-11 rounded-xl bg-accent/30 border-transparent focus:bg-background transition-all">
                    <SelectValue placeholder="Assign advisor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  {advisors.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>{u.firstName} {u.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-6 border-t border-border/50 mt-6">
          <Button type="submit" className="h-11 px-8 rounded-xl font-bold shadow-lg shadow-primary/20" disabled={loading}>
            {initialData ? "Save Changes" : "Create Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
