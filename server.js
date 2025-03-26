
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// API Routes
async function setupRoutes() {
  const db = await connectToMongo();

  // Products API
  app.get('/api/products', async (req, res) => {
    try {
      const products = await db.collection(collections.products).find({}).toArray();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const newProduct = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection(collections.products).insertOne(newProduct);
      res.status(201).json({ ...newProduct, id: result.insertedId });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProduct = {
        ...req.body,
        updatedAt: new Date()
      };
      await db.collection(collections.products).updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedProduct }
      );
      res.json({ ...updatedProduct, id });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection(collections.products).deleteOne({ _id: new ObjectId(id) });
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Customers API
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await db.collection(collections.customers).find({}).toArray();
      res.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/customers', async (req, res) => {
    try {
      const newCustomer = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection(collections.customers).insertOne(newCustomer);
      res.status(201).json({ ...newCustomer, id: result.insertedId });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Sales API
  app.get('/api/sales', async (req, res) => {
    try {
      const sales = await db.collection(collections.sales).find({}).toArray();
      res.json(sales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/sales', async (req, res) => {
    try {
      const newSale = {
        ...req.body,
        date: new Date(req.body.date) || new Date()
      };
      const result = await db.collection(collections.sales).insertOne(newSale);
      
      // Update product stock
      await db.collection(collections.products).updateOne(
        { _id: new ObjectId(newSale.productId) },
        { $inc: { stock: -newSale.quantity } }
      );
      
      res.status(201).json({ ...newSale, id: result.insertedId });
    } catch (error) {
      console.error('Error creating sale:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Purchases API
  app.get('/api/purchases', async (req, res) => {
    try {
      const purchases = await db.collection(collections.purchases).find({}).toArray();
      res.json(purchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/purchases', async (req, res) => {
    try {
      const newPurchase = {
        ...req.body,
        date: new Date(req.body.date) || new Date()
      };
      const result = await db.collection(collections.purchases).insertOne(newPurchase);
      
      // Update product stock
      await db.collection(collections.products).updateOne(
        { _id: new ObjectId(newPurchase.productId) },
        { $inc: { stock: newPurchase.quantity } }
      );
      
      res.status(201).json({ ...newPurchase, id: result.insertedId });
    } catch (error) {
      console.error('Error creating purchase:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/purchases/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedPurchase = {
        ...req.body,
        date: new Date(req.body.date) || new Date()
      };
      
      // Get the current purchase to calculate stock adjustment
      const currentPurchase = await db.collection(collections.purchases).findOne({ _id: new ObjectId(id) });
      const stockDifference = updatedPurchase.quantity - currentPurchase.quantity;
      
      await db.collection(collections.purchases).updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedPurchase }
      );
      
      // Update product stock if quantity changed
      if (stockDifference !== 0) {
        await db.collection(collections.products).updateOne(
          { _id: new ObjectId(updatedPurchase.productId) },
          { $inc: { stock: stockDifference } }
        );
      }
      
      res.json({ ...updatedPurchase, id });
    } catch (error) {
      console.error('Error updating purchase:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Authentication API
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await db.collection(collections.users).findOne({ username, password, active: true });
      
      if (user) {
        // Update login history
        await db.collection(collections.users).updateOne(
          { _id: user._id },
          { 
            $set: { lastLogin: new Date() },
            $push: { loginHistory: { date: new Date() } }
          }
        );
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }
}

// Start server
setupRoutes().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
});

// Handle server shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
