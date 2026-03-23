-- Stored Procedure for Placing an Order with Concurrency Control
CREATE OR REPLACE PROCEDURE place_order(
    p_user_id INT,
    p_station_id INT,
    p_group_buy_id INT,
    p_product_ids INT[],
    p_quantities INT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id INT;
    v_total_amount DECIMAL(10, 2) := 0;
    v_item_price DECIMAL(10, 2);
    v_current_stock INT;
    i INT;
    v_pid INT;
    v_qty INT;
BEGIN
    -- 1. Verify Arrays match length
    IF array_length(p_product_ids, 1) != array_length(p_quantities, 1) THEN
        RAISE EXCEPTION 'Product IDs and Quantities arrays must be of same length';
    END IF;

    -- 2. Create the Order (Initial Status: Paid - Simulating instant payment)
    INSERT INTO orders (user_id, station_id, group_buy_id, total_amount, status, pickup_code)
    VALUES (p_user_id, p_station_id, p_group_buy_id, 0, 'paid', substr(md5(random()::text), 1, 6))
    RETURNING id INTO v_order_id;

    -- 3. Loop through items to process stock and insert order_items
    FOR i IN 1 .. array_length(p_product_ids, 1) LOOP
        v_pid := p_product_ids[i];
        v_qty := p_quantities[i];

        -- Lock the inventory row for update to prevent race conditions
        SELECT stock, price INTO v_current_stock, v_item_price
        FROM group_buy_items
        WHERE group_buy_id = p_group_buy_id AND product_id = v_pid
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product % not found in Group Buy %', v_pid, p_group_buy_id;
        END IF;

        IF v_current_stock < v_qty THEN
            RAISE EXCEPTION 'Insufficient stock for Product % (Requested: %, Available: %)', v_pid, v_qty, v_current_stock;
        END IF;

        -- Deduct Stock
        UPDATE group_buy_items
        SET stock = stock - v_qty
        WHERE group_buy_id = p_group_buy_id AND product_id = v_pid;

        -- Insert Order Item
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (v_order_id, v_pid, v_qty, v_item_price);

        -- Accumulate Total
        v_total_amount := v_total_amount + (v_item_price * v_qty);
    END LOOP;

    -- 4. Update Order Total
    UPDATE orders
    SET total_amount = v_total_amount
    WHERE id = v_order_id;

    COMMIT;
END;
$$;
