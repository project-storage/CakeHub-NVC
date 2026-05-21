import { z } from "zod";
import { Student } from "./student";
import { Cake } from "./cake";

const numericSchema = z.union([z.number(), z.string()]).pipe(z.coerce.number());

export const orderDetailSchema = z.object({
  cakeId: numericSchema,
  quantity: numericSchema.pipe(z.number().min(1)),
});

export const orderSchema = z.object({
  studentId: numericSchema,
  depositAmount: numericSchema.pipe(z.number().min(0)).optional(),
  items: z.array(orderDetailSchema).min(1, "At least one cake must be selected"),
});

export type OrderDto = z.infer<typeof orderSchema>;
export type OrderInput = z.input<typeof orderSchema>;
export type OrderDetailInput = z.input<typeof orderDetailSchema>;

export enum OrderStatus {
  PENDING = 'PENDING',
  DEPOSITED = 'DEPOSITED',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface Order {
  id: number;
  totalPrice: number;
  depositAmount: number;
  remainingAmount: number;
  status: OrderStatus;
  student?: Student;
  orderDetails: {
    id: number;
    cake: Cake;
    quantity: number;
    price: number;
  }[];
  createdAt: string;
  updatedAt: string;
}
