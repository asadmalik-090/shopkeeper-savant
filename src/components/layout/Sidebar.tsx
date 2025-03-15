
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  Settings, 
  Wrench, 
  TrendingUp,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/inventory', icon: <Package size={18} />, label: 'Inventory' },
    { to: '/sales', icon: <ShoppingCart size={18} />, label: 'Sales' },
    { to: '/purchases', icon: <TrendingUp size={18} />, label: 'Purchases' },
    { to: '/customers', icon: <Users size={18} />, label: 'Customers' },
    { to: '/repairs', icon: <Wrench size={18} />, label: 'Repairs' },
    { to: '/reports', icon: <BarChart2 size={18} />, label: 'Reports' },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0 lg:flex", 
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-semibold tracking-tight">MobileShop</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn("sidebar-item", isActive ? "sidebar-item-active" : "sidebar-item-inactive")
              }
              end={item.to === '/'}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="mb-2 flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-muted" />
          <div>
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-muted-foreground">admin@example.com</div>
          </div>
        </div>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn("flex items-center w-full justify-start gap-2 text-muted-foreground px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground", 
            isActive ? "bg-accent text-accent-foreground" : "")
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
