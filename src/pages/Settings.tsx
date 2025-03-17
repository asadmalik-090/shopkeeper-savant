
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext, User, UserRole } from '@/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, UserRound } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

const shopFormSchema = z.object({
  shopName: z.string().min(1, { message: "Shop name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  taxId: z.string().optional(),
});

const userManagementFormSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  role: z.enum(['Admin', 'Manager', 'Cashier', 'Technician'], { message: "Role is required" }),
  phone: z.string().optional(),
});

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  
  const { 
    users, setUsers, 
    currentUser, updateUserProfile,
    hasPermission, rolePermissions
  } = useAppContext();
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser?.name || "Admin User",
      email: currentUser?.email || "admin@example.com",
      phone: currentUser?.phone || "+1 (555) 123-4567",
    },
  });

  const shopForm = useForm<z.infer<typeof shopFormSchema>>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      shopName: "MobileShop",
      address: "123 Main Street, Karachi, Pakistan",
      phone: "+92 21 1234567",
      taxId: "TAX-12345-PK",
    },
  });

  const userForm = useForm<z.infer<typeof userManagementFormSchema>>({
    resolver: zodResolver(userManagementFormSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "Cashier",
      phone: "",
    },
  });

  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    if (!currentUser) return;
    
    const updatedUser: User = {
      ...currentUser,
      name: values.name,
      email: values.email,
      phone: values.phone,
    };
    
    updateUserProfile(updatedUser);
    toast.success("Profile updated successfully");
  };

  const onShopSubmit = (values: z.infer<typeof shopFormSchema>) => {
    toast.success("Shop details updated successfully");
    console.log(values);
  };

  const onUserSubmit = (values: z.infer<typeof userManagementFormSchema>) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: values.username,
      email: values.email,
      phone: values.phone,
      role: values.role as UserRole,
      active: true,
      username: values.username.toLowerCase().replace(/\s+/g, '.'),
      password: `${values.role.toLowerCase()}123`,  // Default password based on role
    };

    setUsers([...users, newUser]);
    setShowAddUser(false);
    userForm.reset();
    toast.success("User added successfully");
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
    toast.success("User status updated");
  };

  // Only render tabs that the user has permission to see
  const canManageUsers = hasPermission('canManageUsers');
  const canChangeSettings = hasPermission('canChangeSettings');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {canChangeSettings && <TabsTrigger value="shop">Shop Settings</TabsTrigger>}
          {canManageUsers && <TabsTrigger value="users">User Management</TabsTrigger>}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {canManageUsers && <TabsTrigger value="roles">Role Permissions</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{currentUser?.name?.substring(0, 2) || 'AU'}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                </div>
              </div>
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {canChangeSettings && (
          <TabsContent value="shop" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>Manage your shop details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...shopForm}>
                  <form onSubmit={shopForm.handleSubmit(onShopSubmit)} className="space-y-4">
                    <FormField
                      control={shopForm.control}
                      name="shopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shopForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shopForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shopForm.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax ID (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {canManageUsers && (
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <Button onClick={() => setShowAddUser(!showAddUser)}>
                  {showAddUser ? "Cancel" : "Add User"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddUser && (
                  <Card className="mb-6 border border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Add New User</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              control={userForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={userForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={userForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone (Optional)</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={userForm.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Role</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Admin">Admin</SelectItem>
                                      <SelectItem value="Manager">Manager</SelectItem>
                                      <SelectItem value="Cashier">Cashier</SelectItem>
                                      <SelectItem value="Technician">Technician</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Determines what permissions the user will have
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button type="submit">Add User</Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="mt-1">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary gap-1">
                              <Shield size={12} />
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={user.active} 
                            onCheckedChange={() => toggleUserStatus(user.id)}
                          />
                          <span className="text-sm font-medium">
                            {user.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch 
                    checked={smsNotifications} 
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success("Notification settings saved")}>
                Save Notification Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {canManageUsers && (
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>View and understand role-based permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(Object.keys(rolePermissions) as UserRole[]).map((role) => (
                    <div key={role} className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-primary" />
                        <h3 className="text-lg font-semibold">{role}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {Object.entries(rolePermissions[role]).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm">
                              {key.replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
