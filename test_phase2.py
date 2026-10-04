import urllib.request
import json

BASE_URL = 'http://localhost:8080/api'

def request(method, path, body=None, token=None):
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode('utf-8') if body else None
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} on {method} {path}:", e.read().decode('utf-8'))
        raise e

def run_tests():
    print("=== TESTING PHASE 2 ENDPOINTS ===")
    
    # 1. Login as Dispatcher
    login_res = request('POST', '/auth/login', {'email': 'dispatcher@meridian.com', 'password': 'password123'})
    token = login_res['token']
    print("1. Logged in as Dispatcher:", login_res['fullName'])

    # 2. Get Customers
    customers = request('GET', '/customers', token=token)
    print("2. Customers retrieved:", len(customers['content']), "Total:", customers['totalElements'])

    # 3. Create New Customer
    new_cust = request('POST', '/customers', {
        'name': 'Quantum Tech Solutions',
        'email': 'contact@quantum.io',
        'phone': '+1-555-0999',
        'address': '500 Innovation Way, Tech Park',
        'contactPerson': 'Sarah Connor'
    }, token=token)
    print("3. Created Customer:", new_cust['name'], "ID:", new_cust['id'])

    # 4. Create Site for Customer
    new_site = request('POST', '/sites', {
        'customerId': new_cust['id'],
        'name': 'Quantum Data Center A',
        'address': '500 Innovation Way, Building B',
        'buildingCode': 'DC-A',
        'contactPerson': 'Dave Connor',
        'contactPhone': '+1-555-0998'
    }, token=token)
    print("4. Created Site:", new_site['name'], "ID:", new_site['id'])

    # 5. List Sites for Customer
    cust_sites = request('GET', f"/customers/{new_cust['id']}/sites", token=token)
    print("5. Customer Sites Count:", len(cust_sites))

    # 6. List Technicians
    techs = request('GET', '/users/technicians', token=token)
    print("6. Available Technicians Count:", len(techs), "First Tech:", techs[0]['fullName'])

    # 7. Create Work Order
    wo = request('POST', '/work-orders', {
        'title': 'Server Cooling Fan Replacement',
        'description': 'Main rack fan 4 in unit B12 is making loud rattling noises and running hot.',
        'priority': 'HIGH',
        'customerId': new_cust['id'],
        'siteId': new_site['id'],
        'assignedTechId': techs[0]['id']
    }, token=token)
    print("7. Created Work Order Code:", wo['code'], "Status:", wo['status'], "SLA Due:", wo['slaDueDate'])

    # 8. Transition Status to IN_PROGRESS
    updated_wo = request('PATCH', f"/work-orders/{wo['id']}/status", {
        'status': 'IN_PROGRESS',
        'notes': 'Technician arrived on site and started diagnosis.'
    }, token=token)
    print("8. Transitioned Status to:", updated_wo['status'], "History Length:", len(updated_wo['history']))

    # 9. Query Work Orders List (Filterable)
    wo_list = request('GET', '/work-orders?status=IN_PROGRESS', token=token)
    print("9. Work Orders in IN_PROGRESS:", wo_list['totalElements'])

    print("\n=== ALL PHASE 2 BACKEND ENDPOINTS PASSED SUCCESSFULLY ===")

if __name__ == '__main__':
    run_tests()
