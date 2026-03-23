const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

// Get all stations managed by the authenticated leader
router.get('/my-stations', authenticateToken, authorizeRole(['leader']), async (req, res) => {
  try {
    const leaderId = req.user.id;
    const result = await db.query('SELECT * FROM stations WHERE leader_id = $1', [leaderId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leader stations:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get pending orders for a specific station (accessible by leader of that station)
router.get('/station/:stationId/pending-deliveries', authenticateToken, authorizeRole(['leader']), async (req, res) => {
  try {
    const leaderId = req.user.id;
    const stationId = req.params.stationId;

    // First, verify that the leader manages this station
    const stationCheck = await db.query('SELECT id FROM stations WHERE id = $1 AND leader_id = $2', [stationId, leaderId]);
    if (stationCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to view this station' });
    }

    const result = await db.query('SELECT * FROM view_station_pending_deliveries WHERE station_id = $1 ORDER BY created_at ASC', [stationId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching station pending deliveries:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get Station Statistics (Sales & Commission)
router.get('/station/:stationId/stats', authenticateToken, authorizeRole(['leader']), async (req, res) => {
    try {
        const leaderId = req.user.id;
        const stationId = req.params.stationId;

        // Verify leader manages this station
        const stationCheck = await db.query('SELECT id FROM stations WHERE id = $1 AND leader_id = $2', [stationId, leaderId]);
        if (stationCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Not authorized to view stats for this station' });
        }

        const statsQuery = `
            SELECT 
                COUNT(id) FILTER (WHERE status = 'completed') as completed_orders,
                COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0) as total_sales,
                COUNT(id) FILTER (WHERE status = 'arrived') as pending_pickup
            FROM orders
            WHERE station_id = $1
        `;
        
        const result = await db.query(statsQuery, [stationId]);
        const data = result.rows[0];
        
        // Commission Logic: 5% of total sales
        const commissionRate = 0.05;
        const totalSales = parseFloat(data.total_sales);
        const commission = totalSales * commissionRate;

        res.json({
            completed_orders: parseInt(data.completed_orders),
            pending_pickup: parseInt(data.pending_pickup),
            total_sales: totalSales,
            commission: commission
        });

    } catch (err) {
        console.error('Error fetching station stats:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to mark an order as 'completed' (picked up)
router.post('/order/:orderId/complete', authenticateToken, authorizeRole(['leader']), async (req, res) => {
    const leaderId = req.user.id;
    const orderId = req.params.orderId;
    const { pickupCode } = req.body;

    try {
        // Verify leader manages the station associated with the order and pickup code matches
        const orderCheck = await db.query(`
            SELECT o.id, o.station_id, s.leader_id, o.pickup_code, o.status
            FROM orders o
            JOIN stations s ON o.station_id = s.id
            WHERE o.id = $1
        `, [orderId]);

        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const order = orderCheck.rows[0];

        if (order.leader_id !== leaderId) {
            return res.status(403).json({ error: 'Not authorized to complete this order' });
        }

        if (order.pickup_code !== pickupCode) {
            return res.status(400).json({ error: 'Invalid pickup code' });
        }
        
        if (order.status === 'completed') {
            return res.status(400).json({ error: 'Order already completed' });
        }

        const updateResult = await db.query(
            "UPDATE orders SET status = 'completed' WHERE id = $1 AND pickup_code = $2 RETURNING id, status",
            [orderId, pickupCode]
        );

        if (updateResult.rows.length > 0) {
            res.json({ message: 'Order marked as completed', order: updateResult.rows[0] });
        } else {
            res.status(400).json({ error: 'Failed to complete order, check pickup code and order ID' });
        }
    } catch (err) {
        console.error('Error completing order:', err.message);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
