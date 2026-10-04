-- V2__seed_data.sql
-- Seed data for Project KEYSTONE
-- Password for all seed users is: password123 (BCrypt hashed)
-- BCrypt hash: $2a$10$e0MYzXyjpJS7Pd0RVvHwHe1HjJ1B6wzEw1lQWc5jJ5l/0d5U8k3m. (standard BCrypt hash of 'password123')

-- 1. Customers
INSERT INTO customers (id, name, email, phone, address, contact_person) VALUES
(1, 'Apex Commercial Real Estate', 'facilities@apexproperties.com', '+1-555-0192', '100 Metro Tower, Suite 400, Chicago, IL', 'Marcus Vance'),
(2, 'St. Jude Health System', 'maintenance@stjudehealth.org', '+1-555-0144', '500 Care Parkway, Chicago, IL', 'Dr. Sarah Lin');

SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));

-- 2. Sites
INSERT INTO sites (id, customer_id, name, address, building_code, contact_person, contact_phone) VALUES
(1, 1, 'Metro Tower North', '100 Metro Tower, North Wing, Chicago, IL', 'MT-NORTH', 'Marcus Vance', '+1-555-0192'),
(2, 1, 'Plaza Commerce Center', '250 Plaza Way, Chicago, IL', 'PLAZA-MAIN', 'Ellen Ross', '+1-555-0193'),
(3, 2, 'St. Jude Main Hospital', '500 Care Parkway, Building A, Chicago, IL', 'SJH-BLDA', 'David Kint', '+1-555-0145');

SELECT setval('sites_id_seq', (SELECT MAX(id) FROM sites));

-- 3. Users (Passwords are BCrypt hashed version of 'password123': $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a)
-- Roles: DISPATCHER, TECHNICIAN, MANAGER, CUSTOMER
INSERT INTO users (id, email, password, full_name, role, phone, customer_id) VALUES
(1, 'admin@meridian.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Eleanor Vance (Manager)', 'MANAGER', '+1-555-0100', NULL),
(2, 'dispatcher@meridian.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Dave Miller (Dispatcher)', 'DISPATCHER', '+1-555-0101', NULL),
(3, 'tech1@meridian.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Alex Rivera (HVAC Tech)', 'TECHNICIAN', '+1-555-0102', NULL),
(4, 'tech2@meridian.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Sam Chen (Plumbing/Electric Tech)', 'TECHNICIAN', '+1-555-0103', NULL),
(5, 'client@apexproperties.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Marcus Vance (Apex Customer)', 'CUSTOMER', '+1-555-0192', 1);

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 4. Inventory Parts
INSERT INTO parts (id, sku, name, description, unit_price, stock_quantity, min_stock_level) VALUES
(1, 'HVAC-FLT-2024', 'HEPA Air Filter 24x24', 'High efficiency particulate air filter for commercial AC units', 45.00, 50, 10),
(2, 'ELEC-BRK-50A', '50A Dual Pole Circuit Breaker', 'Heavy duty industrial breaker', 85.50, 20, 5),
(3, 'PLMB-VALVE-2IN', '2 Inch Brass Ball Valve', 'Press-fit ball valve for chilled water lines', 62.00, 15, 3),
(4, 'HVAC-BELT-A48', 'A48 V-Belt Drive', 'Industrial fan motor belt', 24.99, 30, 8);

SELECT setval('parts_id_seq', (SELECT MAX(id) FROM parts));

-- 5. Seed Work Orders
INSERT INTO work_orders (id, code, title, description, priority, status, customer_id, site_id, assigned_tech_id, creator_id, sla_due_date, sla_breached, total_parts_cost, total_labor_minutes, created_at) VALUES
(1, 'WO-2026-0001', 'Chiller Unit Noise & Vibration', 'Main rooftop chiller unit making severe rattling noise on Startup.', 'HIGH', 'IN_PROGRESS', 1, 1, 3, 2, NOW() + INTERVAL '24 hours', FALSE, 45.00, 120, NOW() - INTERVAL '4 hours'),
(2, 'WO-2026-0002', 'Lobby Water Leak near Elevators', 'Ceiling tile water dripping near elevator shaft floor 1.', 'CRITICAL', 'ASSIGNED', 1, 2, 4, 2, NOW() + INTERVAL '4 hours', FALSE, 0.00, 0, NOW() - INTERVAL '1 hour'),
(3, 'WO-2026-0003', 'Routine Electrical Panel Audit', 'Quarterly thermal inspection of main switchboard panel B.', 'LOW', 'NEW', 2, 3, NULL, 2, NOW() + INTERVAL '7 days', FALSE, 0.00, 0, NOW() - INTERVAL '12 hours');

SELECT setval('work_orders_id_seq', (SELECT MAX(id) FROM work_orders));

-- 6. Work Order Status History
INSERT INTO work_order_status_history (work_order_id, from_status, to_status, changed_by_id, changed_at, notes) VALUES
(1, NULL, 'NEW', 2, NOW() - INTERVAL '4 hours', 'Work order raised by dispatcher'),
(1, 'NEW', 'ASSIGNED', 2, NOW() - INTERVAL '3 hours', 'Assigned to Alex Rivera'),
(1, 'ASSIGNED', 'IN_PROGRESS', 3, NOW() - INTERVAL '2 hours', 'Technician arrived on site and started diagnosis'),
(2, NULL, 'NEW', 2, NOW() - INTERVAL '1 hour', 'Emergency call received from client'),
(2, 'NEW', 'ASSIGNED', 2, NOW() - INTERVAL '45 minutes', 'Dispatched to Sam Chen');

-- 7. Part Usage
INSERT INTO part_usages (work_order_id, part_id, quantity, unit_price, total_price, logged_by_id) VALUES
(1, 1, 1, 45.00, 45.00, 3);

-- 8. Time Log
INSERT INTO time_logs (work_order_id, technician_id, minutes_spent, note) VALUES
(1, 3, 120, 'Inspected fan motor, replaced clogged HEPA filter and tightened drive belt.');
