-- Seeds (Chinese Localized - Real Screenshot Images)

-- Users (密码均为 'password')
INSERT INTO users (username, password_hash, role, phone) VALUES
('admin', '$2b$10$edl/TpuuDLCSHBG752GIz.ia6CHV36jUUJq.F3iqgZ6U7ewKsIjOS', 'admin', '1001'),
('团长张姐', '$2b$10$edl/TpuuDLCSHBG752GIz.ia6CHV36jUUJq.F3iqgZ6U7ewKsIjOS', 'leader', '1002'),
('居民王叔', '$2b$10$edl/TpuuDLCSHBG752GIz.ia6CHV36jUUJq.F3iqgZ6U7ewKsIjOS', 'customer', '1003'),
('居民李妹', '$2b$10$edl/TpuuDLCSHBG752GIz.ia6CHV36jUUJq.F3iqgZ6U7ewKsIjOS', 'customer', '1004');

-- Stations
INSERT INTO stations (leader_id, name, address) VALUES
((SELECT id FROM users WHERE username='团长张姐'), '阳光小区便民自提点', 'A栋 101室 (张姐小卖部)');

-- Products
INSERT INTO products (name, description, category, base_price, shelf_life_days, image_url) VALUES
('精品肥牛卷 (500g)', '谷饲原切，肥瘦相间，火锅必点。', '肉禽', 32.00, 180, '/images/hotpot-beef.jpg'),
('手切鲜羊肉 (300g)', '鲜嫩不膻，立盘不倒，冬季滋补。', '肉禽', 38.00, 2, '/images/hotpot-lamb.jpg'),
('极品鲜毛肚 (200g)', '颗粒分明，七上八下，爽脆化渣。', '火锅丸滑', 25.00, 3, '/images/hotpot-tripe-proxy.jpg'),
('潮汕牛肉丸 (250g)', '手工捶打，Q弹爆汁，正宗潮汕味。', '火锅丸滑', 22.00, 30, '/images/hotpot-meatballs.jpg'),
('四川宽粉 (400g)', '红薯淀粉制作，久煮不烂，吸汁神器。', '素食', 8.00, 90, '/images/hotpot-noodles.jpg'),
('金针菇 (300g)', '菌盖饱满，口感滑嫩，火锅伴侣。', '蔬菜', 3.50, 5, '/images/hotpot-enoki.jpg'),
('红颜草莓 (丹东直发 1斤)', '奶香浓郁，个大红透，现摘现发。', '水果', 29.90, 3, '/images/fruit-strawberry.jpg'),
('智利车厘子 (JJ级 500g)', '紫红黑亮，脆甜多汁，空运直达。', '水果', 45.00, 5, '/images/fruit-cherry.jpg'),
('春见粑粑柑 (3斤装)', '皮薄易剥，果肉细嫩，爆珠口感。', '水果', 19.90, 7, '/images/fruit-orange.jpg'),
('鲜土鸡蛋 (30枚)', '林下散养，蛋黄橙红，营养丰富。', '蛋品', 25.00, 15, '/images/daily-eggs.jpg'),
('纯牛奶 (1L)', '优质乳蛋白，早餐必备，全家适用。', '乳品', 10.00, 10, '/images/daily-milk.jpg'),
('小油菜 (500g)', '翠绿鲜嫩，无公害种植，今日采摘。', '蔬菜', 2.50, 3, '/images/daily-veg.jpg');

-- Group Buys (Events)
INSERT INTO group_buys (title, start_time, end_time, status) VALUES
('🥘 冬日火锅暖心局', NOW(), NOW() + INTERVAL '2 days', 'active'),
('🍒 车厘子草莓尝鲜季', NOW(), NOW() + INTERVAL '5 days', 'active'),
('🍳 每日早餐·元气满满', NOW(), NOW() + INTERVAL '1 day', 'active');

-- Group Buy Items (火锅)
INSERT INTO group_buy_items (group_buy_id, product_id, price, stock) VALUES
((SELECT id FROM group_buys WHERE title='🥘 冬日火锅暖心局'), (SELECT id FROM products WHERE name='精品肥牛卷 (500g)'), 28.80, 100),
((SELECT id FROM group_buys WHERE title='🥘 冬日火锅暖心局'), (SELECT id FROM products WHERE name='手切鲜羊肉 (300g)'), 35.00, 50),
((SELECT id FROM group_buys WHERE title='🥘 冬日火锅暖心局'), (SELECT id FROM products WHERE name='极品鲜毛肚 (200g)'), 19.90, 80),
((SELECT id FROM group_buys WHERE title='🥘 冬日火锅暖心局'), (SELECT id FROM products WHERE name='潮汕牛肉丸 (250g)'), 18.80, 100),
((SELECT id FROM group_buys WHERE title='🥘 冬日火锅暖心局'), (SELECT id FROM products WHERE name='四川宽粉 (400g)'), 5.90, 200),
((SELECT id FROM group_buys WHERE title='🥘 冬日火锅暖心局'), (SELECT id FROM products WHERE name='金针菇 (300g)'), 1.90, 150);

-- Group Buy Items (水果)
INSERT INTO group_buy_items (group_buy_id, product_id, price, stock) VALUES
((SELECT id FROM group_buys WHERE title='🍒 车厘子草莓尝鲜季'), (SELECT id FROM products WHERE name='红颜草莓 (丹东直发 1斤)'), 25.80, 60),
((SELECT id FROM group_buys WHERE title='🍒 车厘子草莓尝鲜季'), (SELECT id FROM products WHERE name='智利车厘子 (JJ级 500g)'), 39.90, 80),
((SELECT id FROM group_buys WHERE title='🍒 车厘子草莓尝鲜季'), (SELECT id FROM products WHERE name='春见粑粑柑 (3斤装)'), 15.80, 100);

-- Group Buy Items (早餐)
INSERT INTO group_buy_items (group_buy_id, product_id, price, stock) VALUES
((SELECT id FROM group_buys WHERE title='🍳 每日早餐·元气满满'), (SELECT id FROM products WHERE name='鲜土鸡蛋 (30枚)'), 19.90, 200),
((SELECT id FROM group_buys WHERE title='🍳 每日早餐·元气满满'), (SELECT id FROM products WHERE name='纯牛奶 (1L)'), 8.80, 120),
((SELECT id FROM group_buys WHERE title='🍳 每日早餐·元气满满'), (SELECT id FROM products WHERE name='小油菜 (500g)'), 0.99, 300);

-- Products (Seafood)
INSERT INTO products (name, description, category, base_price, shelf_life_days, image_url) VALUES
('大闸蟹 (4两/只)', '公蟹黄满膏肥，鲜美无比。', '水产', 45.00, 2, '/images/seafood-crab.jpg'),
('基围虾 (鲜活 1斤)', '个大生猛，肉质紧实Q弹。', '水产', 35.00, 1, '/images/seafood-shrimp.jpg'),
('冷冻带鱼段 (中段 1kg)', '舟山带鱼，肉厚刺少，红烧首选。', '水产', 29.90, 180, '/images/seafood-fish.jpg');

-- Products (Veggies)
INSERT INTO products (name, description, category, base_price, shelf_life_days, image_url) VALUES
('普罗旺斯西红柿 (2斤)', '沙瓤多汁，生吃做菜两相宜。', '蔬菜', 8.90, 5, '/images/veg-tomato.jpg'),
('水果黄瓜 (3根)', '清脆爽口，低脂健康零食。', '蔬菜', 5.90, 4, '/images/veg-cucumber.jpg'),
('黄心土豆 (5斤)', '软糯香甜，适合炖牛腩。', '蔬菜', 9.90, 15, '/images/veg-potato.jpg');

-- Products (Snacks)
INSERT INTO products (name, description, category, base_price, shelf_life_days, image_url) VALUES
('可口可乐 (330ml*6罐)', '快乐肥宅水，聚会必备。', '酒水', 12.90, 365, '/images/snack-coke.jpg'),
('乐事薯片 (原味 75g)', '经典原味，薄脆爽口。', '零食', 6.50, 180, '/images/snack-chips.jpg'),
('精酿小麦啤 (500ml)', '麦香浓郁，泡沫丰富。', '酒水', 8.00, 180, '/images/snack-beer.jpg');

-- Group Buys (New Events)
INSERT INTO group_buys (title, start_time, end_time, status) VALUES
('🦀 鲜活海鲜·刚下船', NOW(), NOW() + INTERVAL '2 days', 'active'),
('🥬 田园时蔬·0农残', NOW(), NOW() + INTERVAL '3 days', 'active'),
('🥤 周末狂欢·零食酒水', NOW(), NOW() + INTERVAL '7 days', 'active');

-- Group Buy Items (Seafood)
INSERT INTO group_buy_items (group_buy_id, product_id, price, stock) VALUES
((SELECT id FROM group_buys WHERE title='🦀 鲜活海鲜·刚下船'), (SELECT id FROM products WHERE name='大闸蟹 (4两/只)'), 39.90, 50),
((SELECT id FROM group_buys WHERE title='🦀 鲜活海鲜·刚下船'), (SELECT id FROM products WHERE name='基围虾 (鲜活 1斤)'), 29.90, 80),
((SELECT id FROM group_buys WHERE title='🦀 鲜活海鲜·刚下船'), (SELECT id FROM products WHERE name='冷冻带鱼段 (中段 1kg)'), 25.90, 100);

-- Group Buy Items (Veggies)
INSERT INTO group_buy_items (group_buy_id, product_id, price, stock) VALUES
((SELECT id FROM group_buys WHERE title='🥬 田园时蔬·0农残'), (SELECT id FROM products WHERE name='普罗旺斯西红柿 (2斤)'), 7.90, 150),
((SELECT id FROM group_buys WHERE title='🥬 田园时蔬·0农残'), (SELECT id FROM products WHERE name='水果黄瓜 (3根)'), 4.90, 200),
((SELECT id FROM group_buys WHERE title='🥬 田园时蔬·0农残'), (SELECT id FROM products WHERE name='黄心土豆 (5斤)'), 8.50, 300);

-- Group Buy Items (Snacks)
INSERT INTO group_buy_items (group_buy_id, product_id, price, stock) VALUES
((SELECT id FROM group_buys WHERE title='🥤 周末狂欢·零食酒水'), (SELECT id FROM products WHERE name='可口可乐 (330ml*6罐)'), 11.50, 120),
((SELECT id FROM group_buys WHERE title='🥤 周末狂欢·零食酒水'), (SELECT id FROM products WHERE name='乐事薯片 (原味 75g)'), 5.90, 200),
((SELECT id FROM group_buys WHERE title='🥤 周末狂欢·零食酒水'), (SELECT id FROM products WHERE name='精酿小麦啤 (500ml)'), 6.90, 150);