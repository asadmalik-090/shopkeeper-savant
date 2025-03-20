
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Create the app context
const AppContext = createContext();

/**
 * AppProvider component to manage global application state
 */
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // User permissions check
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    
    // Define role-based permissions
    const permissions = {
      admin: [
        'canManageProducts',
        'canManageSales',
        'canManagePurchases',
        'canManageCustomers',
        'canManageRepairs',
        'canViewReports',
        'canChangeSettings'
      ],
      manager: [
        'canManageProducts',
        'canManageSales',
        'canManagePurchases',
        'canManageCustomers',
        'canViewReports'
      ],
      cashier: [
        'canManageSales',
        'canManageCustomers'
      ],
      technician: [
        'canManageRepairs'
      ]
    };

    return permissions[currentUser.role.toLowerCase()]?.includes(permission) || false;
  };

  // Login function
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      // Mock authentication service
      // In a real app, this would be an API call
      const mockUsers = [
        { 
          id: '1', 
          username: 'admin', 
          password: 'admin123', 
          name: 'Admin User', 
          role: 'Admin',
          email: 'admin@mobileshop.com',
          phone: '+1234567890',
          lastLogin: new Date(),
          loginHistory: [
            { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), ip: '192.168.1.1' },
            { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), ip: '192.168.1.2' }
          ]
        },
        { 
          id: '2', 
          username: 'manager', 
          password: 'manager123', 
          name: 'Manager User', 
          role: 'Manager',
          email: 'manager@mobileshop.com',
          lastLogin: new Date(),
          loginHistory: [
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), ip: '192.168.1.3' }
          ]
        },
        { 
          id: '3', 
          username: 'cashier', 
          password: 'cashier123', 
          name: 'Cashier User', 
          role: 'Cashier',
          email: 'cashier@mobileshop.com',
          lastLogin: new Date()
        },
        { 
          id: '4', 
          username: 'tech', 
          password: 'tech123', 
          name: 'Tech User', 
          role: 'Technician',
          email: 'tech@mobileshop.com',
          lastLogin: new Date()
        }
      ];

      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Update login history
        user.loginHistory = [
          ...(user.loginHistory || []),
          { date: new Date(), ip: '127.0.0.1' }
        ];
        
        // Update last login
        user.lastLogin = new Date();
        
        // Remove password from user object before storing
        const { password, ...userWithoutPassword } = user;
        
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        setCurrentUser(userWithoutPassword);
        setIsAuthenticated(true);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        navigate('/');
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  // Password reset functions
  const forgotPassword = async (email) => {
    // Mock implementation for demo
    console.log(`Reset token for ${email}: RESET123456`);
    toast({
      title: "Reset link sent",
      description: "Check your email for the password reset link",
    });
    return true;
  };

  const resetPassword = async (token, newPassword) => {
    // Mock implementation for demo
    console.log(`Reset password with token ${token} to ${newPassword}`);
    toast({
      title: "Password reset successful",
      description: "You can now login with your new password",
    });
    return true;
  };

  // Provide the context value
  const contextValue = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasPermission,
    forgotPassword,
    resetPassword
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
