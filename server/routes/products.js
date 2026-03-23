const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products (Admin)
router.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Active Group Buys
router.get('/group-buys', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM group_buys WHERE status = 'active'");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Items for a Group Buy
router.get('/group-buys/:id/items', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT gbi.*, p.name, p.image_url, p.description 
      FROM group_buy_items gbi
      JOIN products p ON gbi.product_id = p.id
      WHERE gbi.group_buy_id = $1
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
