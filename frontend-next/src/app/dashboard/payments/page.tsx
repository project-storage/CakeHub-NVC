"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/api/payments";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/services/api/payments";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentService.findAll(),
  });

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => `#${row.original.id}`,
    },
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => `#${row.original.orderId}`,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="font-bold text-success">${row.original.amount.toFixed(2)}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.type === "FULL_PAYMENT" ? "default" : "secondary"}>
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "paymentDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.paymentDate), "MMM dd, yyyy hh:mm a"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
      </div>

      <DataTable
        columns={columns}
        data={payments || []}
      />
    </div>
  );
}
