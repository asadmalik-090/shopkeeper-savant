
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { LogOut, ShieldCheck, Mail, Phone, Clock, MapPin } from 'lucide-react';

/**
 * UserProfileDialog component displays user information in a dialog
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.trigger - The element that will trigger the dialog
 * @returns {JSX.Element} User profile dialog
 */
const UserProfileDialog = ({ trigger }) => {
  const { currentUser, logout } = useAppContext();

  if (!currentUser) {
    return null;
  }

  const formatLoginDate = (date) => {
    if (!date) return 'Never';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">User Profile</DialogTitle>
          <DialogDescription>
            Your account information and login history
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/20">
              <AvatarImage src="/placeholder.svg" alt={currentUser.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{currentUser.name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-full text-xs inline-flex mt-1">
                <ShieldCheck className="h-3 w-3" />
                <span>{currentUser.role}</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last login: {formatLoginDate(currentUser.lastLogin)}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 bg-muted/30 p-3 rounded-lg">
            <h4 className="text-sm font-medium">Contact Information</h4>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{currentUser.email}</span>
              </div>
              {currentUser.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
              {currentUser.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{currentUser.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Login History */}
          {currentUser.loginHistory && currentUser.loginHistory.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Login History</h4>
              <div className="max-h-[150px] overflow-auto rounded-lg border p-3 bg-muted/10">
                <div className="space-y-2">
                  {currentUser.loginHistory.slice().reverse().map((login, index) => (
                    <div key={index} className="flex justify-between text-xs py-1 border-b last:border-0">
                      <span className="text-muted-foreground">
                        {formatLoginDate(login.date)}
                      </span>
                      <span className="font-mono">
                        {login.ip || 'Local access'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <Button 
            variant="destructive" 
            onClick={logout} 
            className="mt-2 w-full transition-all hover:bg-red-600 hover:scale-[1.02]"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
