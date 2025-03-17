import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Customer, Sale, Purchase, customers as initialCustomers, products as initialProducts, sales as initialSales, purchases as initialPurchases } from '@/lib/data';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

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
  username: string;
  password: string;
  lastLogin?: Date;
  loginHistory?: { date: Date; ip?: string }[];
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

// Action types for undo/redo functionality
export type ActionType = 
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; product: Product; previousProduct: Product }
  | { type: 'DELETE_PRODUCT'; product: Product }
  | { type: 'ADD_CUSTOMER'; customer: Customer }
  | { type: 'UPDATE_CUSTOMER'; customer: Customer; previousCustomer: Customer }
  | { type: 'DELETE_CUSTOMER'; customer: Customer }
  | { type: 'ADD_SALE'; sale: Sale; productStock: { id: string; before: number; after: number } }
  | { type: 'UPDATE_SALE'; sale: Sale; previousSale: Sale; productStock: { id: string; before: number; after: number } }
  | { type: 'DELETE_SALE'; sale: Sale; productStock: { id: string; before: number; after: number } }
  | { type: 'ADD_PURCHASE'; purchase: Purchase; productStock: { id: string; before: number; after: number } }
  | { type: 'UPDATE_PURCHASE'; purchase: Purchase; previousPurchase: Purchase; productStock: { id: string; before: number; after: number } }
  | { type: 'DELETE_PURCHASE'; purchase: Purchase; productStock: { id: string; before: number; after: number } }
  | { type: 'ADD_REPAIR'; repair: Repair }
  | { type: 'UPDATE_REPAIR'; repair: Repair; previousRepair: Repair }
  | { type: 'DELETE_REPAIR'; repair: Repair };

interface AppContextType {
  // Data management
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
  
  // Authentication
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  
  // Role management
  rolePermissions: Record<UserRole, RolePermissions>;
  updateRolePermissions: (role: UserRole, permissions: Partial<RolePermissions>) => void;
  
  // Helper functions
  hasPermission: (permission: keyof RolePermissions) => boolean;
  updateUserProfile: (user: User) => void;
  
  // Action history for undo/redo
  actionHistory: ActionType[];
  currentActionIndex: number;
  addAction: (action: ActionType) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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

// Default users with usernames and passwords
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    active: true,
    username: 'admin',
    password: 'admin123',
    loginHistory: [{ date: new Date() }],
  },
  {
    id: '2',
    name: 'Store Manager',
    email: 'manager@example.com',
    phone: '+1 (555) 234-5678',
    role: 'Manager',
    active: true,
    username: 'manager',
    password: 'manager123',
  },
  {
    id: '3',
    name: 'Cashier',
    email: 'cashier@example.com',
    phone: '+1 (555) 345-6789',
    role: 'Cashier',
    active: true,
    username: 'cashier',
    password: 'cashier123',
  },
  {
    id: '4',
    name: 'Repair Tech',
    email: 'tech@example.com',
    phone: '+1 (555) 456-7890',
    role: 'Technician',
    active: true,
    username: 'tech',
    password: 'tech123',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Data state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  
  // User management
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('mobiles_users');
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('mobiles_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mobiles_authenticated') === 'true';
  });

  // Role management
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, RolePermissions>>(defaultRolePermissions);
  
  // Action history for undo/redo
  const [actionHistory, setActionHistory] = useState<ActionType[]>([]);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(-1);
  
  // Save users to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mobiles_users', JSON.stringify(users));
  }, [users]);
  
  // Save current user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mobiles_current_user', JSON.stringify(currentUser));
      localStorage.setItem('mobiles_authenticated', 'true');
    } else {
      localStorage.removeItem('mobiles_current_user');
      localStorage.setItem('mobiles_authenticated', 'false');
    }
  }, [currentUser]);
  
  // Check authentication status on protected routes
  useEffect(() => {
    const publicRoutes = ['/', '/login', '/forgot-password', '/reset-password'];
    
    if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);
  
  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const user = users.find(u => 
      u.username === username && 
      u.password === password &&
      u.active
    );
    
    if (user) {
      // Update login history
      const updatedUser = {
        ...user,
        lastLogin: new Date(),
        loginHistory: [
          ...(user.loginHistory || []),
          { date: new Date() }
        ]
      };
      
      // Update user in users array
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      // Set current user
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/');
      return true;
    } else {
      toast.error('Invalid username or password');
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.success('You have been logged out');
  };
  
  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    // In a real app, this would send an email with a reset link
    const user = users.find(u => u.email === email);
    
    if (user) {
      // For demo, we'll just log the token
      console.log(`Password reset token for ${email}: DEMO_TOKEN_${user.id}`);
      toast.success('Password reset instructions sent to your email');
      return true;
    } else {
      toast.error('Email not found');
      return false;
    }
  };
  
  // Reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    // In a real app, this would validate the token and update the password
    // For demo, we'll parse the demo token format
    const userId = token.replace('DEMO_TOKEN_', '');
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        password: newPassword
      };
      
      setUsers(updatedUsers);
      toast.success('Password updated successfully');
      return true;
    } else {
      toast.error('Invalid or expired token');
      return false;
    }
  };
  
  // Update role permissions
  const updateRolePermissions = (role: UserRole, permissions: Partial<RolePermissions>) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        ...permissions
      }
    }));
  };
  
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
  
  // Action history functions for undo/redo
  const addAction = (action: ActionType) => {
    const newHistory = [...actionHistory.slice(0, currentActionIndex + 1), action];
    setActionHistory(newHistory);
    setCurrentActionIndex(newHistory.length - 1);
  };
  
  const undo = () => {
    if (currentActionIndex >= 0) {
      const action = actionHistory[currentActionIndex];
      
      switch (action.type) {
        case 'ADD_PRODUCT':
          setProducts(prev => prev.filter(p => p.id !== action.product.id));
          break;
          
        case 'UPDATE_PRODUCT':
          setProducts(prev => prev.map(p => p.id === action.product.id ? action.previousProduct : p));
          break;
          
        case 'DELETE_PRODUCT':
          setProducts(prev => [...prev, action.product]);
          break;
          
        case 'ADD_CUSTOMER':
          setCustomers(prev => prev.filter(c => c.id !== action.customer.id));
          break;
          
        case 'UPDATE_CUSTOMER':
          setCustomers(prev => prev.map(c => c.id === action.customer.id ? action.previousCustomer : c));
          break;
          
        case 'DELETE_CUSTOMER':
          setCustomers(prev => [...prev, action.customer]);
          break;
          
        case 'ADD_SALE': {
          // Remove the sale
          setSales(prev => prev.filter(s => s.id !== action.sale.id));
          
          // Restore product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.before } 
              : p
          ));
          break;
        }
          
        case 'UPDATE_SALE': {
          // Restore previous sale
          setSales(prev => prev.map(s => s.id === action.sale.id ? action.previousSale : s));
          
          // Restore product stock (this is simplified, would need to handle product changes too)
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.before } 
              : p
          ));
          break;
        }
          
        case 'DELETE_SALE': {
          // Restore the sale
          setSales(prev => [...prev, action.sale]);
          
          // Update product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.before } 
              : p
          ));
          break;
        }
          
        case 'ADD_PURCHASE': {
          // Remove the purchase
          setPurchases(prev => prev.filter(p => p.id !== action.purchase.id));
          
          // Restore product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.before } 
              : p
          ));
          break;
        }
          
        case 'UPDATE_PURCHASE': {
          // Restore previous purchase
          setPurchases(prev => prev.map(p => p.id === action.purchase.id ? action.previousPurchase : p));
          
          // Restore product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.before } 
              : p
          ));
          break;
        }
          
        case 'DELETE_PURCHASE': {
          // Restore the purchase
          setPurchases(prev => [...prev, action.purchase]);
          
          // Update product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.before } 
              : p
          ));
          break;
        }
          
        case 'ADD_REPAIR':
          setRepairs(prev => prev.filter(r => r.id !== action.repair.id));
          break;
          
        case 'UPDATE_REPAIR':
          setRepairs(prev => prev.map(r => r.id === action.repair.id ? action.previousRepair : r));
          break;
          
        case 'DELETE_REPAIR':
          setRepairs(prev => [...prev, action.repair]);
          break;
      }
      
      setCurrentActionIndex(currentActionIndex - 1);
      toast.info("Action undone");
    }
  };
  
  const redo = () => {
    if (currentActionIndex < actionHistory.length - 1) {
      const action = actionHistory[currentActionIndex + 1];
      
      switch (action.type) {
        case 'ADD_PRODUCT':
          setProducts(prev => [...prev, action.product]);
          break;
          
        case 'UPDATE_PRODUCT':
          setProducts(prev => prev.map(p => p.id === action.product.id ? action.product : p));
          break;
          
        case 'DELETE_PRODUCT':
          setProducts(prev => prev.filter(p => p.id !== action.product.id));
          break;
          
        case 'ADD_CUSTOMER':
          setCustomers(prev => [...prev, action.customer]);
          break;
          
        case 'UPDATE_CUSTOMER':
          setCustomers(prev => prev.map(c => c.id === action.customer.id ? action.customer : c));
          break;
          
        case 'DELETE_CUSTOMER':
          setCustomers(prev => prev.filter(c => c.id !== action.customer.id));
          break;
          
        case 'ADD_SALE': {
          // Add the sale back
          setSales(prev => [...prev, action.sale]);
          
          // Update product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.after } 
              : p
          ));
          break;
        }
          
        case 'UPDATE_SALE': {
          // Update the sale
          setSales(prev => prev.map(s => s.id === action.sale.id ? action.sale : s));
          
          // Update product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.after } 
              : p
          ));
          break;
        }
          
        case 'DELETE_SALE': {
          // Remove the sale again
          setSales(prev => prev.filter(s => s.id !== action.sale.id));
          
          // Update product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.after } 
              : p
          ));
          break;
        }
          
        case 'ADD_PURCHASE': {
          // Add the purchase back
          setPurchases(prev => [...prev, action.purchase]);
          
          // Update product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.after } 
              : p
          ));
          break;
        }
          
        case 'UPDATE_PURCHASE': {
          // Update the purchase
          setPurchases(prev => prev.map(p => p.id === action.purchase.id ? action.purchase : p));
          
          // Update product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.after } 
              : p
          ));
          break;
        }
          
        case 'DELETE_PURCHASE': {
          // Remove the purchase again
          setPurchases(prev => prev.filter(p => p.id !== action.purchase.id));
          
          // Update product stock
          setProducts(prev => prev.map(p => 
            p.id === action.productStock.id 
              ? { ...p, stock: action.productStock.after } 
              : p
          ));
          break;
        }
          
        case 'ADD_REPAIR':
          setRepairs(prev => [...prev, action.repair]);
          break;
          
        case 'UPDATE_REPAIR':
          setRepairs(prev => prev.map(r => r.id === action.repair.id ? action.repair : r));
          break;
          
        case 'DELETE_REPAIR':
          setRepairs(prev => prev.filter(r => r.id !== action.repair.id));
          break;
      }
      
      setCurrentActionIndex(currentActionIndex + 1);
      toast.info("Action redone");
    }
  };
  
  const canUndo = currentActionIndex >= 0;
  const canRedo = currentActionIndex < actionHistory.length - 1;

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
      isAuthenticated,
      login,
      logout,
      forgotPassword,
      resetPassword,
      rolePermissions,
      updateRolePermissions,
      hasPermission,
      updateUserProfile,
      actionHistory,
      currentActionIndex,
      addAction,
      undo,
      redo,
      canUndo,
      canRedo
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
