"""
Test script to verify the backend auth endpoints are working
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    """Test user registration"""
    print("Testing registration...")
    url = f"{BASE_URL}/api/auth/register"
    data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            return response.json()
        else:
            print(f"❌ Registration failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_login():
    """Test user login"""
    print("\nTesting login...")
    url = f"{BASE_URL}/api/auth/login"
    data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return response.json()
        else:
            print(f"❌ Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    url = f"{BASE_URL}/health"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Backend is healthy!")
            return True
        else:
            print(f"❌ Health check failed")
            return False
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")
        return False


if __name__ == "__main__":
    print("=== RPC Sentinel Backend API Test ===\n")
    
    # Test health first
    if not test_health():
        print("\n❌ Backend is not running or not accessible!")
        exit(1)
    
    # Test registration
    print("\n" + "="*50)
    test_register()
    
    # Test login
    print("\n" + "="*50)
    test_login()
