import requests
import json

BASE_URL = "http://localhost:8080/api"

def run_tests():
    print("=== TESTING PHASE 4 ANALYTICS & METRICS ENDPOINTS ===")

    # 1. Login as Dispatcher
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "dispatcher@meridian.com",
        "password": "password123"
    })
    assert resp.status_code == 200, f"Dispatcher login failed: {resp.text}"
    disp_token = resp.json()["token"]
    disp_headers = {"Authorization": f"Bearer {disp_token}", "Content-Type": "application/json"}

    # 2. Fetch Operational Dashboard Metrics
    resp = requests.get(f"{BASE_URL}/dashboard/metrics", headers=disp_headers)
    assert resp.status_code == 200, f"Get metrics failed: {resp.text}"
    metrics = resp.json()

    print("\n--- EXECUTIVE ANALYTICS DASHBOARD METRICS ---")
    print(f"Total Work Orders: {metrics['totalWorkOrders']}")
    print(f"Active Orders: {metrics['activeWorkOrders']}")
    print(f"Completed Orders: {metrics['completedWorkOrders']}")
    print(f"SLA Breached Orders: {metrics['slaBreachedOrders']}")
    print(f"Total Parts Cost (All Time): ${metrics['totalPartsCostAllTime']}")
    print(f"Total Labor Minutes (All Time): {metrics['totalLaborMinutesAllTime']} mins")
    
    print("\nStatus Distribution:")
    for status, count in metrics['statusBreakdown'].items():
        print(f"  - {status}: {count}")

    print("\nPriority Distribution:")
    for priority, count in metrics['priorityBreakdown'].items():
        print(f"  - {priority}: {count}")

    print("\nTechnician Active Workloads:")
    for tech in metrics['technicianWorkload']:
        print(f"  - {tech['name']} ({tech['email']}): {tech['activeAssignedOrders']} active tasks")

    assert metrics['totalWorkOrders'] >= 0, "Invalid total work orders!"
    assert 'statusBreakdown' in metrics, "Missing status breakdown!"
    assert 'technicianWorkload' in metrics, "Missing technician workload list!"

    print("\n=== ALL PHASE 4 ANALYTICS ENDPOINTS PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_tests()
