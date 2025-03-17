
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Edit, Save, Trash, Plus, Search, Undo, Redo } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const formatCurrency = (value: number) => {
  return `Rs. ${value.toLocaleString()}`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

const saleFormSchema = z.object({
  productId: z.string().min(1, { message: "Product is required" }),
  customerId: z.string().optional(),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  paymentMethod: z.enum(['cash', 'bank', 'easypaisa', 'jazzcash', 'other']),
});

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  
  const { 
    sales, 
    setSales, 
    products, 
    customers, 
    setProducts,
    addAction,
    canUndo,
    canRedo,
    undo,
    redo
  } = useAppContext();
  
  const form = useForm<z.infer<typeof saleFormSchema>>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      productId: "",
      customerId: "",
      quantity: 1,
      paymentMethod: "cash",
    },
  });

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setEditingSale(null);
      form.reset({
        productId: "",
        customerId: "",
        quantity: 1,
        paymentMethod: "cash",
      });
    }
  }, [open, form]);

  // Set form values when editing
  React.useEffect(() => {
    if (editingSale) {
      form.reset({
        productId: editingSale.productId,
        customerId: editingSale.customerId || "",
        quantity: editingSale.quantity,
        paymentMethod: editingSale.paymentMethod,
      });
    }
  }, [editingSale, form]);

  const salesData = React.useMemo(() => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const salesByDay: Record<string, { date: string; sales: number; count: number }> = {};
    
    sales.forEach(sale => {
      if (sale.date >= last30Days) {
        const dateStr = formatDate(sale.date);
        if (salesByDay[dateStr]) {
          salesByDay[dateStr].sales += sale.price;
          salesByDay[dateStr].count += 1;
        } else {
          salesByDay[dateStr] = { date: dateStr, sales: sale.price, count: 1 };
        }
      }
    });
    
    return Object.values(salesByDay).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [sales]);

  const filteredSales = React.useMemo(() => {
    if (!searchTerm.trim()) return sales;
    
    const searchLower = searchTerm.toLowerCase();
    return sales.filter(sale => 
      (sale.productName.toLowerCase().includes(searchLower)) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(searchLower)) ||
      (sale.paymentMethod.toLowerCase().includes(searchLower))
    );
  }, [searchTerm, sales]);

  const onSubmit = (values: z.infer<typeof saleFormSchema>) => {
    const product = products.find(p => p.id === values.productId);
    
    if (!product) {
      toast.error("Product not found");
      return;
    }
    
    if (product.stock < values.quantity) {
      toast.error("Not enough stock available");
      return;
    }
    
    const customer = values.customerId 
      ? customers.find(c => c.id === values.customerId) 
      : null;
    
    const totalPrice = product.price * values.quantity;
    const totalCost = product.cost * values.quantity;
    
    if (editingSale) {
      // Restore original product stock
      const originalProduct = products.find(p => p.id === editingSale.productId);
      if (originalProduct) {
        const updatedProducts = products.map(p => {
          if (p.id === originalProduct.id) {
            return { ...p, stock: p.stock + editingSale.quantity };
          }
          return p;
        });
        
        // Then update with new values
        const finalProducts = updatedProducts.map(p => {
          if (p.id === product.id) {
            return { ...p, stock: p.stock - values.quantity };
          }
          return p;
        });
        
        setProducts(finalProducts);
      }
      
      // Update the sale
      const updatedSale = {
        ...editingSale,
        productId: values.productId,
        productName: product.name,
        customerId: values.customerId || undefined,
        customerName: customer ? customer.name : undefined,
        quantity: values.quantity,
        price: totalPrice,
        cost: totalCost,
        profit: totalPrice - totalCost,
        paymentMethod: values.paymentMethod,
        status: editingSale.status as "completed" | "pending" | "cancelled", // Use the existing status
        updatedAt: new Date(),
      };
      
      const updatedSales = sales.map(s => 
        s.id === editingSale.id ? updatedSale : s
      );
      
      setSales(updatedSales);
      
      // Record action for undo/redo
      addAction({
        type: 'UPDATE_SALE',
        sale: updatedSale,
        previousSale: editingSale,
        productStock: {
          id: product.id,
          before: product.stock,
          after: product.stock - values.quantity
        }
      });
      
      toast.success("Sale updated successfully");
    } else {
      // Create new sale
      const newSale = {
        id: (sales.length + 1).toString(),
        productId: values.productId,
        productName: product.name,
        customerId: values.customerId || undefined,
        customerName: customer ? customer.name : undefined,
        quantity: values.quantity,
        price: totalPrice,
        cost: totalCost,
        profit: totalPrice - totalCost,
        paymentMethod: values.paymentMethod,
        status: "completed" as "completed" | "pending" | "cancelled", // Explicitly set status as a literal type
        date: new Date(),
      };
      
      setSales([...sales, newSale]);
      
      // Update product stock
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, stock: p.stock - values.quantity };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      
      // Record action for undo/redo
      addAction({
        type: 'ADD_SALE',
        sale: newSale,
        productStock: {
          id: product.id,
          before: product.stock,
          after: product.stock - values.quantity
        }
      });
      
      toast.success("Sale recorded successfully");
    }
    
    setOpen(false);
    form.reset();
  };

  const handleDelete = (sale: any) => {
    // Restore product stock
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      const updatedProducts = products.map(p => {
        if (p.id === sale.productId) {
          return { ...p, stock: p.stock + sale.quantity };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      
      // Record action for undo/redo
      addAction({
        type: 'DELETE_SALE',
        sale,
        productStock: {
          id: product.id,
          before: product.stock,
          after: product.stock + sale.quantity
        }
      });
      
      setSales(sales.filter(s => s.id !== sale.id));
      toast.success("Sale deleted successfully");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Management</h1>
          <p className="text-muted-foreground">Track and manage your sales transactions</p>
        </div>
        <div className="flex space-x-2">
          {canUndo && (
            <Button variant="outline" onClick={undo}>
              <Undo className="mr-2 h-4 w-4" />
              Undo
            </Button>
          )}
          {canRedo && (
            <Button variant="outline" onClick={redo}>
              <Redo className="mr-2 h-4 w-4" />
              Redo
            </Button>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSale ? "Edit Sale" : "Record New Sale"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products
                              .filter(p => p.stock > 0 || p.id === editingSale?.productId)
                              .map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - Rs. {product.price.toLocaleString()} 
                                  (Stock: {product.stock})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer (Optional)</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Walk-in Customer</SelectItem>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name} ({customer.phone})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="easypaisa">Easypaisa</SelectItem>
                            <SelectItem value="jazzcash">JazzCash</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {editingSale ? "Update Sale" : "Record Sale"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'sales') return [`${formatCurrency(value)}`, 'Revenue'];
                    return [`${value}`, 'Units Sold'];
                  }}
                  labelStyle={{ color: '#111' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  name="Revenue" 
                  stroke="hsl(var(--primary))" 
                  yAxisId="left"
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Units Sold" 
                  stroke="#82ca9d" 
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by product, customer or payment method..."
          className="pl-9 pr-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Records {searchTerm && `(${filteredSales.length} results)`}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredSales}
            columns={[
              {
                header: "Product",
                accessorKey: "productName",
              },
              {
                header: "Customer",
                accessorKey: "customerName",
                cell: ({ getValue }) => getValue() || "Walk-in Customer",
              },
              {
                header: "Quantity",
                accessorKey: "quantity",
              },
              {
                header: "Amount",
                accessorKey: "price",
                cell: ({ getValue }) => formatCurrency(getValue() as number),
              },
              {
                header: "Profit",
                accessorKey: "profit",
                cell: ({ getValue }) => formatCurrency(getValue() as number),
              },
              {
                header: "Payment Method",
                accessorKey: "paymentMethod",
                cell: ({ getValue }) => {
                  const method = getValue() as string;
                  return method.charAt(0).toUpperCase() + method.slice(1);
                },
              },
              {
                header: "Date",
                accessorKey: "date",
                cell: ({ getValue }) => {
                  const date = getValue() as Date;
                  return formatDate(date);
                },
              },
            ]}
            actions={[
              {
                label: "Edit",
                onClick: (sale) => {
                  setEditingSale(sale);
                  setOpen(true);
                },
                icon: <Edit className="h-4 w-4" />,
              },
              {
                label: "Delete",
                onClick: (sale) => handleDelete(sale),
                icon: <Trash className="h-4 w-4" />,
              },
            ]}
            searchKeys={["productName", "customerName", "paymentMethod"]}
            searchPlaceholder="Search sales..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
