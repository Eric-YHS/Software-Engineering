const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Place an order (calls the stored procedure)
router.post('/', authenticateToken, async (req, res) => {
  const { station_id, group_buy_id, product_ids, quantities } = req.body;
  const user_id = req.user.id; // From authenticated token

  try {
    // Call the stored procedure
    await db.query('CALL place_order($1, $2, $3, $4, $5)', [
      user_id,
      station_id,
      group_buy_id,
      product_ids,
      quantities
    ]);
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (err) {
    console.error('Error placing order:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get user's own orders
router.get('/mine', authenticateToken, async (req, res) => {
  const user_id = req.user.id; // From authenticated token

  try {
    const result = await db.query(`
      SELECT 
          o.id, 
          o.total_amount, 
          o.status, 
          o.created_at, 
          o.pickup_code,
          gb.title as group_buy_title,
          s.name as station_name
      FROM orders o
      JOIN group_buys gb ON o.group_buy_id = gb.id
      JOIN stations s ON o.station_id = s.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `, [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user orders:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get details for a specific order
router.get('/:orderId', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const orderId = req.params.orderId;

  try {
    const orderResult = await db.query(`
      SELECT 
          o.id, 
          o.total_amount, 
          o.status, 
          o.created_at, 
          o.pickup_code,
          gb.title as group_buy_title,
          s.name as station_name
      FROM orders o
      JOIN group_buys gb ON o.group_buy_id = gb.id
      JOIN stations s ON o.station_id = s.id
      WHERE o.id = $1 AND o.user_id = $2
    `, [orderId, user_id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or not authorized' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await db.query(`
      SELECT oi.quantity, oi.price, p.name AS product_name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [orderId]);

    order.items = itemsResult.rows;
    res.json(order);

  } catch (err) {
    console.error('Error fetching order details:', err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
