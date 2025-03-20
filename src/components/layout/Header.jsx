
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, Search, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const { currentUser } = useAppContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.charAt(1).toUpperCase() + path.slice(2);
  };

  // Render either search box or title based on search state
  const renderTitleOrSearch = () => {
    if (searchOpen && isMobile) {
      return (
        <div className="flex flex-1 items-center">
          <Input 
            placeholder="Search..." 
            className="h-9 w-full" 
            autoFocus
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2" 
            onClick={() => setSearchOpen(false)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    return <h1 className="text-xl font-semibold">{getPageTitle()}</h1>;
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4">
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        {/* Title or search input */}
        {renderTitleOrSearch()}
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search button - mobile only */}
        {!searchOpen && isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}
        
        {/* Search input - desktop only */}
        {!isMobile && (
          <div className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 pl-8 md:w-64 lg:w-80"
            />
          </div>
        )}
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
            2
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
