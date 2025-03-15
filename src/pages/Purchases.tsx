
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';

// Status badge colors
const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "Completed": "bg-green-100 text-green-800 hover:bg-green-200",
  "Cancelled": "bg-red-100 text-red-800 hover:bg-red-200"
};

// Form schema for adding new purchase
const purchaseFormSchema = z.object({
  supplierName: z.string().min(1, { message: "Supplier name is required" }),
  productName: z.string().min(1, { message: "Product name is required" }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }),
  unitPrice: z.coerce.number().min(1, { message: "Unit price must be at least 1" }),
  status: z.string().default("Pending"),
});

const Purchases = () => {
  const [open, setOpen] = useState(false);
  const { purchases, setPurchases } = useAppContext();
  
  const form = useForm<z.infer<typeof purchaseFormSchema>>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      supplierName: "",
      productName: "",
      quantity: 0,
      unitPrice: 0,
      status: "Pending",
    },
  });

  const onSubmit = (values: z.infer<typeof purchaseFormSchema>) => {
    const totalCost = values.quantity * values.unitPrice;
    
    const newPurchase = {
      id: (purchases.length + 1).toString(),
      productId: `prod-${Date.now()}`,
      productName: values.productName,
      supplierName: values.supplierName,
      quantity: values.quantity,
      cost: totalCost,
      status: values.status as "Pending" | "Completed" | "Cancelled",
      date: new Date(),
    };

    setPurchases([...purchases, newPurchase]);
    setOpen(false);
    form.reset();
    toast.success("Purchase order added successfully");
  };

  const updatePurchaseStatus = (id: string, newStatus: "Pending" | "Completed" | "Cancelled") => {
    const updatedPurchases = purchases.map(purchase => {
      if (purchase.id === id) {
        return { ...purchase, status: newStatus };
      }
      return purchase;
    });
    
    setPurchases(updatedPurchases);
    toast.success(`Purchase status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchases</h1>
          <p className="text-muted-foreground">Manage your inventory purchases and orders</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Purchase</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="supplierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter quantity" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price (Rs.)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter unit price" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Create Purchase Order</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={purchases}
            columns={[
              {
                header: "Product",
                accessorKey: "productName",
              },
              {
                header: "Supplier",
                accessorKey: "supplierName",
              },
              {
                header: "Quantity",
                accessorKey: "quantity",
              },
              {
                header: "Total Cost",
                accessorKey: "cost",
                cell: (info) => `Rs. ${(info.getValue() as number).toLocaleString()}`,
              },
              {
                header: "Date",
                accessorKey: "date",
                cell: (info) => new Date(info.getValue() as Date).toLocaleDateString(),
              },
              {
                header: "Status",
                accessorKey: "status",
                cell: (info) => (
                  <Badge className={statusColors[info.getValue() as keyof typeof statusColors]}>
                    {info.getValue() as string}
                  </Badge>
                ),
              },
            ]}
            actions={[
              {
                label: "Mark Completed",
                onClick: (purchase) => updatePurchaseStatus(purchase.id, "Completed"),
                showWhen: (purchase) => purchase.status === "Pending",
              },
              {
                label: "Cancel Order",
                onClick: (purchase) => updatePurchaseStatus(purchase.id, "Cancelled"),
                showWhen: (purchase) => purchase.status === "Pending",
              },
            ]}
            searchPlaceholder="Search purchases..."
            searchKeys={["productName", "supplierName"]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Purchases;
