
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Customer, Sale, Purchase, customers as initialCustomers, products as initialProducts, sales as initialSales, purchases as initialPurchases } from '@/lib/data';

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  purchases: Purchase[];
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
  repairs: Repair[];
  setRepairs: React.Dispatch<React.SetStateAction<Repair[]>>;
}

export interface Repair {
  id: string;
  customerName: string;
  phone: string;
  device: string;
  issue: string;
  status: "Pending" | "In Progress" | "Completed" | "Delivered" | "Cancelled";
  cost: number;
  receivedDate: Date;
  completionDate: Date | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [repairs, setRepairs] = useState<Repair[]>([]);

  return (
    <AppContext.Provider value={{
      products,
      setProducts,
      customers,
      setCustomers,
      sales,
      setSales,
      purchases,
      setPurchases,
      repairs,
      setRepairs
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
