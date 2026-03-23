const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const leaderRoutes = require('./routes/leader');
const adminRoutes = require('./routes/admin'); // New import
const authenticateToken = require('./middleware/auth');
const authorizeRole = require('./middleware/authorizeRole');
const db = require('./db');

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Community Fresh Food Group Buying System API is running' });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes); // Moved up: Includes /admin/products, /admin/group-buys, ...

// Product & Group Buy Routes
app.use('/api', productRoutes); // Includes /products, /group-buys, /group-buys/:id/items

// Order Routes
app.use('/api/orders', orderRoutes); // Includes /orders, /orders/mine, /orders/:orderId

// Leader Routes
app.use('/api/leader', leaderRoutes);

// Protected test route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.role}! You accessed protected data.`, user: req.user });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
