import subprocess
import os
import bcrypt
import urllib.request
import json

def update_db_passwords():
    pwd_hash = bcrypt.hashpw(b'password123', bcrypt.gensalt(10)).decode('utf-8')
    print("Generated BCrypt Hash:", pwd_hash)
    
    env = os.environ.copy()
    env['PGPASSWORD'] = 'postgres'
    sql = f"UPDATE users SET password = '{pwd_hash}';"
    cmd = ['psql', '-U', 'postgres', '-h', '127.0.0.1', '-d', 'keystone_db', '-c', sql]
    res = subprocess.run(cmd, capture_output=True, text=True, env=env)
    print("DB Update Output:", res.stdout.strip())

def test_login(email, password):
    url = 'http://localhost:8080/api/auth/login'
    data = json.dumps({'email': email, 'password': password}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            role = res.get('role')
            name = res.get('fullName')
            uid = res.get('userId')
            print(f"SUCCESS [{role}]: {name} (ID: {uid}) Token: {res.get('token')[:20]}...")
            return res.get('token')
    except Exception as e:
        print(f"FAILED {email}:", e)

def test_me(token):
    url = 'http://localhost:8080/api/auth/me'
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            print(f"VERIFIED /api/auth/me -> User: {res.get('fullName')}, Role: {res.get('role')}")
    except Exception as e:
        print("FAILED /api/auth/me:", e)

if __name__ == '__main__':
    update_db_passwords()
    print("\n=== TESTING ALL 4 SEED LOGINS ===")
    t1 = test_login('admin@meridian.com', 'password123')
    test_login('dispatcher@meridian.com', 'password123')
    test_login('tech1@meridian.com', 'password123')
    test_login('client@apexproperties.com', 'password123')
    print("\n=== TESTING /api/auth/me ===")
    test_me(t1)

