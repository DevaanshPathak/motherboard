import uuid
from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict


class SyncRunResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    trigger: str
    status: str
    started_at: datetime
    finished_at: Optional[datetime] = None
    members_synced: int
    members_added: int
    members_removed: int
    errors: List[Any]
    discord_member_count: Optional[int] = None


class SyncRunListResponse(BaseModel):
    total: int
    items: List[SyncRunResponse]


class SyncTriggerResponse(BaseModel):
    sync_run_id: uuid.UUID
    status: str
    message: str
