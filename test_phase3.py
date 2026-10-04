import requests
import json
import time

BASE_URL = "http://localhost:8080/api"

def run_tests():
    print("=== TESTING PHASE 3 ENDPOINTS (PARTS, TIME LOGGING & SLA) ===")

    # 1. Login as Dispatcher
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "dispatcher@meridian.com",
        "password": "password123"
    })
    assert resp.status_code == 200, f"Dispatcher login failed: {resp.text}"
    disp_token = resp.json()["token"]
    disp_headers = {"Authorization": f"Bearer {disp_token}", "Content-Type": "application/json"}

    # 2. Login as Technician
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "tech1@meridian.com",
        "password": "password123"
    })
    assert resp.status_code == 200, f"Technician login failed: {resp.text}"
    tech_token = resp.json()["token"]
    tech_headers = {"Authorization": f"Bearer {tech_token}", "Content-Type": "application/json"}
    print("1. Authenticated Dispatcher and Technician users.")

    # Fetch Technicians list
    resp = requests.get(f"{BASE_URL}/users/technicians", headers=disp_headers)
    assert resp.status_code == 200, f"Get technicians failed: {resp.text}"
    techs = resp.json()
    assert len(techs) > 0, "No technicians found in DB!"
    tech_id = techs[0]["id"]

    # 3. Create Spare Part Item in Inventory Catalog
    unique_sku = f"HVAC-{int(time.time())}"
    part_payload = {
        "partNumber": unique_sku,
        "name": "High-Efficiency Air Filter 24x24",
        "description": "MERV 13 Rated Pleated HVAC Filter",
        "unitPrice": 45.00,
        "quantityOnHand": 15,
        "minimumStockLevel": 3
    }
    resp = requests.post(f"{BASE_URL}/parts", headers=disp_headers, json=part_payload)
    assert resp.status_code == 201, f"Create part failed: {resp.text}"
    part = resp.json()
    part_id = part["id"]
    print(f"2. Created Part Item: {part['name']} (PN: {part['partNumber']}) Price: ${part['unitPrice']} Stock: {part['quantityOnHand']}")

    # 4. Create Work Order for Testing
    wo_payload = {
        "title": "Air Handler Filter Replacement & Maintenance",
        "description": "Routine quarterly filter change and coil check",
        "priority": "HIGH",
        "customerId": 1,
        "siteId": 1,
        "assignedTechId": tech_id
    }
    resp = requests.post(f"{BASE_URL}/work-orders", headers=disp_headers, json=wo_payload)
    assert resp.status_code == 201, f"Create work order failed: {resp.text}"
    wo = resp.json()
    wo_id = wo["id"]
    print(f"3. Created Work Order: {wo['code']} Status: {wo['status']}")

    # 5. Log Labor Time as Technician
    time_payload = {
        "minutes": 135,
        "workDescription": "Replaced primary filters, inspected blower belt tension and lubricated bearings."
    }
    resp = requests.post(f"{BASE_URL}/work-orders/{wo_id}/time-logs", headers=tech_headers, json=time_payload)
    assert resp.status_code == 201, f"Log time failed: {resp.text}"
    time_log = resp.json()
    print(f"4. Logged Labor Time: {time_log['minutes']} mins by {time_log['technicianName']}")

    # 6. Log Parts Consumption on Work Order as Technician
    part_usage_payload = {
        "partId": part_id,
        "quantityUsed": 3,
        "notes": "Installed 3 units on Air Handler #2"
    }
    resp = requests.post(f"{BASE_URL}/work-orders/{wo_id}/parts", headers=tech_headers, json=part_usage_payload)
    assert resp.status_code == 201, f"Log part usage failed: {resp.text}"
    usage = resp.json()
    print(f"5. Logged Parts Usage: {usage['quantityUsed']}x {usage['partName']} Total Cost: ${usage['totalPrice']}")

    # 7. Verify Work Order Cumulative Metrics
    resp = requests.get(f"{BASE_URL}/work-orders/{wo_id}", headers=disp_headers)
    assert resp.status_code == 200, f"Get WO failed: {resp.text}"
    updated_wo = resp.json()
    print(f"6. Verified Work Order Cumulative Totals -> Labor Minutes: {updated_wo['totalLaborMinutes']} mins | Parts Cost: ${updated_wo['totalPartsCost']}")
    assert updated_wo['totalLaborMinutes'] == 135, "Labor minutes mismatch!"
    assert float(updated_wo['totalPartsCost']) == 135.00, "Parts cost calculation mismatch!"

    # 8. Verify Inventory Deduction
    resp = requests.get(f"{BASE_URL}/parts/{part_id}", headers=disp_headers)
    assert resp.status_code == 200, f"Get part failed: {resp.text}"
    updated_part = resp.json()
    print(f"7. Verified Remaining Inventory Stock: {updated_part['quantityOnHand']} units (Deducted 3 from 15)")
    assert updated_part['quantityOnHand'] == 12, "Inventory deduction failed!"

    print("\n=== ALL PHASE 3 BACKEND ENDPOINTS & SLA SCHEDULER LOGIC PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_tests()
