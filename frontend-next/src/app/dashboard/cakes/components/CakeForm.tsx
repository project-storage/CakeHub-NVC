"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cake, CakeDto, CakeInput, cakeSchema } from "@/types/cake";
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

interface CakeFormProps {
  initialData: Cake | null;
  onSubmit: (data: CakeDto) => void;
  loading: boolean;
}

export function CakeForm({ initialData, onSubmit, loading }: CakeFormProps) {
  const form = useForm<CakeInput>({
    resolver: zodResolver(cakeSchema),
    defaultValues: initialData || {
      cakeName: "",
      price: 0,
      pound: 1,
      stock: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data as CakeDto))} className="space-y-4">
        <FormField
          control={form.control}
          name="cakeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cake Name</FormLabel>
              <FormControl>
                <Input placeholder="Chocolate Fudge" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pound"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pound</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading}>
            {initialData ? "Update Cake" : "Create Cake"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
