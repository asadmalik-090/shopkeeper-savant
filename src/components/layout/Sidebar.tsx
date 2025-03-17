
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
  UserRound,
  LifeBuoy,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppContext } from '@/context/AppContext';
import UserProfileDialog from '../user/UserProfileDialog';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { currentUser, hasPermission } = useAppContext();

  // Base nav items that are filtered based on permissions
  const navItems = [
    { 
      to: '/', 
      icon: <LayoutDashboard size={18} />, 
      label: 'Dashboard',
      permission: null // visible to all
    },
    { 
      to: '/inventory', 
      icon: <Package size={18} />, 
      label: 'Inventory',
      permission: 'canManageProducts'
    },
    { 
      to: '/sales', 
      icon: <ShoppingCart size={18} />, 
      label: 'Sales',
      permission: 'canManageSales'
    },
    { 
      to: '/purchases', 
      icon: <TrendingUp size={18} />, 
      label: 'Purchases',
      permission: 'canManagePurchases'
    },
    { 
      to: '/customers', 
      icon: <Users size={18} />, 
      label: 'Customers',
      permission: 'canManageCustomers'
    },
    { 
      to: '/repairs', 
      icon: <Wrench size={18} />, 
      label: 'Repairs',
      permission: 'canManageRepairs'
    },
    { 
      to: '/reports', 
      icon: <BarChart2 size={18} />, 
      label: 'Reports',
      permission: 'canViewReports'
    },
    { 
      to: '/support', 
      icon: <LifeBuoy size={18} />, 
      label: 'Help & Support',
      permission: null // visible to all
    },
  ];

  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter(item => 
    item.permission === null || hasPermission(item.permission as any)
  );

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
          {filteredNavItems.map((item) => (
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
      {currentUser && (
        <div className="border-t p-4">
          <UserProfileDialog
            trigger={
              <div className="mb-4 rounded-lg bg-muted/50 p-3 cursor-pointer hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{currentUser.name}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      {currentUser.role}
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          {hasPermission('canChangeSettings') && (
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
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
