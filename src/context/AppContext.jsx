import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { productsApi, customersApi, salesApi, purchasesApi, authApi, repairsApi } from '@/services/api';

// Define the role types
export const UserRole = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  CASHIER: 'Cashier',
  TECHNICIAN: 'Technician'
};

// Define the permissions for each role
const defaultRolePermissions = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageProducts: true,
    canManageSales: true,
    canManagePurchases: true,
    canManageCustomers: true,
    canManageRepairs: true,
    canViewReports: true,
    canChangeSettings: true,
  },
  [UserRole.MANAGER]: {
    canManageUsers: false,
    canManageProducts: true,
    canManageSales: true,
    canManagePurchases: true,
    canManageCustomers: true,
    canManageRepairs: true,
    canViewReports: true,
    canChangeSettings: false,
  },
  [UserRole.CASHIER]: {
    canManageUsers: false,
    canManageProducts: false,
    canManageSales: true,
    canManagePurchases: false,
    canManageCustomers: true,
    canManageRepairs: false,
    canViewReports: false,
    canChangeSettings: false,
  },
  [UserRole.TECHNICIAN]: {
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

// Create context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Data state
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [repairs, setRepairs] = useState([]);
  
  // User management
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('mobiles_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('mobiles_authenticated') === 'true';
  });

  // Role management
  const [rolePermissions, setRolePermissions] = useState(defaultRolePermissions);
  
  // Action history for undo/redo
  const [actionHistory, setActionHistory] = useState([]);
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch data from API
  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated]);
  
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [productsData, customersData, salesData, purchasesData, repairsData] = await Promise.all([
        productsApi.getAll(),
        customersApi.getAll(),
        salesApi.getAll(),
        purchasesApi.getAll(),
        repairsApi.getAll()
      ]);
      
      setProducts(productsData);
      setCustomers(customersData);
      setSales(salesData);
      setPurchases(purchasesData);
      setRepairs(repairsData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
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
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const user = await authApi.login({ username, password });
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/');
      return true;
    } catch (error) {
      toast.error(error.message || 'Invalid username or password');
      return false;
    } finally {
      setIsLoading(false);
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
  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      await authApi.forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      toast.error(error.message || 'Email not found');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password function
  const resetPassword = async (token, newPassword) => {
    try {
      setIsLoading(true);
      await authApi.resetPassword(token, newPassword);
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      toast.error(error.message || 'Invalid or expired token');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update role permissions
  const updateRolePermissions = (role, permissions) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        ...permissions
      }
    }));
  };
  
  // Helper function to check if user has permission
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return rolePermissions[currentUser.role][permission];
  };
  
  // Update user profile function
  const updateUserProfile = async (updatedUser) => {
    try {
      setIsLoading(true);
      // Update user in database (this API endpoint needs to be implemented)
      // await usersApi.update(updatedUser.id, updatedUser);
      
      // Update in local state
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
      );
      
      // Update current user if it's the same user
      if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
      }
      
      toast.success('User profile updated successfully');
    } catch (error) {
      toast.error('Failed to update user profile');
      console.error('Error updating user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // CRUD operations for products
  const addProduct = async (product) => {
    try {
      setIsLoading(true);
      const newProduct = await productsApi.create(product);
      setProducts(prev => [...prev, newProduct]);
      addAction({ type: 'ADD_PRODUCT', product: newProduct });
      toast.success('Product added successfully');
      return newProduct;
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Error adding product:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProduct = async (product) => {
    try {
      setIsLoading(true);
      const previousProduct = products.find(p => p.id === product.id);
      await productsApi.update(product.id, product);
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      addAction({ type: 'UPDATE_PRODUCT', product, previousProduct });
      toast.success('Product updated successfully');
      return product;
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteProduct = async (id) => {
    try {
      setIsLoading(true);
      const product = products.find(p => p.id === id);
      await productsApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      addAction({ type: 'DELETE_PRODUCT', product });
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Similar CRUD functions for customers, sales, purchases, repairs...
  
  // Action history functions for undo/redo
  const addAction = (action) => {
    const newHistory = [...actionHistory.slice(0, currentActionIndex + 1), action];
    setActionHistory(newHistory);
    setCurrentActionIndex(newHistory.length - 1);
  };
  
  const undo = () => {
    // Implement undo logic based on action history
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
    // Implement redo logic based on action history
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
      // Data
      products,
      customers,
      sales,
      purchases,
      repairs,
      
      // Loading state
      isLoading,
      
      // Product operations
      addProduct,
      updateProduct,
      deleteProduct,
      
      // Users
      users,
      currentUser,
      
      // Authentication
      isAuthenticated,
      login,
      logout,
      forgotPassword,
      resetPassword,
      
      // Permissions
      rolePermissions,
      updateRolePermissions,
      hasPermission,
      updateUserProfile,
      
      // Action history
      actionHistory,
      currentActionIndex,
      addAction,
      undo,
      redo,
      canUndo,
      canRedo,
      
      // Refresh data
      refreshData: fetchInitialData
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
