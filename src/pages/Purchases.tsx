
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { PurchaseFormDialog, PurchaseFormValues } from '@/components/purchases/PurchaseFormDialog';
import { PurchaseSearch } from '@/components/purchases/PurchaseSearch';
import { PurchaseList } from '@/components/purchases/PurchaseList';
import { PurchaseStatus } from '@/types/purchases';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

const Purchases = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const { purchases, setPurchases } = useAppContext();
  
  const handleFormSubmit = (values: PurchaseFormValues) => {
    const totalCost = values.quantity * values.unitPrice;
    
    if (isEditing && currentPurchase) {
      // Update existing purchase
      const updatedPurchase = {
        ...currentPurchase,
        productName: values.productName,
        supplierName: values.supplierName,
        quantity: values.quantity,
        cost: totalCost,
        status: values.status,
      };

      const updatedPurchases = purchases.map(purchase => 
        purchase.id === currentPurchase.id ? updatedPurchase : purchase
      );
      
      setPurchases(updatedPurchases);
      toast.success("Purchase order updated successfully");
    } else {
      // Add new purchase
      const newPurchase = {
        id: (purchases.length + 1).toString(),
        productId: `prod-${Date.now()}`,
        productName: values.productName,
        supplierName: values.supplierName,
        quantity: values.quantity,
        cost: totalCost,
        status: values.status,
        date: new Date(),
      };

      setPurchases([...purchases, newPurchase]);
      toast.success("Purchase order added successfully");
    }

    setOpen(false);
    setIsEditing(false);
    setCurrentPurchase(null);
  };

  const handleEditPurchase = (purchase: any) => {
    setCurrentPurchase(purchase);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeletePurchase = (id: string) => {
    setPurchaseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (purchaseToDelete) {
      const updatedPurchases = purchases.filter(p => p.id !== purchaseToDelete);
      setPurchases(updatedPurchases);
      toast.success("Purchase order deleted successfully");
      setDeleteDialogOpen(false);
      setPurchaseToDelete(null);
    }
  };

  const updatePurchaseStatus = (id: string, newStatus: PurchaseStatus) => {
    const updatedPurchases = purchases.map(purchase => {
      if (purchase.id === id) {
        return { ...purchase, status: newStatus };
      }
      return purchase;
    });
    
    setPurchases(updatedPurchases);
    toast.success(`Purchase status updated to ${newStatus}`);
  };

  // Filter purchases based on search term
  const filteredPurchases = useMemo(() => {
    if (!searchTerm.trim()) return purchases;
    
    const searchLower = searchTerm.toLowerCase();
    return purchases.filter(purchase => 
      (purchase.productName.toLowerCase().includes(searchLower)) ||
      (purchase.supplierName && purchase.supplierName.toLowerCase().includes(searchLower))
    );
  }, [searchTerm, purchases]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchases</h1>
          <p className="text-muted-foreground">Manage your inventory purchases and orders</p>
        </div>
        <PurchaseFormDialog 
          open={open} 
          onOpenChange={setOpen} 
          onSubmit={handleFormSubmit}
          isEditing={isEditing}
          initialData={isEditing && currentPurchase ? {
            productName: currentPurchase.productName,
            supplierName: currentPurchase.supplierName,
            quantity: currentPurchase.quantity,
            unitPrice: Math.round(currentPurchase.cost / currentPurchase.quantity),
            status: currentPurchase.status
          } : undefined}
        />
      </div>

      <PurchaseSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <PurchaseList 
        purchases={filteredPurchases} 
        onUpdateStatus={updatePurchaseStatus}
        onEditPurchase={handleEditPurchase}
        onDeletePurchase={handleDeletePurchase}
        searchTerm={searchTerm}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the purchase order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Purchases;
