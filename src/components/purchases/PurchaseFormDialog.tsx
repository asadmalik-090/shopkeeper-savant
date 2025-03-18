
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PurchaseStatus } from '@/types/purchases';
import { PlusCircle } from 'lucide-react';

// Form schema
export const purchaseFormSchema = z.object({
  productName: z.string().min(1, { message: "Product name is required" }),
  supplierName: z.string().min(1, { message: "Supplier name is required" }),
  quantity: z.coerce.number().positive({ message: "Quantity must be a positive number" }),
  unitPrice: z.coerce.number().positive({ message: "Unit price must be a positive number" }),
  status: z.enum(["Pending", "Completed", "Cancelled"] as const).default("Pending"),
});

// Form value types
export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

interface PurchaseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PurchaseFormValues) => void;
  isEditing?: boolean;
  initialData?: PurchaseFormValues;
}

export const PurchaseFormDialog: React.FC<PurchaseFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isEditing = false,
  initialData
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: initialData || {
      productName: "",
      supplierName: "",
      quantity: 1,
      unitPrice: 0,
      status: "Pending"
    }
  });

  // Reset form when dialog opens with initial data
  useEffect(() => {
    if (open && initialData) {
      reset(initialData);
    } else if (!open) {
      reset({
        productName: "",
        supplierName: "",
        quantity: 1,
        unitPrice: 0,
        status: "Pending"
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (data: PurchaseFormValues) => {
    onSubmit(data);
  };

  const handleStatusChange = (value: string) => {
    setValue("status", value as PurchaseStatus);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Purchase
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Purchase Order" : "Create Purchase Order"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              {...register("productName")}
              placeholder="Enter product name"
            />
            {errors.productName && (
              <p className="text-sm text-destructive">{errors.productName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplierName">Supplier Name</Label>
            <Input
              id="supplierName"
              {...register("supplierName")}
              placeholder="Enter supplier name"
            />
            {errors.supplierName && (
              <p className="text-sm text-destructive">{errors.supplierName.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity")}
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price</Label>
              <Input
                id="unitPrice"
                type="number"
                {...register("unitPrice")}
                placeholder="Enter unit price"
              />
              {errors.unitPrice && (
                <p className="text-sm text-destructive">{errors.unitPrice.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              onValueChange={handleStatusChange}
              defaultValue={initialData?.status || "Pending"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
