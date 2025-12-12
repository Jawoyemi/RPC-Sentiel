from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import asyncio
import os
from dotenv import load_dotenv

from database import SessionLocal
from services.health_checker import check_all_providers

load_dotenv()

scheduler = AsyncIOScheduler()


async def scheduled_health_check():
    """
    Scheduled task to check all providers' health
    """
    print(f"[{datetime.utcnow()}] Running scheduled health check...")
    db = SessionLocal()
    try:
        await check_all_providers(db)
        print(f"[{datetime.utcnow()}] Health check completed")
    except Exception as e:
        print(f"Error in scheduled health check: {e}")
    finally:
        db.close()


def start_background_tasks():
    """
    Start all background tasks
    """
    # Get interval from environment (default 5 minutes)
    interval_minutes = int(os.getenv("HEALTH_CHECK_INTERVAL_MINUTES", "5"))
    
    # Schedule health checks
    scheduler.add_job(
        scheduled_health_check,
        trigger=IntervalTrigger(minutes=interval_minutes),
        id="health_check",
        name="Provider Health Check",
        replace_existing=True
    )
    
    scheduler.start()
    print(f"Background tasks started. Health checks every {interval_minutes} minutes.")


def stop_background_tasks():
    """
    Stop all background tasks
    """
    scheduler.shutdown()
    print("Background tasks stopped.")
