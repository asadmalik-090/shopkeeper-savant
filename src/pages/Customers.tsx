
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
import { Edit, Trash, Plus, Save } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

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
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  const { 
    customers, 
    setCustomers, 
    sales, 
    products,
    addAction,
    canUndo,
    canRedo,
    undo,
    redo
  } = useAppContext();

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

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setEditingCustomer(null);
      form.reset({
        name: "",
        phone: "",
        email: "",
        cnic: "",
        address: "",
      });
    }
  }, [open, form]);

  // Set form values when editing
  React.useEffect(() => {
    if (editingCustomer) {
      form.reset({
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        email: editingCustomer.email || "",
        cnic: editingCustomer.cnic || "",
        address: editingCustomer.address || "",
      });
    }
  }, [editingCustomer, form]);

  const onSubmit = (values: z.infer<typeof customerFormSchema>) => {
    if (editingCustomer) {
      // Update existing customer
      const updatedCustomer = {
        ...editingCustomer,
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        cnic: values.cnic || undefined,
        address: values.address || undefined,
        updatedAt: new Date(),
      };

      const updatedCustomers = customers.map(c => 
        c.id === editingCustomer.id ? updatedCustomer : c
      );
      
      setCustomers(updatedCustomers);
      
      // Record action for undo/redo
      addAction({
        type: 'UPDATE_CUSTOMER',
        customer: updatedCustomer,
        previousCustomer: editingCustomer
      });
      
      toast.success("Customer updated successfully");
    } else {
      // Add new customer
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
      
      // Record action for undo/redo
      addAction({
        type: 'ADD_CUSTOMER',
        customer: newCustomer
      });
      
      toast.success("Customer added successfully");
    }

    setOpen(false);
    form.reset();
  };

  const handleDelete = (customer: any) => {
    // Record action for undo/redo
    addAction({
      type: 'DELETE_CUSTOMER',
      customer
    });
    
    setCustomers(customers.filter(c => c.id !== customer.id));
    toast.success("Customer deleted successfully");
  };

  const openPurchaseHistory = (customer: any) => {
    setSelectedCustomer(customer);
    setPurchaseDialogOpen(true);
  };

  const getCustomerPurchases = (customerId: string) => {
    return sales.filter(sale => sale.customerId === customerId);
  };

  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <div className="flex gap-2">
          {canUndo && (
            <Button variant="outline" onClick={undo}>
              Undo
            </Button>
          )}
          {canRedo && (
            <Button variant="outline" onClick={redo}>
              Redo
            </Button>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </DialogTitle>
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
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {editingCustomer ? "Update Customer" : "Add Customer"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
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
                cell: ({ getValue }) => getValue() || "—",
              },
              {
                header: "Email",
                accessorKey: "email",
                cell: ({ getValue }) => getValue() || "—",
              },
              {
                header: "Address",
                accessorKey: "address",
                cell: ({ getValue }) => getValue() || "—",
              },
              {
                header: "Customer Since",
                accessorKey: "createdAt",
                cell: ({ getValue }) => {
                  const date = getValue() as Date;
                  return date.toLocaleDateString();
                },
              },
            ]}
            actions={[
              {
                label: "Edit",
                onClick: (customer) => {
                  setEditingCustomer(customer);
                  setOpen(true);
                },
                icon: <Edit className="h-4 w-4" />,
              },
              {
                label: "Delete",
                onClick: (customer) => handleDelete(customer),
                icon: <Trash className="h-4 w-4" />,
              },
              {
                label: "View Purchases",
                onClick: (customer) => openPurchaseHistory(customer),
                icon: <Plus className="h-4 w-4" />,
              },
            ]}
            searchKeys={["name", "phone", "email"]}
            searchPlaceholder="Search customers..."
          />
        </CardContent>
      </Card>

      {/* Customer Purchase History Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer?.name}'s Purchase History
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedCustomer && getCustomerPurchases(selectedCustomer.id).length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Specifications</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCustomerPurchases(selectedCustomer.id).map((purchase) => {
                    const product = getProductDetails(purchase.productId);
                    return (
                      <TableRow key={purchase.id}>
                        <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                        <TableCell>{purchase.productName}</TableCell>
                        <TableCell>
                          {product && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">View Specs</Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Product Details</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-muted-foreground">Brand:</span>
                                    <span>{product.brand}</span>
                                    
                                    <span className="text-muted-foreground">Model:</span>
                                    <span>{product.model}</span>
                                    
                                    <span className="text-muted-foreground">Type:</span>
                                    <span className="capitalize">{product.type}</span>
                                    
                                    {product.imei && (
                                      <>
                                        <span className="text-muted-foreground">IMEI:</span>
                                        <span>{product.imei}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </TableCell>
                        <TableCell>{purchase.quantity}</TableCell>
                        <TableCell>Rs. {purchase.price.toLocaleString()}</TableCell>
                        <TableCell className="capitalize">{purchase.paymentMethod}</TableCell>
                        <TableCell className="capitalize">{purchase.status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No purchase history found for this customer.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
