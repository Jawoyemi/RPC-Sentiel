"""
Script to add default BlockDAG RPC providers to the database.
Run this after creating a user account to automatically add the default providers.
"""
import asyncio
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Provider, User

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def add_default_providers(user_id: int):
    """Add default BlockDAG RPC providers for a user"""
    db = SessionLocal()
    
    try:
        # Check if user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            print(f"Error: User with ID {user_id} not found")
            return
        
        # Define default providers
        default_providers = [
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
        for provider_data in default_providers:
            # Check if provider already exists for this user
            existing = db.query(Provider).filter(
                Provider.user_id == user_id,
                Provider.url == provider_data["url"]
            ).first()
            
            if existing:
                print(f"Provider '{provider_data['name']}' already exists, skipping...")
                continue
            
            # Create new provider
            provider = Provider(
                user_id=user_id,
                name=provider_data["name"],
                url=provider_data["url"],
                description=provider_data["description"]
            )
            db.add(provider)
            print(f"Added provider: {provider_data['name']}")
        
        db.commit()
        print("\n✅ Default providers added successfully!")
        
    except Exception as e:
        print(f"Error adding providers: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("=== Add Default BlockDAG RPC Providers ===\n")
    
    # Get user ID
    try:
        user_id = int(input("Enter your user ID (check after registration): "))
        add_default_providers(user_id)
    except ValueError:
        print("Error: Please enter a valid user ID (number)")
    except KeyboardInterrupt:
        print("\n\nCancelled by user")
