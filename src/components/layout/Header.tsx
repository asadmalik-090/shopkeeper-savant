
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Bell, User, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(localStorage.getItem('shopLogo'));
  const [shopName, setShopName] = useState<string>(localStorage.getItem('shopName') || 'MobileShop');
  const [openDialog, setOpenDialog] = useState(false);

  // Effect to handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoUrl(result);
      localStorage.setItem('shopLogo', result);
      toast.success('Shop logo updated successfully');
    };
    reader.readAsDataURL(file);
  };

  // Handle shop name update
  const saveShopName = (newName: string) => {
    if (newName.trim()) {
      setShopName(newName);
      localStorage.setItem('shopName', newName);
      toast.success('Shop name updated successfully');
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? 'glassmorphism shadow-sm' : 'bg-background'
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          {/* Shop branding with logo */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={shopName} 
                className="h-8 w-8 rounded-md object-contain"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                {shopName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="font-semibold tracking-tight">{shopName}</span>
          </Link>
        </div>

        {!isMobile && (
          <div className="hidden w-full max-w-sm md:flex md:flex-1 md:items-center md:justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products, customers..."
                className="w-full pl-9 pr-4"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Shop Settings Dialog */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                <Upload size={16} /> Shop Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Shop Branding</DialogTitle>
                <DialogDescription>
                  Customize your shop's name and logo. Changes will be saved automatically.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="shopName" 
                      defaultValue={shopName}
                      placeholder="Enter shop name" 
                      onChange={(e) => {
                        if (e.target.value.trim()) {
                          saveShopName(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="shopLogo">Shop Logo</Label>
                  <div className="flex flex-col gap-4">
                    {logoUrl && (
                      <div className="flex items-center gap-4">
                        <img 
                          src={logoUrl} 
                          alt="Shop Logo" 
                          className="h-16 w-16 rounded-md object-contain border p-1"
                        />
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            setLogoUrl(null);
                            localStorage.removeItem('shopLogo');
                            toast.success('Logo removed successfully');
                          }}
                        >
                          Remove Logo
                        </Button>
                      </div>
                    )}
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="logoUpload">Upload Logo</Label>
                      <Input 
                        id="logoUpload"
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">Low stock alert</span>
                    <span className="text-xs text-muted-foreground">iPhone 13 Pro (2 left)</span>
                    <span className="text-xs text-muted-foreground">5 minutes ago</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">New sale completed</span>
                    <span className="text-xs text-muted-foreground">Samsung Galaxy S21</span>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                Shop Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
