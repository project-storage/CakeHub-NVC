"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { orderService } from "@/services/api/orders";
import { paymentService } from "@/services/api/payments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CreditCard, CheckCircle, Package, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.findOne(Number(id)),
  });

  const paymentMutation = useMutation({
    mutationFn: (amount: number) => paymentService.create({
      orderId: Number(id),
      amount,
      type: 'FULL_PAYMENT'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Payment recorded successfully");
      setIsPaymentOpen(false);
    },
    onError: () => toast.error("Failed to record payment"),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  const statusVariants: Record<string, any> = {
    PENDING: "warning",
    DEPOSITED: "secondary",
    PAID: "success",
    DELIVERED: "default",
    CANCELLED: "destructive",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Placed on {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="text-sm px-3 py-1" variant={statusVariants[order.status]}>
            {order.status}
          </Badge>
          {order.remainingAmount > 0 && order.status !== 'CANCELLED' && (
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" /> Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription>
                    Enter the amount received from the student for this order.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Remaining Balance</Label>
                    <div className="text-2xl font-bold text-destructive">${order.remainingAmount.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Payment Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      max={order.remainingAmount}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => paymentMutation.mutate(paymentAmount)}
                  disabled={paymentAmount <= 0 || paymentMutation.isPending}
                >
                  {paymentMutation.isPending ? "Processing..." : "Confirm Payment"}
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Cake Variety</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right pr-6">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderDetails.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6 font-medium">{item.cake.cakeName}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right pr-6">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 hover:bg-muted/50 font-bold">
                    <TableCell colSpan={3} className="pl-6 py-4">Total Amount</TableCell>
                    <TableCell className="text-right pr-6 py-4 text-lg">${order.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-muted-foreground" /> Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Student Name</div>
                <div className="text-base font-semibold">{order.student?.fullName || "Guest"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Student ID</div>
                <div className="text-base">{order.student?.studentCode || "N/A"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Price:</span>
                <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deposit Paid:</span>
                <span className="font-medium text-success">${order.depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold">
                <span>Remaining:</span>
                <span className="text-destructive">${order.remainingAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
