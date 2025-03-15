
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '@/context/AppContext';

// Form schema for adding new customer
const customerFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Valid email is required" }).optional().or(z.literal('')),
  cnic: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

const Customers = () => {
  const [open, setOpen] = useState(false);
  const { customers, setCustomers } = useAppContext();

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      cnic: "",
      address: "",
    },
  });

  const onSubmit = (values: z.infer<typeof customerFormSchema>) => {
    const newCustomer = {
      id: (customers.length + 1).toString(),
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      cnic: values.cnic || undefined,
      address: values.address || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCustomers([...customers, newCustomer]);
    setOpen(false);
    form.reset();
    toast.success("Customer added successfully");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Customer</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cnic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNIC (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter CNIC number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Add Customer</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={customers}
            columns={[
              {
                header: "Name",
                accessorKey: "name",
              },
              {
                header: "Phone",
                accessorKey: "phone",
              },
              {
                header: "CNIC",
                accessorKey: "cnic",
                cell: (row) => row.cnic || "—",
              },
              {
                header: "Email",
                accessorKey: "email",
                cell: (row) => row.email || "—",
              },
              {
                header: "Address",
                accessorKey: "address",
                cell: (row) => row.address || "—",
              },
              {
                header: "Customer Since",
                accessorKey: "createdAt",
                cell: (row) => row.createdAt.toLocaleDateString(),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
