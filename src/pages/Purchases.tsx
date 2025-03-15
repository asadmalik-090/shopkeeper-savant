
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock purchase data
const purchases = [
  {
    id: '1',
    supplierName: 'Smartphone Wholesalers',
    productName: 'iPhone 15 Pro',
    quantity: 10,
    unitPrice: 95000,
    totalAmount: 950000,
    date: new Date('2024-02-15'),
    status: 'Completed',
  },
  {
    id: '2',
    supplierName: 'Mobile Accessories Ltd',
    productName: 'Samsung Galaxy S24',
    quantity: 8,
    unitPrice: 80000,
    totalAmount: 640000,
    date: new Date('2024-02-20'),
    status: 'Completed',
  },
  {
    id: '3',
    supplierName: 'Tech Components Inc',
    productName: 'Google Pixel 8',
    quantity: 5,
    unitPrice: 70000,
    totalAmount: 350000,
    date: new Date('2024-03-01'),
    status: 'Pending',
  },
];

// Form schema for adding new purchase
const purchaseFormSchema = z.object({
  supplierName: z.string().min(1, { message: "Supplier name is required" }),
  productName: z.string().min(1, { message: "Product name is required" }),
  quantity: z.string().transform(val => parseInt(val, 10)),
  unitPrice: z.string().transform(val => parseInt(val, 10)),
  status: z.string().default("Pending"),
});

const formatCurrency = (value: number) => {
  return `Rs. ${value.toLocaleString()}`;
};

const Purchases = () => {
  const [open, setOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState(purchases);

  const form = useForm<z.infer<typeof purchaseFormSchema>>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      supplierName: "",
      productName: "",
      quantity: "",
      unitPrice: "",
      status: "Pending",
    },
  });

  const onSubmit = (values: z.infer<typeof purchaseFormSchema>) => {
    const totalAmount = values.quantity * values.unitPrice;
    
    const newPurchase = {
      id: (purchaseData.length + 1).toString(),
      supplierName: values.supplierName,
      productName: values.productName,
      quantity: values.quantity,
      unitPrice: values.unitPrice,
      totalAmount,
      date: new Date(),
      status: values.status,
    };

    setPurchaseData([...purchaseData, newPurchase]);
    setOpen(false);
    form.reset();
    toast.success("Purchase added successfully");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchases</h1>
          <p className="text-muted-foreground">Manage your inventory purchases</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add New Purchase</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Purchase</DialogTitle>
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
                          <Input type="number" placeholder="0" {...field} />
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
                        <FormLabel>Unit Price (Rs)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">Add Purchase</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={purchaseData}
            columns={[
              {
                header: "Supplier",
                accessorKey: "supplierName",
              },
              {
                header: "Product",
                accessorKey: "productName",
              },
              {
                header: "Quantity",
                accessorKey: "quantity",
              },
              {
                header: "Unit Price",
                accessorKey: "unitPrice",
                cell: (row) => formatCurrency(row.unitPrice),
              },
              {
                header: "Total Amount",
                accessorKey: "totalAmount",
                cell: (row) => formatCurrency(row.totalAmount),
              },
              {
                header: "Date",
                accessorKey: "date",
                cell: (row) => row.date.toLocaleDateString(),
              },
              {
                header: "Status",
                accessorKey: "status",
                cell: (row) => (
                  <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                    row.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {row.status}
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Purchases;
