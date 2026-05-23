"use client";

import { OrderStatus } from "@/types/order";
import { CheckCircle2, Circle, Clock, Flame, Truck, XCircle } from "lucide-react";

interface OrderTimelineProps {
  status: OrderStatus;
  updatedAt?: string;
}

export function OrderTimeline({ status, updatedAt }: OrderTimelineProps) {
  const steps = [
    {
      key: OrderStatus.PENDING,
      label: "Pending Booking",
      desc: "Order created, waiting for payment/slip verification.",
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      key: OrderStatus.DEPOSITED,
      label: "Deposit Paid",
      desc: "Minimum deposit verified. Cake preparation started in the kitchen.",
      icon: Flame,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    },
    {
      key: OrderStatus.PAID,
      label: "Fully Paid",
      desc: "Balance cleared. Cake package ready and loaded for dispatch.",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      key: OrderStatus.DELIVERED,
      label: "Delivered",
      desc: "Cake successfully handed over to the student/customer.",
      icon: Truck,
      color: "text-primary bg-primary/10 border-primary/20",
    },
  ];

  // Find the index of the current status
  const currentStepIndex = steps.findIndex((step) => step.key === status);
  const isCancelled = status === OrderStatus.CANCELLED;

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-6 sm:p-7 shadow-sm">
      <h3 className="text-base font-extrabold text-foreground mb-6">Booking Tracking Status</h3>

      {isCancelled ? (
        <div className="flex items-center gap-4 border border-destructive/20 bg-destructive/5 p-4 rounded-xl text-destructive">
          <XCircle className="h-6 w-6 shrink-0 animate-pulse" />
          <div>
            <h4 className="text-sm font-bold">Order Cancelled</h4>
            <p className="text-xs font-semibold text-destructive/80 mt-0.5">This booking has been cancelled and refunded.</p>
          </div>
        </div>
      ) : (
        <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isActive = index === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="relative flex gap-4 items-start group">
                {/* Visual Circle Indicator */}
                <div
                  className={`absolute -left-[23px] top-1 flex h-[24px] w-[24px] items-center justify-center rounded-full border transition-all z-10 ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "bg-card border-border/70 text-muted-foreground/40 group-hover:border-border"
                  } ${isActive ? "animate-pulse scale-110" : ""}`}
                >
                  <StepIcon className="h-3 w-3" />
                </div>

                {/* Text Content */}
                <div className="space-y-1 select-none flex-grow">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-bold tracking-tight transition-colors ${
                        isCompleted ? "text-foreground" : "text-muted-foreground/60"
                      } ${isActive ? "text-primary font-black" : ""}`}
                    >
                      {step.label}
                    </h4>
                    {isActive && (
                      <span className="animate-pulse rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary uppercase">
                        Current Step
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs leading-relaxed font-semibold transition-colors ${
                      isCompleted ? "text-muted-foreground" : "text-muted-foreground/40"
                    }`}
                  >
                    {step.desc}
                  </p>
                  {isActive && updatedAt && (
                    <span className="inline-block text-[10px] font-bold text-muted-foreground bg-muted/30 border border-border/40 px-2 py-0.5 rounded-lg mt-1">
                      Updated at: {new Date(updatedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
