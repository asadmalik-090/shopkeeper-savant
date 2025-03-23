
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 404 Not Found page with enhanced UI
 * Logs the attempted path to the console for debugging
 * 
 * @returns {JSX.Element} Not found page
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="rounded-full bg-red-100 p-6 mb-6 animate-bounce">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="text-5xl font-bold mb-2 text-red-500">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-6">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <p className="text-sm text-muted-foreground mb-8">
          Attempted path: <code className="bg-muted px-1 py-0.5 rounded">{location.pathname}</code>
        </p>
        
        <div className="space-y-2 w-full max-w-xs">
          <Link to="/" className="w-full">
            <Button className="w-full" size="lg">
              Return to Dashboard
            </Button>
          </Link>
          
          <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
