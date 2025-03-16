export type Product = {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: 'new' | 'used' | 'refurbished';
  imei?: string;
  price: number;
  cost: number;
  stock: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  cnic?: string;
  address?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Sale = {
  id: string;
  productId: string;
  productName: string;
  customerId?: string;
  customerName?: string;
  quantity: number;
  price: number;
  cost: number;
  profit: number;
  paymentMethod: 'cash' | 'bank' | 'easypaisa' | 'jazzcash' | 'other';
  status: 'completed' | 'pending' | 'cancelled';
  date: Date;
};

export type Purchase = {
  id: string;
  productId: string;
  productName: string;
  supplierId?: string;
  supplierName?: string;
  quantity: number;
  cost: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  date: Date;
};

export type MetricCard = {
  title: string;
  value: string | number;
  icon: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  description?: string;
};

// Mock data
export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    type: 'new',
    price: 180000,
    cost: 160000,
    stock: 5,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Samsung Galaxy S21',
    brand: 'Samsung',
    model: 'Galaxy S21',
    type: 'new',
    price: 120000,
    cost: 100000,
    stock: 8,
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
  },
  {
    id: '3',
    name: 'iPhone 12',
    brand: 'Apple',
    model: 'iPhone 12',
    type: 'used',
    imei: '352789102345678',
    price: 100000,
    cost: 80000,
    stock: 2,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
  },
  {
    id: '4',
    name: 'Samsung Galaxy Note 20',
    brand: 'Samsung',
    model: 'Galaxy Note 20',
    type: 'refurbished',
    price: 90000,
    cost: 70000,
    stock: 3,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '5',
    name: 'Google Pixel 6',
    brand: 'Google',
    model: 'Pixel 6',
    type: 'new',
    price: 110000,
    cost: 90000,
    stock: 4,
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20'),
  },
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Ali Ahmed',
    phone: '03001234567',
    cnic: '35202-1234567-8',
    address: 'House #123, Street 4, Lahore',
    email: 'ali@example.com',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Sara Khan',
    phone: '03009876543',
    address: 'Apartment 12B, Karachi',
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
  },
  {
    id: '3',
    name: 'Usman Ali',
    phone: '03331234567',
    cnic: '35202-7654321-0',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
  },
];

export const sales: Sale[] = [
  {
    id: '1',
    productId: '1',
    productName: 'iPhone 13 Pro',
    customerId: '1',
    customerName: 'Ali Ahmed',
    quantity: 1,
    price: 180000,
    cost: 160000,
    profit: 20000,
    paymentMethod: 'cash',
    status: 'completed',
    date: new Date('2023-02-01'),
  },
  {
    id: '2',
    productId: '2',
    productName: 'Samsung Galaxy S21',
    customerId: '2',
    customerName: 'Sara Khan',
    quantity: 1,
    price: 120000,
    cost: 100000,
    profit: 20000,
    paymentMethod: 'bank',
    status: 'completed',
    date: new Date('2023-02-05'),
  },
  {
    id: '3',
    productId: '3',
    productName: 'iPhone 12',
    quantity: 1,
    price: 100000,
    cost: 80000,
    profit: 20000,
    paymentMethod: 'cash',
    status: 'completed',
    date: new Date('2023-02-10'),
  },
];

export const purchases: Purchase[] = [
  {
    id: '1',
    productId: '1',
    productName: 'iPhone 13 Pro',
    supplierName: 'Mobile World',
    quantity: 2,
    cost: 160000 * 2,
    status: 'Completed',
    date: new Date('2023-01-01'),
  },
  {
    id: '2',
    productId: '2',
    productName: 'Samsung Galaxy S21',
    supplierName: 'Tech Imports',
    quantity: 3,
    cost: 100000 * 3,
    status: 'Completed',
    date: new Date('2023-01-05'),
  },
];

export const dashboardMetrics: MetricCard[] = [
  {
    title: 'Total Sales',
    value: 'Rs. 400,000',
    icon: 'trending-up',
    change: {
      value: 12,
      type: 'increase',
    },
    description: 'Compared to last month',
  },
  {
    title: 'Total Profit',
    value: 'Rs. 60,000',
    icon: 'bar-chart',
    change: {
      value: 8,
      type: 'increase',
    },
    description: 'Compared to last month',
  },
  {
    title: 'Low Stock Items',
    value: '3',
    icon: 'alert-triangle',
    description: 'Items below minimum stock level',
  },
  {
    title: 'Customers',
    value: '23',
    icon: 'users',
    change: {
      value: 5,
      type: 'increase',
    },
    description: 'New customers this month',
  },
];

export const topSellingProducts = [
  {
    name: 'iPhone 13 Pro',
    sales: 12,
    revenue: 'Rs. 2,160,000',
  },
  {
    name: 'Samsung Galaxy S21',
    sales: 8,
    revenue: 'Rs. 960,000',
  },
  {
    name: 'iPhone 12',
    sales: 7,
    revenue: 'Rs. 700,000',
  },
];

export const salesByMonth = [
  { month: 'Jan', sales: 120000 },
  { month: 'Feb', sales: 400000 },
  { month: 'Mar', sales: 350000 },
  { month: 'Apr', sales: 450000 },
  { month: 'May', sales: 320000 },
  { month: 'Jun', sales: 380000 },
];
