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

const groupSchema = z.object({
  name: z.string().min(2, "Group name is required"),
  advisor: z.string().min(2, "Advisor name is required"),
});

type GroupDto = z.infer<typeof groupSchema>;

interface GroupFormProps {
  initialData: Group | null;
  onSubmit: (data: GroupDto) => void;
  loading: boolean;
}

export function GroupForm({ initialData, onSubmit, loading }: GroupFormProps) {
  const form = useForm<GroupDto>({
    resolver: zodResolver(groupSchema),
    defaultValues: initialData || {
      name: "",
      advisor: "",
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
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="D-66-1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="advisor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Advisor</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading}>
            {initialData ? "Update Group" : "Create Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
