
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
  role: z.string().min(1, { message: "Role is required" }),
});

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  // Mock user data
  const mockUsers = [
    { id: '1', username: 'admin', email: 'admin@example.com', role: 'Admin', active: true },
    { id: '2', username: 'cashier', email: 'cashier@example.com', role: 'Cashier', active: true },
    { id: '3', username: 'technician', email: 'tech@example.com', role: 'Technician', active: false },
  ];
  
  const [users, setUsers] = useState(mockUsers);
  const [showAddUser, setShowAddUser] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Admin User",
      email: "admin@example.com",
      phone: "+92 300 1234567",
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
    },
  });

  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    toast.success("Profile updated successfully");
    console.log(values);
  };

  const onShopSubmit = (values: z.infer<typeof shopFormSchema>) => {
    toast.success("Shop details updated successfully");
    console.log(values);
  };

  const onUserSubmit = (values: z.infer<typeof userManagementFormSchema>) => {
    const newUser = {
      id: (users.length + 1).toString(),
      username: values.username,
      email: values.email,
      role: values.role,
      active: true,
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="shop">Shop Settings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                  <AvatarFallback>AU</AvatarFallback>
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
                        </div>
                        <FormField
                          control={userForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                Available roles: Admin, Cashier, Technician, Manager
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Add User</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="mt-1">
                        <span className="inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {user.role}
                        </span>
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
      </Tabs>
    </div>
  );
};

export default Settings;
