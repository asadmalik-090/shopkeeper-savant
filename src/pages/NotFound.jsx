
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * NotFound component displays a 404 error page when a route is not found
 * 
 * @returns {JSX.Element} 404 page
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <FileQuestion className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 bg-destructive text-white text-xl font-bold rounded-full h-10 w-10 flex items-center justify-center border-2 border-background">
              404
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
          <br/>
          Path: <code className="bg-muted px-1 py-0.5 rounded font-mono text-sm">{location.pathname}</code>
        </p>
        
        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full">Return to Dashboard</Button>
          </Link>
          
          <Button variant="outline" onClick={() => window.history.back()} className="w-full">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
