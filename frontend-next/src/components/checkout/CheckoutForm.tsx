"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { UploadCloud, CreditCard, ShoppingBag, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  studentCode: z.string().min(4, "Student Code must be at least 4 characters"),
  contactNumber: z.string().min(9, "Valid phone number is required"),
  depositType: z.enum(["DEPOSIT", "FULL"]),
  paymentMethod: z.enum(["TRANSFER", "CASH"]),
  depositAmount: z.number().min(0, "Deposit cannot be negative"),
});

type CheckoutInput = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmitSuccess: (data: CheckoutInput) => void;
  isPending: boolean;
}

export function CheckoutForm({ onSubmitSuccess, isPending }: CheckoutFormProps) {
  const { getTotalPrice } = useCartStore();
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const total = getTotalPrice();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      studentCode: "",
      contactNumber: "",
      depositType: "FULL",
      paymentMethod: "TRANSFER",
      depositAmount: total,
    },
  });

  const depositType = watch("depositType");
  const paymentMethod = watch("paymentMethod");
  const depositAmount = watch("depositAmount");

  const handleDepositTypeChange = (type: "DEPOSIT" | "FULL") => {
    setValue("depositType", type);
    if (type === "FULL") {
      setValue("depositAmount", total);
    } else {
      // Default to 30% deposit
      setValue("depositAmount", Math.round(total * 0.3));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlipFile(e.target.files[0]);
      toast.success("Payment slip uploaded successfully!");
    }
  };

  const onFormSubmit = (data: CheckoutInput) => {
    if (data.paymentMethod === "TRANSFER" && !slipFile) {
      toast.error("Please upload a bank payment slip!");
      return;
    }
    if (data.depositType === "DEPOSIT" && data.depositAmount >= total) {
      toast.error("Deposit amount must be less than the total price!");
      return;
    }
    if (data.depositAmount <= 0) {
      toast.error("Payment amount must be greater than 0!");
      return;
    }
    onSubmitSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Booking Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl border border-border/50 shadow-sm bg-card">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" /> Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs font-bold text-muted-foreground uppercase">Student Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    {...register("fullName")}
                    className="rounded-xl border-border/60"
                  />
                  {errors.fullName && <p className="text-xs font-semibold text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentCode" className="text-xs font-bold text-muted-foreground uppercase">Student ID / Code</Label>
                  <Input
                    id="studentCode"
                    placeholder="STD-2026-001"
                    {...register("studentCode")}
                    className="rounded-xl border-border/60"
                  />
                  {errors.studentCode && <p className="text-xs font-semibold text-destructive">{errors.studentCode.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="text-xs font-bold text-muted-foreground uppercase">Contact Number</Label>
                <Input
                  id="contactNumber"
                  placeholder="0812345678"
                  {...register("contactNumber")}
                  className="rounded-xl border-border/60"
                />
                {errors.contactNumber && <p className="text-xs font-semibold text-destructive">{errors.contactNumber.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms Selector */}
          <Card className="rounded-2xl border border-border/50 shadow-sm bg-card">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Payment Method Selector */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Select Payment Mode</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setValue("paymentMethod", "TRANSFER")}
                    className={`cursor-pointer rounded-2xl border p-4.5 flex flex-col items-center justify-center gap-2.5 transition-all text-center ${
                      paymentMethod === "TRANSFER"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-md shadow-primary/5"
                        : "border-border/60 hover:bg-muted/10 text-muted-foreground font-semibold"
                    }`}
                  >
                    <UploadCloud className="h-6 w-6" />
                    <span className="text-sm">Bank Transfer</span>
                  </div>
                  <div
                    onClick={() => setValue("paymentMethod", "CASH")}
                    className={`cursor-pointer rounded-2xl border p-4.5 flex flex-col items-center justify-center gap-2.5 transition-all text-center ${
                      paymentMethod === "CASH"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-md shadow-primary/5"
                        : "border-border/60 hover:bg-muted/10 text-muted-foreground font-semibold"
                    }`}
                  >
                    <ShoppingBag className="h-6 w-6" />
                    <span className="text-sm">Cash on Counter</span>
                  </div>
                </div>
              </div>

              {/* Deposit Type Selector */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Payment Amount</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => handleDepositTypeChange("FULL")}
                    className={`cursor-pointer rounded-2xl border p-4 flex items-center justify-between transition-all ${
                      depositType === "FULL"
                        ? "border-primary bg-primary/5 font-bold text-primary shadow-sm"
                        : "border-border/60 hover:bg-muted/10 text-muted-foreground font-semibold"
                    }`}
                  >
                    <span className="text-sm">Pay In Full</span>
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-black">${total.toFixed(2)}</span>
                  </div>
                  <div
                    onClick={() => handleDepositTypeChange("DEPOSIT")}
                    className={`cursor-pointer rounded-2xl border p-4 flex items-center justify-between transition-all ${
                      depositType === "DEPOSIT"
                        ? "border-primary bg-primary/5 font-bold text-primary shadow-sm"
                        : "border-border/60 hover:bg-muted/10 text-muted-foreground font-semibold"
                    }`}
                  >
                    <span className="text-sm">Pay Deposit</span>
                    <span className="text-xs bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-full font-black">Min 30%</span>
                  </div>
                </div>
              </div>

              {/* Deposit Custom input if DEPOSIT */}
              {depositType === "DEPOSIT" && (
                <div className="space-y-2 max-w-xs animate-in fade-in duration-200">
                  <Label htmlFor="depositAmount" className="text-xs font-bold text-muted-foreground uppercase">Custom Deposit Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">$</span>
                    <Input
                      id="depositAmount"
                      type="number"
                      min={Math.round(total * 0.3)}
                      max={total - 1}
                      {...register("depositAmount", { valueAsNumber: true })}
                      className="pl-7 rounded-xl border-border/60 font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    Minimum deposit required: ${(total * 0.3).toFixed(2)} (30% of total)
                  </p>
                  {errors.depositAmount && <p className="text-xs font-semibold text-destructive">{errors.depositAmount.message}</p>}
                </div>
              )}

              {/* Upload Slip Container if Bank Transfer */}
              {paymentMethod === "TRANSFER" && (
                <div className="space-y-3.5 border-t border-border/40 pt-5 animate-in fade-in duration-300">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Bank Transfer Details</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Please transfer to: **Siam Commercial Bank | 123-456789-0 (CakeHub Bakery)**</p>
                  </div>
                  <div className="border-2 border-dashed border-border/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-muted/10 cursor-pointer relative hover:bg-muted/20 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                    {slipFile ? (
                      <span className="text-sm font-bold text-primary truncate max-w-[280px]">
                        📄 {slipFile.name} (Change file)
                      </span>
                    ) : (
                      <>
                        <span className="text-sm font-bold text-foreground">Click to upload payment slip image</span>
                        <span className="text-xs text-muted-foreground mt-1 font-semibold">PNG, JPG or JPEG up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Side Checkout Summary panel */}
        <div>
          <Card className="sticky top-24 rounded-2xl border border-border/50 bg-card shadow-lg overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 py-4.5">
              <CardTitle className="text-base font-extrabold text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3.5 text-sm font-semibold border-b border-border/30 pb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Cake Items Total</span>
                  <span className="text-foreground">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>To Pay Today</span>
                  <span className="text-primary font-black">${Number(depositAmount || total).toFixed(2)}</span>
                </div>
                {depositType === "DEPOSIT" && (
                  <div className="flex justify-between text-muted-foreground text-xs bg-amber-500/10 text-amber-600 px-3 py-2 rounded-xl border border-amber-500/20 font-bold">
                    <span>Remaining Balance</span>
                    <span>${(total - Number(depositAmount || 0)).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/40">
                <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0" />
                <span>SSL Encrypted transaction. CakeHub guarantees absolute booking security.</span>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl py-6 font-bold text-sm shadow-xl shadow-primary/10 transition-transform active:scale-[0.99]"
              >
                {isPending ? "Booking in progress..." : "Confirm Cake Booking"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
}
