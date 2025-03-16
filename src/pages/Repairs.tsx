
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
import { PriceInput } from '@/components/ui/price-input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';

const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "In Progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "Completed": "bg-green-100 text-green-800 hover:bg-green-200",
  "Delivered": "bg-purple-100 text-purple-800 hover:bg-purple-200",
  "Cancelled": "bg-red-100 text-red-800 hover:bg-red-200"
};

const repairFormSchema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  device: z.string().min(1, { message: "Device model is required" }),
  issue: z.string().min(1, { message: "Issue description is required" }),
  status: z.enum(["Pending", "In Progress", "Completed", "Delivered", "Cancelled"]).default("Pending"),
  cost: z.coerce.number().min(0).optional(),
});

const formatCurrency = (value: number) => {
  return `Rs. ${value.toLocaleString()}`;
};

const Repairs = () => {
  const [open, setOpen] = useState(false);
  const { repairs, setRepairs } = useAppContext();
  
  const form = useForm<z.infer<typeof repairFormSchema>>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      device: "",
      issue: "",
      status: "Pending",
      cost: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof repairFormSchema>) => {
    const newRepair = {
      id: (repairs.length + 1).toString(),
      customerName: values.customerName,
      phone: values.phone,
      device: values.device,
      issue: values.issue,
      status: values.status,
      cost: values.cost || 0,
      receivedDate: new Date(),
      completionDate: null,
    };

    setRepairs([...repairs, newRepair]);
    setOpen(false);
    form.reset();
    toast.success("Repair ticket added successfully");
  };

  const updateRepairStatus = (id: string, newStatus: "Pending" | "In Progress" | "Completed" | "Delivered" | "Cancelled") => {
    const updatedRepairs = repairs.map(repair => {
      if (repair.id === id) {
        const updated = { 
          ...repair, 
          status: newStatus,
          completionDate: (newStatus === "Completed" || newStatus === "Delivered") ? new Date() : repair.completionDate
        };
        return updated;
      }
      return repair;
    });
    
    setRepairs(updatedRepairs);
    toast.success(`Repair status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Repairs</h1>
          <p className="text-muted-foreground">Manage repair tickets and service requests</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Repair Ticket</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
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
                        <Input placeholder="Enter contact number" {...field} />
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
                        <Input placeholder="Enter device model/make" {...field} />
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
                        <Textarea 
                          placeholder="Describe the issue in detail" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
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
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
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
                        <FormLabel>Estimated Cost</FormLabel>
                        <FormControl>
                          <PriceInput
                            placeholder="Enter estimated cost"
                            value={field.value || 0}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">Create Repair Ticket</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Repair Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={repairs}
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
                cell: (info) => (
                  <div className="max-w-[200px] truncate" title={info.getValue() as string}>
                    {info.getValue() as string}
                  </div>
                ),
              },
              {
                header: "Received",
                accessorKey: "receivedDate",
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
              {
                header: "Cost",
                accessorKey: "cost",
                cell: (info) => formatCurrency(info.getValue() as number),
              },
            ]}
            actions={[
              {
                label: "Mark In Progress",
                onClick: (repair) => updateRepairStatus(repair.id, "In Progress"),
                showWhen: (repair) => repair.status === "Pending",
              },
              {
                label: "Mark Completed",
                onClick: (repair) => updateRepairStatus(repair.id, "Completed"),
                showWhen: (repair) => repair.status === "In Progress",
              },
              {
                label: "Mark Delivered",
                onClick: (repair) => updateRepairStatus(repair.id, "Delivered"),
                showWhen: (repair) => repair.status === "Completed",
              },
              {
                label: "Cancel Repair",
                onClick: (repair) => updateRepairStatus(repair.id, "Cancelled"),
                showWhen: (repair) => ["Pending", "In Progress"].includes(repair.status),
              },
            ]}
            searchPlaceholder="Search repairs..."
            searchKeys={["customerName", "phone", "device", "issue"]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Repairs;
