"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { OrderTimeline } from "@/components/checkout/OrderTimeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Receipt, Phone, User, Calendar, CircleDot } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

function OrdersTrackingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trackIdParam = searchParams?.get("trackId");

  const [searchCode, setSearchCode] = useState("");
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

  useEffect(() => {
    if (trackIdParam) {
      setActiveTrackId(Number(trackIdParam));
    }
  }, [trackIdParam]);

  // Fetch specific order details if activeTrackId is set
  const { data: order, isLoading: isOrderLoading, error: orderError } = useQuery({
    queryKey: ["order-track", activeTrackId],
    queryFn: () => orderService.findOne(activeTrackId!),
    enabled: !!activeTrackId,
  });

  // Query order history matching search code (looks up by Student Code or Order ID)
  const { data: matchedOrders, isLoading: isSearchLoading } = useQuery({
    queryKey: ["orders-lookup", searchCode],
    queryFn: () => orderService.findAll(1, 10, searchCode),
    enabled: searchCode.length > 2,
  });

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      // If it looks like a number, try to track it directly
      if (!isNaN(Number(searchCode))) {
        setActiveTrackId(Number(searchCode));
        router.push(`/orders?trackId=${searchCode}`);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8 flex-grow max-w-4xl">
      
      {/* Page Title */}
      <div className="space-y-1.5 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Track Your Booking</h1>
        <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto">
          Enter your Order ID or search by Student Code/Name to instantly track cake details, deposits, and delivery steps.
        </p>
      </div>

      {/* Tracker Lookup controls */}
      <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
        <CardContent className="p-5">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                type="text"
                placeholder="Enter Order ID (e.g. 5) or Student ID to search..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="pl-10 rounded-xl border-border/60"
              />
            </div>
            <Button type="submit" className="rounded-xl font-bold px-6 shadow-md shadow-primary/10 shrink-0">
              Track Order
            </Button>
          </form>

          {/* Instant Search Results Dropdown */}
          {searchCode.length > 2 && (
            <div className="mt-3.5 border border-border/50 rounded-xl overflow-hidden divide-y divide-border/40 bg-card animate-in fade-in duration-200">
              {isSearchLoading ? (
                <p className="p-4 text-xs font-bold text-center text-muted-foreground animate-pulse">Searching booking records...</p>
              ) : matchedOrders?.data.length === 0 ? (
                <p className="p-4 text-xs font-bold text-center text-muted-foreground">No bookings matched your query.</p>
              ) : (
                matchedOrders?.data.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      setActiveTrackId(o.id);
                      setSearchCode("");
                      router.push(`/orders?trackId=${o.id}`);
                    }}
                    className="p-3.5 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors text-sm"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-foreground">Order #{o.id} - ${o.totalPrice.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground font-semibold">
                        Student: {o.student?.fullName} ({o.student?.studentCode})
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg font-black tracking-wide text-[10px] uppercase">
                      {o.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading state for single order */}
      {isOrderLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-44 w-full bg-muted/30 rounded-2xl border border-border/40" />
          <div className="h-64 w-full bg-muted/30 rounded-2xl border border-border/40" />
        </div>
      )}

      {/* Main Order Details Display */}
      {order && !isOrderLoading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Order Meta Header Card */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              
              {/* Order Timeline Visual component */}
              <OrderTimeline status={order.status} updatedAt={order.updatedAt} />

              {/* Order Items Table Card */}
              <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
                <CardHeader className="border-b border-border/40 pb-4">
                  <CardTitle className="text-base font-extrabold flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" /> Cake Details & Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/30">
                    {order.orderDetails.map((item) => (
                      <div key={item.id} className="p-4.5 flex justify-between items-center text-sm">
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground">{item.cake.cakeName}</p>
                          <p className="text-xs text-muted-foreground font-semibold">
                            {item.cake.pound} LB variety &times; {item.quantity} Qty
                          </p>
                        </div>
                        <span className="font-extrabold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="p-5 bg-muted/10 border-t border-border/40 rounded-b-2xl space-y-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-foreground">${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deposit Paid</span>
                      <span className="text-amber-600">${order.depositAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black pt-3 border-t border-border/30">
                      <span className="text-foreground">Remaining balance</span>
                      <span className="text-primary">${order.remainingAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Owner Sidebar Card */}
            <div>
              <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
                <CardHeader className="border-b border-border/40 pb-4.5">
                  <CardTitle className="text-sm font-extrabold text-foreground">Customer Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 text-xs font-semibold text-muted-foreground">
                  
                  <div className="flex items-start gap-3">
                    <User className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-wider">Booked For</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{order.student?.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CircleDot className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-wider">Student ID / Code</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{order.student?.studentCode}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-wider">Order Placed On</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                      </p>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Fallback empty visual */}
      {!order && !isOrderLoading && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border-2 border-dashed border-border/50 bg-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary/40 mb-4">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Waiting for Tracking Input</h3>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xs font-semibold leading-relaxed">
            Please type your Order ID in the tracker bar above or search by Student Code/Name to reveal booking history.
          </p>
        </div>
      )}

    </div>
  );
}

import { Suspense } from "react";

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-20 text-center animate-pulse font-bold text-muted-foreground">
        Loading tracking system...
      </div>
    }>
      <OrdersTrackingPage />
    </Suspense>
  );
}
