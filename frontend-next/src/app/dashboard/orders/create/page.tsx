"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { studentService } from "@/services/api/students";
import { cakeService } from "@/services/api/cakes";
import { orderService } from "@/services/api/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { Trash, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { OrderDto } from "@/types/order";

export default function CreateOrderPage() {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [items, setItems] = useState<{ cakeId: number; quantity: number }[]>([]);
  const [deposit, setDeposit] = useState(0);

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentService.findAll(1, 1000),
  });

  const { data: cakes } = useQuery({
    queryKey: ["cakes"],
    queryFn: () => cakeService.findAll(1, 100),
  });

  const createMutation = useMutation({
    mutationFn: (data: OrderDto) => orderService.create(data),
    onSuccess: () => {
      toast.success("Order created successfully");
      router.push("/dashboard/orders");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Failed to create order");
    },
  });

  const addItem = () => {
    setItems([...items, { cakeId: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: "cakeId" | "quantity", value: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      const cake = cakes?.data.find((c) => c.id === item.cakeId);
      return acc + (cake?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = () => {
    if (!selectedStudent) return toast.error("Please select a student");
    if (items.length === 0) return toast.error("Please add at least one cake");
    if (items.some(i => i.cakeId === 0)) return toast.error("Please select a cake for all items");

    const totalPrice = calculateTotal();
    
    const orderDetails = items.map(item => {
      const cake = cakes?.data.find(c => c.id === item.cakeId);
      return {
        cakeId: item.cakeId,
        quantity: item.quantity,
        price: cake?.price || 0
      };
    });

    createMutation.mutate({
      studentId: Number(selectedStudent),
      totalPrice: totalPrice,
      depositAmount: deposit,
      orderDetails: orderDetails,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Student</Label>
              <Combobox
                options={students?.data.map(s => ({ value: s.id.toString(), label: `${s.fullName} (${s.studentCode})` })) || []}
                value={selectedStudent}
                onChange={setSelectedStudent}
                placeholder="Select student..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Selected Cakes</Label>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="flex items-end gap-4 border p-4 rounded-lg bg-muted/30">
                  <div className="flex-1 space-y-2">
                    <Label>Cake Variety</Label>
                    <Combobox
                      options={cakes?.data.map(c => ({ value: c.id.toString(), label: `${c.cakeName} ($${c.price})` })) || []}
                      value={item.cakeId.toString()}
                      onChange={(val) => updateItem(index, "cakeId", Number(val))}
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                    />
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => removeItem(index)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {items.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                  No items added yet. Click &quot;Add Item&quot; to begin.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total Price:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              <Label>Deposit Amount</Label>
              <Input
                type="number"
                min="0"
                max={calculateTotal()}
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between text-destructive font-bold pt-2 border-t">
              <span>Remaining:</span>
              <span>${(calculateTotal() - deposit).toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Processing..." : "Confirm Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
