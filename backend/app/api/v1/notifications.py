from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from app.models.schemas import InAppNotification, NotificationListResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])

# In-memory store for active session in-app notifications
STORED_NOTIFICATIONS = [
    {
        "id": "notif-001",
        "user_id": "usr-demo-001",
        "title": "🎯 94% Match: SDE Backend at Swiggy",
        "message": "New opportunity posted in Bengaluru matching your Python, FastAPI, and PostgreSQL skills.",
        "type": "match",
        "job_id": "jv-in-001",
        "data": {"company": "Swiggy", "score": 94, "location": "Bengaluru"},
        "is_read": False,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": "notif-002",
        "user_id": "usr-demo-001",
        "title": "⚡ High Eligibility: Frontend Intern at Razorpay",
        "message": "Your 8.4 CGPA and 2026 Batch meet all criteria. ₹45,000/mo stipend.",
        "type": "match",
        "job_id": "jv-in-002",
        "data": {"company": "Razorpay", "score": 91, "stipend": 45000},
        "is_read": False,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": "notif-003",
        "user_id": "usr-demo-001",
        "title": "⏰ Upcoming Deadline Reminder",
        "message": "Direct application window for Software Engineer at GitLab closes in 48 hours.",
        "type": "deadline",
        "job_id": "gh-8638232002",
        "data": {"company": "GitLab", "deadline_days": 2},
        "is_read": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": "notif-004",
        "user_id": "usr-demo-001",
        "title": "🔔 In-App Daily Alert Center Active",
        "message": "JobCurrent now delivers all new matched opportunities directly to your in-app notification center.",
        "type": "system",
        "job_id": None,
        "data": {},
        "is_read": True,
        "created_at": datetime.now(timezone.utc)
    }
]


@router.get("", response_model=NotificationListResponse)
def get_notifications(user_id: Optional[str] = None):
    """
    Retrieve in-app notifications and unread badge count for the candidate.
    """
    notifs = STORED_NOTIFICATIONS
    if user_id:
        notifs = [n for n in notifs if n.get("user_id") == user_id or n.get("user_id") is None]

    unread = len([n for n in notifs if not n.get("is_read")])
    return {
        "notifications": notifs,
        "unread_count": unread
    }


@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: str):
    """
    Mark an individual in-app notification as read.
    """
    for n in STORED_NOTIFICATIONS:
        if n["id"] == notification_id:
            n["is_read"] = True
            return {"success": True, "id": notification_id, "is_read": True}
    raise HTTPException(status_code=404, detail="Notification not found")


@router.post("/mark-all-read")
def mark_all_notifications_read():
    """
    Mark all in-app notifications as read in one click.
    """
    count = 0
    for n in STORED_NOTIFICATIONS:
        if not n["is_read"]:
            n["is_read"] = True
            count += 1
    return {"success": True, "marked_count": count}


@router.delete("/{notification_id}")
def delete_notification(notification_id: str):
    """
    Dismiss or delete a notification.
    """
    global STORED_NOTIFICATIONS
    initial_len = len(STORED_NOTIFICATIONS)
    STORED_NOTIFICATIONS = [n for n in STORED_NOTIFICATIONS if n["id"] != notification_id]
    if len(STORED_NOTIFICATIONS) < initial_len:
        return {"success": True, "id": notification_id}
    raise HTTPException(status_code=404, detail="Notification not found")
