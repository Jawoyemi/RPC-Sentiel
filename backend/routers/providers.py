from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import User, Provider, HealthCheck
from auth import get_current_user

router = APIRouter(prefix="/api/providers", tags=["Providers"])


class ProviderCreate(BaseModel):
    name: str
    url: str
    description: Optional[str] = None


class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None


class HealthCheckResponse(BaseModel):
    status: str
    response_time_ms: Optional[float]
    checked_at: datetime
    
    class Config:
        from_attributes = True


class ProviderResponse(BaseModel):
    id: int
    name: str
    url: str
    description: Optional[str]
    created_at: datetime
    latest_health: Optional[HealthCheckResponse] = None
    uptime: float = 100.0
    
    class Config:
        from_attributes = True


@router.get("", response_model=List[ProviderResponse])
async def list_providers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all providers for the current user"""
    providers = db.query(Provider).filter(Provider.user_id == current_user.id).all()
    
    result = []
    for provider in providers:
        # Get latest health check
        latest_health = db.query(HealthCheck).filter(
            HealthCheck.provider_id == provider.id
        ).order_by(desc(HealthCheck.checked_at)).first()
        
        # Calculate uptime (last 100 checks)
        recent_checks = db.query(HealthCheck).filter(
            HealthCheck.provider_id == provider.id
        ).order_by(desc(HealthCheck.checked_at)).limit(100).all()
        
        uptime = 100.0
        if recent_checks:
            online_count = sum(1 for check in recent_checks if check.status == "online")
            uptime = (online_count / len(recent_checks)) * 100
        
        provider_data = {
            "id": provider.id,
            "name": provider.name,
            "url": provider.url,
            "description": provider.description,
            "created_at": provider.created_at,
            "latest_health": latest_health,
            "uptime": uptime
        }
        result.append(provider_data)
    
    return result


@router.post("", response_model=ProviderResponse, status_code=status.HTTP_201_CREATED)
async def create_provider(
    provider_data: ProviderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new provider"""
    new_provider = Provider(
        user_id=current_user.id,
        name=provider_data.name,
        url=provider_data.url,
        description=provider_data.description
    )
    db.add(new_provider)
    db.commit()
    db.refresh(new_provider)
    
    return {
        "id": new_provider.id,
        "name": new_provider.name,
        "url": new_provider.url,
        "description": new_provider.description,
        "created_at": new_provider.created_at,
        "latest_health": None,
        "uptime": 100.0
    }


@router.get("/{provider_id}", response_model=ProviderResponse)
async def get_provider(
    provider_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific provider"""
    provider = db.query(Provider).filter(
        Provider.id == provider_id,
        Provider.user_id == current_user.id
    ).first()
    
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    # Get latest health check
    latest_health = db.query(HealthCheck).filter(
        HealthCheck.provider_id == provider.id
    ).order_by(desc(HealthCheck.checked_at)).first()
    
    # Calculate uptime
    recent_checks = db.query(HealthCheck).filter(
        HealthCheck.provider_id == provider.id
    ).order_by(desc(HealthCheck.checked_at)).limit(100).all()
    
    uptime = 100.0
    if recent_checks:
        online_count = sum(1 for check in recent_checks if check.status == "online")
        uptime = (online_count / len(recent_checks)) * 100
    
    return {
        "id": provider.id,
        "name": provider.name,
        "url": provider.url,
        "description": provider.description,
        "created_at": provider.created_at,
        "latest_health": latest_health,
        "uptime": uptime
    }


@router.put("/{provider_id}", response_model=ProviderResponse)
async def update_provider(
    provider_id: int,
    provider_data: ProviderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a provider"""
    provider = db.query(Provider).filter(
        Provider.id == provider_id,
        Provider.user_id == current_user.id
    ).first()
    
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    # Update fields
    if provider_data.name is not None:
        provider.name = provider_data.name
    if provider_data.url is not None:
        provider.url = provider_data.url
    if provider_data.description is not None:
        provider.description = provider_data.description
    
    db.commit()
    db.refresh(provider)
    
    # Get latest health check
    latest_health = db.query(HealthCheck).filter(
        HealthCheck.provider_id == provider.id
    ).order_by(desc(HealthCheck.checked_at)).first()
    
    return {
        "id": provider.id,
        "name": provider.name,
        "url": provider.url,
        "description": provider.description,
        "created_at": provider.created_at,
        "latest_health": latest_health,
        "uptime": 100.0
    }


@router.delete("/{provider_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_provider(
    provider_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a provider"""
    provider = db.query(Provider).filter(
        Provider.id == provider_id,
        Provider.user_id == current_user.id
    ).first()
    
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    db.delete(provider)
    db.commit()
    
    return None


@router.post("/{provider_id}/check", response_model=HealthCheckResponse)
async def trigger_health_check(
    provider_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Manually trigger a health check for a provider"""
    from services.health_checker import check_provider_health
    
    provider = db.query(Provider).filter(
        Provider.id == provider_id,
        Provider.user_id == current_user.id
    ).first()
    
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    # Perform health check
    health_check = await check_provider_health(provider, db)
    
    return health_check
