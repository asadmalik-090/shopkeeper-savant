
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock repair data
const repairs = [
  {
    id: '1',
    customerName: 'Ali Hassan',
    phone: '0300-1234567',
    device: 'iPhone 13',
    issue: 'Broken screen',
    status: 'Completed',
    cost: 15000,
    receivedDate: new Date('2024-02-10'),
    completionDate: new Date('2024-02-12'),
  },
  {
    id: '2',
    customerName: 'Sara Khan',
    phone: '0321-9876543',
    device: 'Samsung Galaxy S23',
    issue: 'Battery replacement',
    status: 'In Progress',
    cost: 8000,
    receivedDate: new Date('2024-03-01'),
    completionDate: null,
  },
  {
    id: '3',
    customerName: 'Usman Ahmed',
    phone: '0333-5557777',
    device: 'Google Pixel 7',
    issue: 'Charging port damage',
    status: 'Pending',
    cost: 6000,
    receivedDate: new Date('2024-03-05'),
    completionDate: null,
  },
];

// Form schema for adding new repair
const repairFormSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  device: z.string().min(1, { message: "Device model is required" }),
  issue: z.string().min(1, { message: "Issue description is required" }),
  status: z.string().default("Pending"),
  cost: z.string().transform(val => parseInt(val, 10)).optional(),
});

const formatCurrency = (value: number) => {
  return `Rs. ${value.toLocaleString()}`;
};

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

const Repairs = () => {
  const [open, setOpen] = useState(false);
  const [repairData, setRepairData] = useState(repairs);

  const form = useForm<z.infer<typeof repairFormSchema>>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      device: "",
      issue: "",
      status: "Pending",
      cost: "",
    },
  });

  const onSubmit = (values: z.infer<typeof repairFormSchema>) => {
    const newRepair = {
      id: (repairData.length + 1).toString(),
      customerName: values.customerName,
      phone: values.phone,
      device: values.device,
      issue: values.issue,
      status: values.status,
      cost: values.cost ? values.cost : 0,
      receivedDate: new Date(),
      completionDate: null,
    };

    setRepairData([...repairData, newRepair]);
    setOpen(false);
    form.reset();
    toast.success("Repair ticket created successfully");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Repairs & Services</h1>
          <p className="text-muted-foreground">Manage device repairs and service tickets</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>New Repair Ticket</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Repair Ticket</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="device"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter device model" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="issue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the issue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Cost (Rs.)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Create Ticket</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repair Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={repairData}
            columns={[
              {
                header: "Customer",
                accessorKey: "customerName",
              },
              {
                header: "Phone",
                accessorKey: "phone",
              },
              {
                header: "Device",
                accessorKey: "device",
              },
              {
                header: "Issue",
                accessorKey: "issue",
              },
              {
                header: "Status",
                accessorKey: "status",
                cell: (row) => (
                  <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                    statusColors[row.status as keyof typeof statusColors]
                  }`}>
                    {row.status}
                  </div>
                ),
              },
              {
                header: "Cost",
                accessorKey: "cost",
                cell: (row) => formatCurrency(row.cost),
              },
              {
                header: "Received Date",
                accessorKey: "receivedDate",
                cell: (row) => row.receivedDate.toLocaleDateString(),
              },
              {
                header: "Completion Date",
                accessorKey: "completionDate",
                cell: (row) => row.completionDate ? row.completionDate.toLocaleDateString() : "—",
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Repairs;
