"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/api/orders";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Eye, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

export default function OrdersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.findAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully");
    },
  });

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => <span className="font-mono font-bold text-primary">#{row.original.id}</span>,
    },
    {
      accessorKey: "student.fullName",
      header: "Student / Customer",
      cell: ({ row }) => (
          <div className="flex flex-col">
              <span className="font-bold text-foreground">{row.original.student?.fullName || "Guest Customer"}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{row.original.student?.studentCode || "ONE-TIME PURCHASE"}</span>
          </div>
      ),
    },
    {
      accessorKey: "totalPrice",
      header: "Total Amount",
      cell: ({ row }) => <span className="font-black text-foreground">${row.original.totalPrice.toFixed(2)}</span>,
    },
    {
      accessorKey: "status",
      header: "Booking Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variants: Record<string, any> = {
          PENDING: "warning",
          DEPOSITED: "secondary",
          PAID: "success",
          DELIVERED: "default",
          CANCELLED: "destructive",
        };
        return (
            <Badge 
                variant={variants[status] || "outline"}
                className="rounded-lg font-bold px-2.5"
            >
                {status}
            </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Booking Date",
      cell: ({ row }) => (
          <div className="flex flex-col">
              <span className="text-sm font-medium">{format(new Date(row.original.createdAt), "MMM dd, yyyy")}</span>
              <span className="text-[10px] text-muted-foreground">{format(new Date(row.original.createdAt), "hh:mm a")}</span>
          </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-accent transition-colors">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-2 shadow-xl border-border bg-card">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-2 py-1.5">Booking Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer font-semibold py-2">
                <Link href={`/dashboard/orders/${order.id}`} className="flex items-center">
                  <Eye className="mr-2 h-4 w-4 opacity-70" /> View Order Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-1" />
              <DropdownMenuItem
                className="rounded-lg cursor-pointer font-semibold py-2"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: OrderStatus.PAID })}
                disabled={order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED}
              >
                <CheckCircle className="mr-2 h-4 w-4 opacity-70 text-emerald-500" /> Mark as Full Payment
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg cursor-pointer font-semibold py-2"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: OrderStatus.DELIVERED })}
                disabled={order.status !== OrderStatus.PAID}
              >
                <CheckCircle className="mr-2 h-4 w-4 opacity-70 text-blue-500" /> Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 font-semibold py-2"
                onClick={() => {
                  if (confirm("Are you sure you want to cancel this booking?")) {
                    updateStatusMutation.mutate({ id: order.id, status: OrderStatus.CANCELLED });
                  }
                }}
                disabled={order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED}
              >
                <XCircle className="mr-2 h-4 w-4 opacity-70" /> Cancel Booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <div className="p-12 text-center font-bold text-muted-foreground animate-pulse">Loading cake orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Cake Orders</h1>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Track and manage student cake bookings and payment statuses.</p>
        </div>
        <Button asChild className="rounded-xl font-bold shadow-lg shadow-primary/10">
          <Link href="/dashboard/orders/create">
            <Plus className="mr-2 h-4 w-4" /> Create New Order
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
        <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey="student_fullName"
            searchPlaceholder="Search by student name..."
        />
      </div>
    </div>
  );
}
