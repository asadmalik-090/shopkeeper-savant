
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { PurchaseFormDialog, PurchaseFormValues } from '@/components/purchases/PurchaseFormDialog';
import { PurchaseSearch } from '@/components/purchases/PurchaseSearch';
import { PurchaseList } from '@/components/purchases/PurchaseList';
import { PurchaseStatus } from '@/types/purchases';

const Purchases = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { purchases, setPurchases } = useAppContext();
  
  const handleFormSubmit = (values: PurchaseFormValues) => {
    const totalCost = values.quantity * values.unitPrice;
    
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
    setOpen(false);
    toast.success("Purchase order added successfully");
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
        />
      </div>

      <PurchaseSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <PurchaseList 
        purchases={filteredPurchases} 
        onUpdateStatus={updatePurchaseStatus}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default Purchases;
