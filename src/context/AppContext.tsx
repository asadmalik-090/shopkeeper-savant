
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Customer, Sale, Purchase, customers as initialCustomers, products as initialProducts, sales as initialSales, purchases as initialPurchases } from '@/lib/data';

// Define the role types
export type UserRole = 'Admin' | 'Manager' | 'Cashier' | 'Technician';

// Define the permissions for each role
export interface RolePermissions {
  canManageUsers: boolean;
  canManageProducts: boolean;
  canManageSales: boolean;
  canManagePurchases: boolean;
  canManageCustomers: boolean;
  canManageRepairs: boolean;
  canViewReports: boolean;
  canChangeSettings: boolean;
}

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
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
  
  // User management
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  
  // Role management
  rolePermissions: Record<UserRole, RolePermissions>;
  
  // Helper functions
  hasPermission: (permission: keyof RolePermissions) => boolean;
  updateUserProfile: (user: User) => void;
}

// Define default role permissions
const defaultRolePermissions: Record<UserRole, RolePermissions> = {
  Admin: {
    canManageUsers: true,
    canManageProducts: true,
    canManageSales: true,
    canManagePurchases: true,
    canManageCustomers: true,
    canManageRepairs: true,
    canViewReports: true,
    canChangeSettings: true,
  },
  Manager: {
    canManageUsers: false,
    canManageProducts: true,
    canManageSales: true,
    canManagePurchases: true,
    canManageCustomers: true,
    canManageRepairs: true,
    canViewReports: true,
    canChangeSettings: false,
  },
  Cashier: {
    canManageUsers: false,
    canManageProducts: false,
    canManageSales: true,
    canManagePurchases: false,
    canManageCustomers: true,
    canManageRepairs: false,
    canViewReports: false,
    canChangeSettings: false,
  },
  Technician: {
    canManageUsers: false,
    canManageProducts: false,
    canManageSales: false,
    canManagePurchases: false,
    canManageCustomers: false,
    canManageRepairs: true,
    canViewReports: false,
    canChangeSettings: false,
  },
};

// Default users
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    active: true,
  },
  {
    id: '2',
    name: 'Store Manager',
    email: 'manager@example.com',
    phone: '+1 (555) 234-5678',
    role: 'Manager',
    active: true,
  },
  {
    id: '3',
    name: 'Cashier',
    email: 'cashier@example.com',
    phone: '+1 (555) 345-6789',
    role: 'Cashier',
    active: true,
  },
  {
    id: '4',
    name: 'Repair Tech',
    email: 'tech@example.com',
    phone: '+1 (555) 456-7890',
    role: 'Technician',
    active: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  
  // User management
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(defaultUsers[0]); // Default to first user
  
  // Role management
  const [rolePermissions] = useState<Record<UserRole, RolePermissions>>(defaultRolePermissions);
  
  // Helper function to check if user has permission
  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!currentUser) return false;
    return rolePermissions[currentUser.role][permission];
  };
  
  // Update user profile function
  const updateUserProfile = (updatedUser: User) => {
    // Update in users array
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    
    // Update current user if it's the same user
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

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
      setRepairs,
      users,
      setUsers,
      currentUser,
      setCurrentUser,
      rolePermissions,
      hasPermission,
      updateUserProfile
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
