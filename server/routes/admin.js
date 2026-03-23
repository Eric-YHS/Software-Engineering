const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

console.log('LOADING ADMIN ROUTES...');

// Create a new Product (Admin Only)
router.post('/products', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  console.log('HIT POST /products');
  const { name, description, category, base_price, shelf_life_days, image_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, description, category, base_price, shelf_life_days, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, category, base_price, shelf_life_days, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create a new Group Buy (Admin Only)
router.post('/group-buys', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  const { title, start_time, end_time, status } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO group_buys (title, start_time, end_time, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, start_time, end_time, status || 'planned']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating group buy:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add a product to a Group Buy (Admin Only)
router.post('/group-buys/:id/items', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  const group_buy_id = req.params.id;
  const { product_id, price, stock } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO group_buy_items (group_buy_id, product_id, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [group_buy_id, product_id, price, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product to group buy:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create a Station (Admin Only) - could be managed by Admin or Leader
router.post('/stations', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { leader_id, name, address } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO stations (leader_id, name, address) VALUES ($1, $2, $3) RETURNING *',
            [leader_id, name, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating station:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- Logistics Management ---

// Get orders ready to be shipped (status = 'paid')
router.get('/orders/to-ship', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.id, o.total_amount, o.created_at, u.username as customer, s.name as station_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN stations s ON o.station_id = s.id
            WHERE o.status = 'paid'
            ORDER BY o.created_at ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching orders to ship:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Mark order as shipped
router.post('/orders/:id/ship', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const orderId = req.params.id;
    try {
        const result = await db.query(
            "UPDATE orders SET status = 'shipped' WHERE id = $1 AND status = 'paid' RETURNING *",
            [orderId]
        );
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Order not found or not in paid status' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error shipping order:', err.message);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
