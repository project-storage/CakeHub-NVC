"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { orderService } from "@/services/api/orders";
import { paymentService } from "@/services/api/payments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CreditCard, Package, User, Printer } from "lucide-react";
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

  if (isLoading) return <div className="p-8 text-center font-bold">Loading order details...</div>;
  if (!order) return <div className="p-8 text-center text-destructive font-bold">Order not found</div>;

  const statusVariants: Record<string, any> = {
    PENDING: "warning",
    DEPOSITED: "secondary",
    PAID: "success",
    DELIVERED: "default",
    CANCELLED: "destructive",
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 print:p-0 print:m-0">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="hover:bg-accent">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <Button variant="outline" onClick={handlePrint} className="font-bold gap-2">
          <Printer className="h-4 w-4" /> Print Receipt
        </Button>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-8 border-b pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-widest">CakeHub</h1>
        <p className="text-sm text-muted-foreground mt-2">Official Cake Booking Receipt</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Order #{order.id}</h2>
          <p className="text-muted-foreground">
            Placed on {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
          </p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <Badge className="text-sm px-3 py-1 font-bold" variant={statusVariants[order.status]}>
            {order.status}
          </Badge>
          {order.remainingAmount > 0 && order.status !== 'CANCELLED' && (
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
              <DialogTrigger asChild>
                <Button className="font-bold">
                  <CreditCard className="mr-2 h-4 w-4" /> Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription>
                    Enter the amount received from the student for this order.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Remaining Balance</Label>
                    <div className="text-3xl font-bold text-destructive">${order.remainingAmount.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      max={order.remainingAmount}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="h-12 text-lg font-bold rounded-xl"
                    />
                  </div>
                </div>
                <Button
                  className="w-full h-12 font-bold rounded-xl"
                  onClick={() => paymentMutation.mutate(paymentAmount)}
                  disabled={paymentAmount <= 0 || paymentMutation.isPending}
                >
                  {paymentMutation.isPending ? "Processing..." : "Confirm Payment"}
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="hidden print:block">
            <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                <p className="text-lg font-black">{order.status}</p>
            </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden print:shadow-none print:border">
            <CardHeader className="bg-accent/30 print:bg-transparent">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-muted-foreground print:hidden" /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6 font-bold text-foreground">Cake Variety</TableHead>
                    <TableHead className="font-bold text-foreground">Price</TableHead>
                    <TableHead className="font-bold text-foreground">Qty</TableHead>
                    <TableHead className="text-right pr-6 font-bold text-foreground">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderDetails.map((item) => (
                    <TableRow key={item.id} className="border-border/40">
                      <TableCell className="pl-6 font-semibold">{item.cake.cakeName}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right pr-6 font-bold">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-accent/5 hover:bg-accent/5 font-black border-t-2">
                    <TableCell colSpan={3} className="pl-6 py-5 text-base uppercase tracking-widest">Total Amount</TableCell>
                    <TableCell className="text-right pr-6 py-5 text-xl font-black">${order.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm print:shadow-none print:border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <User className="h-4 w-4 text-muted-foreground print:hidden" /> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Student Name</div>
                <div className="text-base font-bold">{order.student?.fullName || "Guest"}</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Student ID</div>
                <div className="text-base font-bold">{order.student?.studentCode || "N/A"}</div>
              </div>
              {order.student?.group && (
                <div>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Group / Class</div>
                    <div className="text-base font-bold">{order.student.group.name}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm print:shadow-none print:border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold uppercase tracking-wider">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground uppercase tracking-tighter">Total Price:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground uppercase tracking-tighter">Deposit Paid:</span>
                <span className="text-emerald-600">${order.depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 font-black text-lg">
                <span className="uppercase tracking-tighter">Remaining:</span>
                <span className="text-rose-600">${order.remainingAmount.toFixed(2)}</span>
              </div>
            </CardContent>
            <div className="hidden print:block pt-12 text-center">
                <div className="flex justify-between gap-12 mt-12 px-6">
                    <div className="flex-1 border-t border-black pt-2">
                        <p className="text-[8px] font-black uppercase tracking-widest">Student Signature</p>
                    </div>
                    <div className="flex-1 border-t border-black pt-2">
                        <p className="text-[8px] font-black uppercase tracking-widest">Advisor Signature</p>
                    </div>
                </div>
                <p className="mt-8 text-[8px] text-muted-foreground font-bold">Printed on {format(new Date(), "PPP pp")}</p>
            </div>
          </Card>
        </div>
      </div>
      
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          header, aside, .print\\:hidden, button, [role="dialog"] {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .max-w-5xl {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
