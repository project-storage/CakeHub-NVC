"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/api/orders";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
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
      toast.success("Order status updated");
    },
  });

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => `#${row.original.id}`,
    },
    {
      accessorKey: "student.fullName",
      header: "Student",
      cell: ({ row }) => row.original.student?.fullName || "Guest",
    },
    {
      accessorKey: "totalPrice",
      header: "Total",
      cell: ({ row }) => `$${row.original.totalPrice.toFixed(2)}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variants: Record<string, any> = {
          PENDING: "warning",
          DEPOSITED: "secondary",
          PAID: "success",
          DELIVERED: "default",
          CANCELLED: "destructive",
        };
        return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
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
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/orders/${order.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: OrderStatus.PAID })}
                disabled={order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Paid
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: OrderStatus.DELIVERED })}
                disabled={order.status !== OrderStatus.PAID}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm("Cancel this order?")) {
                    updateStatusMutation.mutate({ id: order.id, status: OrderStatus.CANCELLED });
                  }
                }}
                disabled={order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED}
              >
                <XCircle className="mr-2 h-4 w-4" /> Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cake Orders</h1>
        <Button asChild>
          <Link href="/dashboard/orders/create">
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        searchKey="student_fullName" // Note: TanStack Table might need manual filter for nested objects or flatter data
      />
    </div>
  );
}
