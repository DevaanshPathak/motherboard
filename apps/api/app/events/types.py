from typing import Any, Dict, Literal
from pydantic import BaseModel

class UserCreatedPayload(BaseModel):
    user_id: str

class GroupMemberAddedPayload(BaseModel):
    user_id: str
    group_id: str
    source: str

class DiscordSyncCompletedPayload(BaseModel):
    synced_count: int
    errors: list[str]

class Event(BaseModel):
    type: Literal["user.created", "group.member.added", "discord.sync.completed"]
    payload: Dict[str, Any]
