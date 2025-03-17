
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Customers from "./pages/Customers";
import Repairs from "./pages/Repairs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { useAppContext } from "./context/AppContext";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppContext();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Layout wrapper with animation
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAppContext();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Don't show the layout for authentication pages
  const authPages = ['/login', '/forgot-password', '/reset-password'];
  if (authPages.includes(location.pathname)) {
    return <>{children}</>;
  }

  // For authenticated users, show the full layout
  return (
    <div className="flex min-h-screen flex-col">
      {isAuthenticated && (
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
      )}
      {isAuthenticated && <Sidebar isOpen={isSidebarOpen} />}
      <div className={isAuthenticated ? "lg:pl-64 flex-1 flex flex-col" : "flex-1 flex flex-col"}>
        <main className="container mx-auto p-4 transition-all duration-300 animate-in fade-in slide-in flex-1">
          {children}
        </main>
        {isAuthenticated && <Footer />}
      </div>
    </div>
  );
};

// App provider wrapper for managing state across the router
const AppWithProvider = () => {
  return (
    <AppProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
        <Route path="/forgot-password" element={<AppLayout><ForgotPassword /></AppLayout>} />
        <Route path="/reset-password" element={<AppLayout><ResetPassword /></AppLayout>} />
        
        {/* Protected routes */}
        <Route path="/" element={<AppLayout><ProtectedRoute><Index /></ProtectedRoute></AppLayout>} />
        <Route path="/inventory" element={<AppLayout><ProtectedRoute><Inventory /></ProtectedRoute></AppLayout>} />
        <Route path="/sales" element={<AppLayout><ProtectedRoute><Sales /></ProtectedRoute></AppLayout>} />
        <Route path="/purchases" element={<AppLayout><ProtectedRoute><Purchases /></ProtectedRoute></AppLayout>} />
        <Route path="/customers" element={<AppLayout><ProtectedRoute><Customers /></ProtectedRoute></AppLayout>} />
        <Route path="/repairs" element={<AppLayout><ProtectedRoute><Repairs /></ProtectedRoute></AppLayout>} />
        <Route path="/reports" element={<AppLayout><ProtectedRoute><Reports /></ProtectedRoute></AppLayout>} />
        <Route path="/settings" element={<AppLayout><ProtectedRoute><Settings /></ProtectedRoute></AppLayout>} />
        <Route path="/support" element={<AppLayout><ProtectedRoute><Support /></ProtectedRoute></AppLayout>} />
        
        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithProvider />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
