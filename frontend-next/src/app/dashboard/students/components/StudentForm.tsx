"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student, StudentDto, StudentInput, studentSchema } from "@/types/student";
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
import { groupService } from "@/services/api/groups";

interface StudentFormProps {
  initialData: Student | null;
  onSubmit: (data: StudentDto) => void;
  loading: boolean;
}

export function StudentForm({ initialData, onSubmit, loading }: StudentFormProps) {
  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupService.findAll(),
  });

  const form = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      studentCode: "",
      fullName: "",
      citizenId: "",
      groupId: null,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data as StudentDto))} className="space-y-4">
        <FormField
          control={form.control}
          name="studentCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Code</FormLabel>
              <FormControl>
                <Input placeholder="66309010001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="citizenId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Citizen ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="1100000000000" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">No Group</SelectItem>
                  {groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading}>
            {initialData ? "Update Student" : "Create Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
