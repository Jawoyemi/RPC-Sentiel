import httpx
import time
from datetime import datetime
from sqlalchemy.orm import Session

from models import Provider, HealthCheck, Alert


async def check_provider_health(provider: Provider, db: Session) -> HealthCheck:
    """
    Check the health of an RPC provider by making a test request
    """
    start_time = time.time()
    status = "offline"
    response_time_ms = None
    error_message = None
    
    try:
        # Make a simple JSON-RPC request to check if the endpoint is alive
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Try BlockDAG-specific methods first, then fallback to generic methods
            methods_to_try = [
                "getBlockCount",      # BlockDAG method
                "getInfo",            # BlockDAG method
                "eth_blockNumber",    # Ethereum fallback
                "net_version"         # Generic fallback
            ]
            
            response = None
            for method in methods_to_try:
                try:
                    payload = {
                        "jsonrpc": "2.0",
                        "method": method,
                        "params": [],
                        "id": 1
                    }
                    
                    response = await client.post(provider.url, json=payload)
                    end_time = time.time()
                    response_time_ms = (end_time - start_time) * 1000
                    
                    if response.status_code == 200:
                        # Check if we got a valid JSON-RPC response
                        try:
                            json_response = response.json()
                            # If we got a result (not an error), consider it online
                            if "result" in json_response:
                                status = "online"
                                break
                            elif "error" in json_response and json_response["error"].get("code") == -32601:
                                # Method not found, try next method
                                continue
                        except:
                            # Invalid JSON response
                            continue
                    else:
                        status = "offline"
                        error_message = f"HTTP {response.status_code}"
                        break
                except httpx.TimeoutException:
                    # Try next method
                    continue
                except httpx.ConnectError:
                    # Connection failed, no point trying other methods
                    raise
            
            # If we tried all methods and none worked
            if status != "online" and not error_message:
                error_message = "No supported RPC methods found"
                status = "offline"
                
    except httpx.TimeoutException:
        error_message = "Request timeout"
        status = "offline"
    except httpx.ConnectError:
        error_message = "Connection failed"
        status = "offline"
    except Exception as e:
        error_message = str(e)
        status = "offline"
    
    # Create health check record
    health_check = HealthCheck(
        provider_id=provider.id,
        status=status,
        response_time_ms=response_time_ms,
        error_message=error_message,
        checked_at=datetime.utcnow()
    )
    db.add(health_check)
    
    # Create alert if provider went offline
    if status == "offline":
        # Check if there's already an unresolved alert
        existing_alert = db.query(Alert).filter(
            Alert.provider_id == provider.id,
            Alert.resolved == False,
            Alert.severity == "error"
        ).first()
        
        if not existing_alert:
            alert = Alert(
                provider_id=provider.id,
                severity="error",
                message=f"Provider {provider.name} is offline: {error_message}",
                resolved=False
            )
            db.add(alert)
    else:
        # Resolve any existing offline alerts
        unresolved_alerts = db.query(Alert).filter(
            Alert.provider_id == provider.id,
            Alert.resolved == False,
            Alert.severity == "error"
        ).all()
        
        for alert in unresolved_alerts:
            alert.resolved = True
            alert.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(health_check)
    
    return health_check


async def check_all_providers(db: Session):
    """
    Check health of all providers in the database
    """
    providers = db.query(Provider).all()
    
    for provider in providers:
        try:
            await check_provider_health(provider, db)
        except Exception as e:
            print(f"Error checking provider {provider.name}: {e}")
