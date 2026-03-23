-- View: Pending Orders per Station (For Group Leaders)
CREATE OR REPLACE VIEW view_station_pending_deliveries AS
SELECT 
    o.id AS order_id,
    o.station_id,
    u.username AS customer_name,
    u.phone AS customer_phone,
    o.total_amount,
    o.status,
    o.pickup_code,
    gb.title AS group_buy_title,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN group_buys gb ON o.group_buy_id = gb.id
WHERE o.status IN ('paid', 'shipped', 'arrived');

-- View: Sales Statistics per Group Buy Product
CREATE OR REPLACE VIEW view_group_buy_sales AS
SELECT 
    gbi.group_buy_id,
    gb.title AS group_buy_title,
    p.name AS product_name,
    gbi.price,
    gbi.stock AS remaining_stock,
    gbi.sold_count,
    (gbi.sold_count * gbi.price) AS total_revenue
FROM group_buy_items gbi
JOIN products p ON gbi.product_id = p.id
JOIN group_buys gb ON gbi.group_buy_id = gb.id;
