import { z } from "zod";

const numericSchema = z.union([z.number(), z.string()]).pipe(z.coerce.number());

export const cakeSchema = z.object({
  cakeName: z.string().min(2, "Cake name is required"),
  price: numericSchema.pipe(z.number().min(0, "Price must be positive")),
  pound: numericSchema.pipe(z.number().min(0, "Pound must be positive")),
  stock: numericSchema.pipe(z.number().int().min(0, "Stock must be positive")),
});

export type CakeDto = z.infer<typeof cakeSchema>;
export type CakeInput = z.input<typeof cakeSchema>;

export interface Cake extends CakeDto {
  id: number;
  createdAt: string;
  updatedAt: string;
}
