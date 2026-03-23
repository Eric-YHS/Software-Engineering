-- Function to check if Group Buy is active before placing order
CREATE OR REPLACE FUNCTION check_group_buy_active_func()
RETURNS TRIGGER AS $$
DECLARE
    gb_status VARCHAR;
BEGIN
    SELECT status INTO gb_status FROM group_buys WHERE id = NEW.group_buy_id;
    
    IF gb_status != 'active' THEN
        RAISE EXCEPTION 'Cannot place order for a Group Buy that is not active (Status: %)', gb_status;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_group_buy_active_trigger
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION check_group_buy_active_func();

-- Function to update sold_count in group_buy_items when an order item is added
CREATE OR REPLACE FUNCTION update_sold_count_func()
RETURNS TRIGGER AS $$
DECLARE
    p_group_buy_id INT;
BEGIN
    -- Get group_buy_id from the parent order
    SELECT group_buy_id INTO p_group_buy_id FROM orders WHERE id = NEW.order_id;

    -- Update the sold_count
    UPDATE group_buy_items
    SET sold_count = sold_count + NEW.quantity
    WHERE group_buy_id = p_group_buy_id AND product_id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sold_count_trigger
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_sold_count_func();
