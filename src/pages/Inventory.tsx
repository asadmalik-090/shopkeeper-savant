import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Product } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';

const ProductTypeColors = {
  new: "bg-green-100 text-green-800 hover:bg-green-200",
  used: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  refurbished: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

const Inventory = () => {
  const { products, setProducts } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    brand: '',
    model: '',
    type: 'new',
    price: 0,
    cost: 0,
    stock: 0,
  });

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct({
      name: '',
      brand: '',
      model: '',
      type: 'new',
      price: 0,
      cost: 0,
      stock: 0,
    });
    setOpenDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct({ ...product });
    setOpenDialog(true);
  };

  const handleDeleteProduct = (product: Product) => {
    const updatedProducts = products.filter((p) => p.id !== product.id);
    setProducts(updatedProducts);
    toast.success('Product deleted successfully');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'cost' || name === 'stock') {
      setCurrentProduct({ ...currentProduct, [name]: parseFloat(value) || 0 });
    } else {
      setCurrentProduct({ ...currentProduct, [name]: value });
    }
  };

  const handleSelectChange = (value: string) => {
    setCurrentProduct({ ...currentProduct, type: value as 'new' | 'used' | 'refurbished' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      const updatedProducts = products.map((product) => {
        if (product.id === currentProduct.id) {
          return {
            ...product,
            ...currentProduct,
            updatedAt: new Date(),
          };
        }
        return product;
      });
      setProducts(updatedProducts);
      toast.success('Product updated successfully');
    } else {
      const newProduct: Product = {
        ...currentProduct as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
        id: `${products.length + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts([...products, newProduct]);
      toast.success('Product added successfully');
    }
    
    setOpenDialog(false);
  };

  const lowStockProducts = products.filter((product) => product.stock <= 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your products and stock</p>
        </div>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Product</span>
        </Button>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
          <div className="flex">
            <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Low Stock Alert</h3>
              <div className="mt-1 text-sm">
                {lowStockProducts.length} product(s) are running low on stock and need to be restocked.
              </div>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={products}
        columns={[
          {
            header: "Name",
            accessorKey: "name",
          },
          {
            header: "Brand",
            accessorKey: "brand",
          },
          {
            header: "Type",
            accessorKey: "type",
            cell: ({ getValue }) => (
              <Badge className={ProductTypeColors[getValue() as 'new' | 'used' | 'refurbished']}>
                {(getValue() as string).charAt(0).toUpperCase() + (getValue() as string).slice(1)}
              </Badge>
            ),
          },
          {
            header: "IMEI",
            accessorKey: "imei",
            cell: ({ getValue }) => getValue() || "N/A",
          },
          {
            header: "Price",
            accessorKey: "price",
            cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
          },
          {
            header: "Cost",
            accessorKey: "cost",
            cell: ({ getValue }) => `Rs. ${(getValue() as number).toLocaleString()}`,
          },
          {
            header: "Profit",
            accessorKey: "price" as keyof Product,
            cell: ({ row }) => {
              const profit = row.price - row.cost;
              const percentage = (profit / row.cost) * 100;
              return `Rs. ${profit.toLocaleString()} (${percentage.toFixed(0)}%)`;
            },
          },
          {
            header: "Stock",
            accessorKey: "stock",
            cell: ({ getValue }) => (
              <span className={(getValue() as number) <= 2 ? "text-red-500 font-medium" : ""}>
                {getValue()}
              </span>
            ),
          },
        ]}
        actions={[
          {
            label: "Edit",
            onClick: handleEditProduct,
            icon: <Edit className="mr-2 h-4 w-4" />,
          },
          {
            label: "Delete",
            onClick: handleDeleteProduct,
            icon: <Trash2 className="mr-2 h-4 w-4 text-destructive" />,
          },
        ]}
        searchPlaceholder="Search products..."
        searchKeys={["name", "brand", "model"]}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the product details and click save when done."
                  : "Fill in the product details and click save to add it to inventory."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={currentProduct.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={currentProduct.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={currentProduct.type}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {currentProduct.type === 'used' && (
                <div className="space-y-2">
                  <Label htmlFor="imei">IMEI Number</Label>
                  <Input
                    id="imei"
                    name="imei"
                    value={currentProduct.imei || ''}
                    onChange={handleInputChange}
                    placeholder="Enter IMEI number for used phones"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <PriceInput
                    id="price"
                    name="price"
                    value={currentProduct.price}
                    onChange={(value) => setCurrentProduct({ ...currentProduct, price: value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <PriceInput
                    id="cost"
                    name="cost"
                    value={currentProduct.cost}
                    onChange={(value) => setCurrentProduct({ ...currentProduct, cost: value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={currentProduct.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
