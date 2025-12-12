from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from database import get_db
from models import User, Provider, HealthCheck, Alert
from auth import get_current_user

router = APIRouter(prefix="/api", tags=["Metrics"])


class UptimeDataPoint(BaseModel):
    name: str
    uptime: float
    date: str


class UsageDataPoint(BaseModel):
    date: str
    requests: int
    provider: str


class AlertResponse(BaseModel):
    id: int
    provider_name: str
    severity: str
    message: str
    created_at: datetime
    resolved: bool
    
    class Config:
        from_attributes = True


class RealtimeMetric(BaseModel):
    provider_name: str
    status: str
    response_time_ms: Optional[float]
    last_checked: datetime


@router.get("/metrics/uptime", response_model=List[UptimeDataPoint])
async def get_uptime_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get uptime statistics for the last 7 days"""
    providers = db.query(Provider).filter(Provider.user_id == current_user.id).all()
    
    result = []
    for i in range(7):
        date = datetime.utcnow() - timedelta(days=6-i)
        day_name = date.strftime("%a")
        
        # Calculate average uptime for all providers on this day
        total_uptime = 0
        provider_count = 0
        
        for provider in providers:
            # Get checks for this day
            start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + timedelta(days=1)
            
            checks = db.query(HealthCheck).filter(
                HealthCheck.provider_id == provider.id,
                HealthCheck.checked_at >= start_of_day,
                HealthCheck.checked_at < end_of_day
            ).all()
            
            if checks:
                online_count = sum(1 for check in checks if check.status == "online")
                uptime = (online_count / len(checks)) * 100
                total_uptime += uptime
                provider_count += 1
        
        avg_uptime = total_uptime / provider_count if provider_count > 0 else 100.0
        
        result.append({
            "name": day_name,
            "uptime": round(avg_uptime, 2),
            "date": date.strftime("%Y-%m-%d")
        })
    
    return result


@router.get("/metrics/usage", response_model=List[UsageDataPoint])
async def get_usage_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get API usage statistics"""
    # For now, return mock data based on health checks
    providers = db.query(Provider).filter(Provider.user_id == current_user.id).all()
    
    result = []
    for i in range(7):
        date = datetime.utcnow() - timedelta(days=6-i)
        
        for provider in providers:
            start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + timedelta(days=1)
            
            check_count = db.query(func.count(HealthCheck.id)).filter(
                HealthCheck.provider_id == provider.id,
                HealthCheck.checked_at >= start_of_day,
                HealthCheck.checked_at < end_of_day
            ).scalar()
            
            if check_count > 0:
                result.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "requests": check_count,
                    "provider": provider.name
                })
    
    return result


@router.get("/alerts", response_model=List[AlertResponse])
async def get_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all alerts for user's providers"""
    providers = db.query(Provider).filter(Provider.user_id == current_user.id).all()
    provider_ids = [p.id for p in providers]
    
    alerts = db.query(Alert).filter(
        Alert.provider_id.in_(provider_ids)
    ).order_by(desc(Alert.created_at)).limit(50).all()
    
    result = []
    for alert in alerts:
        provider = db.query(Provider).filter(Provider.id == alert.provider_id).first()
        result.append({
            "id": alert.id,
            "provider_name": provider.name if provider else "Unknown",
            "severity": alert.severity,
            "message": alert.message,
            "created_at": alert.created_at,
            "resolved": alert.resolved
        })
    
    return result


@router.get("/metrics/realtime", response_model=List[RealtimeMetric])
async def get_realtime_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get real-time metrics for all providers"""
    providers = db.query(Provider).filter(Provider.user_id == current_user.id).all()
    
    result = []
    for provider in providers:
        latest_check = db.query(HealthCheck).filter(
            HealthCheck.provider_id == provider.id
        ).order_by(desc(HealthCheck.checked_at)).first()
        
        if latest_check:
            result.append({
                "provider_name": provider.name,
                "status": latest_check.status,
                "response_time_ms": latest_check.response_time_ms,
                "last_checked": latest_check.checked_at
            })
        else:
            result.append({
                "provider_name": provider.name,
                "status": "unknown",
                "response_time_ms": None,
                "last_checked": provider.created_at
            })
    
    return result
