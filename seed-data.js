
require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB Connection URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Database and Collection Names
const dbName = 'mobileStore';
const collections = {
  products: 'products',
  customers: 'customers',
  sales: 'sales',
  purchases: 'purchases',
  users: 'users',
  repairs: 'repairs'
};

// Mock data
const products = [
  {
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

const customers = [
  {
    name: 'Ali Ahmed',
    phone: '03001234567',
    cnic: '35202-1234567-8',
    address: 'House #123, Street 4, Lahore',
    email: 'ali@example.com',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    name: 'Sara Khan',
    phone: '03009876543',
    address: 'Apartment 12B, Karachi',
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
  },
  {
    name: 'Usman Ali',
    phone: '03331234567',
    cnic: '35202-7654321-0',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
  },
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    active: true,
    username: 'admin',
    password: 'admin123',
    loginHistory: [{ date: new Date() }],
  },
  {
    name: 'Store Manager',
    email: 'manager@example.com',
    phone: '+1 (555) 234-5678',
    role: 'Manager',
    active: true,
    username: 'manager',
    password: 'manager123',
  },
  {
    name: 'Cashier',
    email: 'cashier@example.com',
    phone: '+1 (555) 345-6789',
    role: 'Cashier',
    active: true,
    username: 'cashier',
    password: 'cashier123',
  },
  {
    name: 'Repair Tech',
    email: 'tech@example.com',
    phone: '+1 (555) 456-7890',
    role: 'Technician',
    active: true,
    username: 'tech',
    password: 'tech123',
  },
];

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Clear existing data
    await Promise.all([
      db.collection(collections.products).deleteMany({}),
      db.collection(collections.customers).deleteMany({}),
      db.collection(collections.users).deleteMany({}),
      db.collection(collections.sales).deleteMany({}),
      db.collection(collections.purchases).deleteMany({}),
      db.collection(collections.repairs).deleteMany({}),
    ]);
    
    console.log('Cleared existing data');
    
    // Insert seed data
    const productResult = await db.collection(collections.products).insertMany(products);
    console.log(`${productResult.insertedCount} products inserted`);
    
    const customerResult = await db.collection(collections.customers).insertMany(customers);
    console.log(`${customerResult.insertedCount} customers inserted`);
    
    const userResult = await db.collection(collections.users).insertMany(users);
    console.log(`${userResult.insertedCount} users inserted`);
    
    // Generate sales using product IDs
    const insertedProducts = await db.collection(collections.products).find({}).toArray();
    const insertedCustomers = await db.collection(collections.customers).find({}).toArray();
    
    // Create sample sales
    const sales = [
      {
        productId: insertedProducts[0]._id.toString(),
        productName: insertedProducts[0].name,
        customerId: insertedCustomers[0]._id.toString(),
        customerName: insertedCustomers[0].name,
        quantity: 1,
        price: insertedProducts[0].price,
        cost: insertedProducts[0].cost,
        profit: insertedProducts[0].price - insertedProducts[0].cost,
        paymentMethod: 'cash',
        status: 'completed',
        date: new Date('2023-02-01'),
      },
      {
        productId: insertedProducts[1]._id.toString(),
        productName: insertedProducts[1].name,
        customerId: insertedCustomers[1]._id.toString(),
        customerName: insertedCustomers[1].name,
        quantity: 1,
        price: insertedProducts[1].price,
        cost: insertedProducts[1].cost,
        profit: insertedProducts[1].price - insertedProducts[1].cost,
        paymentMethod: 'bank',
        status: 'completed',
        date: new Date('2023-02-05'),
      },
    ];
    
    const salesResult = await db.collection(collections.sales).insertMany(sales);
    console.log(`${salesResult.insertedCount} sales inserted`);
    
    // Create sample purchases
    const purchases = [
      {
        productId: insertedProducts[0]._id.toString(),
        productName: insertedProducts[0].name,
        supplierName: 'Mobile World',
        quantity: 2,
        cost: insertedProducts[0].cost * 2,
        status: 'Completed',
        date: new Date('2023-01-01'),
      },
      {
        productId: insertedProducts[1]._id.toString(),
        productName: insertedProducts[1].name,
        supplierName: 'Tech Imports',
        quantity: 3,
        cost: insertedProducts[1].cost * 3,
        status: 'Completed',
        date: new Date('2023-01-05'),
      },
    ];
    
    const purchasesResult = await db.collection(collections.purchases).insertMany(purchases);
    console.log(`${purchasesResult.insertedCount} purchases inserted`);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
