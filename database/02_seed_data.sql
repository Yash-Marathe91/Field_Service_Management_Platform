-- =============================================================================
-- Project KEYSTONE - Field Service Management Platform
-- Seed Data Initialization Script
-- Note: Password for all seed users is 'password123' (BCrypt hashed)
-- =============================================================================

-- 1. Customers
INSERT INTO customers (id, name, email, phone, address, contact_person) VALUES
(1, 'Apex Commercial Real Estate', 'facilities@apexproperties.com', '+1-555-0192', '100 Metro Tower, Suite 400, Chicago, IL', 'Marcus Vance'),
(2, 'St. Jude Health System', 'maintenance@stjudehealth.org', '+1-555-0144', '500 Care Parkway, Chicago, IL', 'Dr. Sarah Lin'),
(3, 'Nexus Logistics Hub', 'ops@nexuslogistics.com', '+1-555-0188', '88 Freight Way, Elk Grove, IL', 'Elena Rostova')
ON CONFLICT (id) DO NOTHING;

SELECT setval('customers_id_seq', COALESCE((SELECT MAX(id) FROM customers), 1));

-- 2. Customer Facility Sites
INSERT INTO sites (id, customer_id, name, address, building_code, contact_person, contact_phone) VALUES
(1, 1, 'Metro Tower North', '100 Metro Tower, North Wing, Chicago, IL', 'MT-NORTH', 'Marcus Vance', '+1-555-0192'),
(2, 1, 'Plaza Commerce Center', '250 Plaza Way, Chicago, IL', 'PLAZA-MAIN', 'Ellen Ross', '+1-555-0193'),
(3, 2, 'St. Jude Main Hospital', '500 Care Parkway, Building A, Chicago, IL', 'SJH-BLDA', 'David Kint', '+1-555-0145'),
(4, 3, 'Warehouse Distribution Center 1', '88 Freight Way, Dock 4, Elk Grove, IL', 'NEX-WH1', 'Elena Rostova', '+1-555-0188')
ON CONFLICT (id) DO NOTHING;

SELECT setval('sites_id_seq', COALESCE((SELECT MAX(id) FROM sites), 1));

-- 3. Users (Manager, Dispatcher, Technicians, Customer)
-- All accounts use password: password123
INSERT INTO users (id, email, password, full_name, role, phone, customer_id) VALUES
(1, 'admin@meridian.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Eleanor Vance (Manager)', 'MANAGER', '+1-555-0100', NULL),
(2, 'dispatcher@meridian.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Dave Miller (Dispatcher)', 'DISPATCHER', '+1-555-0101', NULL),
(3, 'tech1@meridian.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Alex Rivera (HVAC Tech)', 'TECHNICIAN', '+1-555-0102', NULL),
(4, 'tech2@meridian.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Sam Chen (Plumbing/Electric Tech)', 'TECHNICIAN', '+1-555-0103', NULL),
(5, 'client@apexproperties.com', '$2b$10$1Ews0vLcKEYD2EwOd4/yYe33KLjyReIsqDJi2dhZAXXJBM5I8FYDy', 'Marcus Vance (Apex Customer)', 'CUSTOMER', '+1-555-0192', 1)
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));

-- 4. Inventory Parts Catalog
INSERT INTO parts (id, sku, name, description, unit_price, stock_quantity, min_stock_level) VALUES
(1, 'HVAC-FLT-2024', 'HEPA Air Filter 24x24', 'High efficiency particulate air filter for commercial AC units', 45.00, 50, 10),
(2, 'ELEC-BRK-50A', '50A Dual Pole Circuit Breaker', 'Heavy duty industrial breaker', 85.50, 20, 5),
(3, 'PLMB-VALVE-2IN', '2 Inch Brass Ball Valve', 'Press-fit ball valve for chilled water lines', 62.00, 15, 3),
(4, 'HVAC-BELT-A48', 'A48 V-Belt Drive', 'Industrial fan motor belt', 24.99, 30, 8),
(5, 'ELEC-CONT-3P', '3-Pole Magnetic Contactor 40A', 'Definite purpose contactor for AC compressors', 38.50, 12, 4)
ON CONFLICT (id) DO NOTHING;

SELECT setval('parts_id_seq', COALESCE((SELECT MAX(id) FROM parts), 1));

-- 5. Seed Work Orders
INSERT INTO work_orders (id, code, title, description, priority, status, customer_id, site_id, assigned_tech_id, creator_id, sla_due_date, sla_breached, total_parts_cost, total_labor_minutes, created_at) VALUES
(1, 'WO-2026-0001', 'Chiller Unit Noise & Vibration', 'Main rooftop chiller unit making severe rattling noise on startup.', 'HIGH', 'IN_PROGRESS', 1, 1, 3, 2, NOW() + INTERVAL '24 hours', FALSE, 45.00, 120, NOW() - INTERVAL '4 hours'),
(2, 'WO-2026-0002', 'Lobby Water Leak near Elevators', 'Ceiling tile water dripping near elevator shaft floor 1.', 'CRITICAL', 'ASSIGNED', 1, 2, 4, 2, NOW() + INTERVAL '4 hours', FALSE, 0.00, 0, NOW() - INTERVAL '1 hour'),
(3, 'WO-2026-0003', 'Routine Electrical Panel Audit', 'Quarterly thermal inspection of main switchboard panel B.', 'LOW', 'NEW', 2, 3, NULL, 2, NOW() + INTERVAL '7 days', FALSE, 0.00, 0, NOW() - INTERVAL '12 hours'),
(4, 'WO-2026-0004', 'Emergency Generator Fuel Sensor Fault', 'Primary backup generator fault code 204 fuel flow indicator.', 'CRITICAL', 'IN_PROGRESS', 2, 3, 4, 2, NOW() + INTERVAL '2 hours', FALSE, 85.50, 90, NOW() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;

SELECT setval('work_orders_id_seq', COALESCE((SELECT MAX(id) FROM work_orders), 1));

-- 6. Work Order Status History
INSERT INTO work_order_status_history (work_order_id, from_status, to_status, changed_by_id, changed_at, notes) VALUES
(1, NULL, 'NEW', 2, NOW() - INTERVAL '4 hours', 'Work order raised by dispatcher'),
(1, 'NEW', 'ASSIGNED', 2, NOW() - INTERVAL '3 hours', 'Assigned to Alex Rivera (HVAC Tech)'),
(1, 'ASSIGNED', 'IN_PROGRESS', 3, NOW() - INTERVAL '2 hours', 'Technician arrived on site and started diagnosis'),
(2, NULL, 'NEW', 2, NOW() - INTERVAL '1 hour', 'Emergency call received from client Marcus Vance'),
(2, 'NEW', 'ASSIGNED', 2, NOW() - INTERVAL '45 minutes', 'Dispatched to Sam Chen for water containment'),
(4, NULL, 'NEW', 2, NOW() - INTERVAL '2 hours', 'Telemetry alarm received from St. Jude hospital generator'),
(4, 'NEW', 'ASSIGNED', 2, NOW() - INTERVAL '1 hour 45 minutes', 'Assigned to Sam Chen'),
(4, 'ASSIGNED', 'IN_PROGRESS', 4, NOW() - INTERVAL '1 hour 30 minutes', 'Sam Chen arrived at facility');

-- 7. Parts Consumption Logs
INSERT INTO part_usages (work_order_id, part_id, quantity, unit_price, total_price, logged_by_id, notes) VALUES
(1, 1, 1, 45.00, 45.00, 3, 'Replaced damaged rooftop filter assembly'),
(4, 2, 1, 85.50, 85.50, 4, 'Replaced faulty secondary breaker on control panel');

-- 8. Technician Labor Time Logs
INSERT INTO time_logs (work_order_id, technician_id, minutes_spent, note) VALUES
(1, 3, 120, 'Inspected fan motor, replaced clogged HEPA filter and tightened drive belt.'),
(4, 4, 90, 'Diagnosed sensor signal failure, replaced control circuit breaker, tested run cycle.');
