"use client";

import { useCartStore } from "@/store/useCartStore";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useMutation } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.warning("Your cart is empty! Please add some cakes first.");
      router.push("/");
    }
  }, [items, router]);

  // Unified Checkout Mutation combining student lookup/registration and order creation
  const checkoutMutation = useMutation({
    mutationFn: async (formData: any) => {
      // 1. Search for matching student by student ID code
      let studentId: number;
      const studentSearch = await studentService.findAll(1, 5, formData.studentCode);
      
      const existingStudent = studentSearch.data.find(
        (s) => s.studentCode.toLowerCase() === formData.studentCode.toLowerCase()
      );

      if (existingStudent) {
        studentId = existingStudent.id;
      } else {
        // 2. Automatically register new student frictionless
        const newStudent = await studentService.create({
          fullName: formData.fullName,
          studentCode: formData.studentCode,
          groupId: undefined // optional or null in database
        });
        studentId = newStudent.id;
        toast.info(`Created new Student ID record for ${formData.fullName}!`);
      }

      // 3. Create the Order
      const orderDetails = items.map((item) => ({
        cakeId: item.cake.id,
        quantity: item.quantity,
        price: item.cake.price,
      }));

      const order = await orderService.create({
        studentId,
        totalPrice: total,
        depositAmount: formData.depositAmount,
        orderDetails,
      });

      // 4. Create the Payment Record if bank transfer
      if (formData.paymentMethod === "TRANSFER" && order.id) {
        await paymentService.create({
          orderId: order.id,
          amount: formData.depositAmount,
          type: formData.depositType === "FULL" ? "FULL_PAYMENT" : "DEPOSIT",
        });
      }

      return order;
    },
    onSuccess: (order) => {
      toast.success("Order booked successfully! 🎂");
      clearCart();
      router.push(`/orders?trackId=${order.id}`);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to complete checkout. Please review your forms and try again.");
    },
  });

  const handleCheckoutSubmit = (data: any) => {
    checkoutMutation.mutate(data);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="font-semibold text-muted-foreground animate-pulse">Checking your basket session...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8 flex-grow">
      
      {/* Back button and page title */}
      <div className="flex flex-col gap-2.5">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
        <div className="flex items-center gap-2.5">
          <ShoppingBag className="h-7 w-7 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Cake Checkout</h1>
        </div>
      </div>

      {/* Checkout Form Component */}
      <CheckoutForm
        onSubmitSuccess={handleCheckoutSubmit}
        isPending={checkoutMutation.isPending}
      />
      
    </div>
  );
}
