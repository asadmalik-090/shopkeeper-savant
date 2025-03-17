
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, useAppContext } from '@/context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { LogOut, UserRound, ShieldCheck, Mail, Phone, Clock } from 'lucide-react';

interface UserProfileDialogProps {
  trigger: React.ReactNode;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ trigger }) => {
  const { currentUser, logout } = useAppContext();

  if (!currentUser) {
    return null;
  }

  const formatLoginDate = (date: Date | undefined) => {
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
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Your account information and login history
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{currentUser.name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>{currentUser.role}</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last login: {formatLoginDate(currentUser.lastLogin)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
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
            </div>
          </div>

          {currentUser.loginHistory && currentUser.loginHistory.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Login History</h4>
              <div className="max-h-[150px] overflow-auto rounded border p-2">
                <div className="space-y-2">
                  {currentUser.loginHistory.slice().reverse().map((login, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {formatLoginDate(login.date)}
                      </span>
                      <span>
                        {login.ip || 'Local access'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button variant="destructive" onClick={logout} className="mt-2">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
