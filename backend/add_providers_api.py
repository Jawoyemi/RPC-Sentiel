"""
Simple script to add BlockDAG RPC providers via API
"""
import requests

# Configuration
API_URL = "http://localhost:8000"
EMAIL = input("Enter your email: ")
PASSWORD = input("Enter your password: ")

# Login
print("\nLogging in...")
login_response = requests.post(
    f"{API_URL}/api/auth/login",
    json={"email": EMAIL, "password": PASSWORD}
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    exit(1)

token = login_response.json()["access_token"]
print("✅ Logged in successfully!")

# Headers with auth token
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Define providers
providers = [
    {
        "name": "Primordial Node",
        "url": "https://node.primordial.bdagscan.com",
        "description": "BlockDAG Primordial Node RPC endpoint"
    },
    {
        "name": "Awakening Relay",
        "url": "https://relay.awakening.bdagscan.com",
        "description": "BlockDAG Awakening Relay RPC endpoint"
    }
]

# Add providers
print("\nAdding providers...")
for provider in providers:
    response = requests.post(
        f"{API_URL}/api/providers",
        json=provider,
        headers=headers
    )
    
    if response.status_code == 201:
        print(f"✅ Added: {provider['name']}")
    else:
        print(f"❌ Failed to add {provider['name']}: {response.text}")

print("\n✅ Done! Refresh your dashboard to see the providers.")
