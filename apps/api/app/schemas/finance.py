"""Pydantic v2 schemas for the Finance module (VirtualAccount, VirtualCard, MoneyRequest)."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Virtual Account
# ---------------------------------------------------------------------------

class VirtualAccountCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None
    owner_id: uuid.UUID


class VirtualAccountUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = None
    is_active: bool | None = None


class VirtualAccountOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    owner_id: uuid.UUID
    name: str
    description: str | None
    balance_paise: int
    # Convenience: expose balance in rupees as a float
    balance_rupees: float = 0.0
    account_number: str
    ifsc: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    @classmethod
    def model_validate(cls, obj, **kwargs):
        instance = super().model_validate(obj, **kwargs)
        instance.balance_rupees = instance.balance_paise / 100
        return instance


# ---------------------------------------------------------------------------
# Virtual Card
# ---------------------------------------------------------------------------

class VirtualCardCreate(BaseModel):
    account_id: uuid.UUID
    holder_id: uuid.UUID
    card_name: str = Field(..., min_length=1, max_length=100)
    card_type: Literal["virtual", "debit"] = "virtual"
    expires_month: int = Field(..., ge=1, le=12)
    expires_year: int = Field(..., ge=2024, le=2040)


class VirtualCardUpdate(BaseModel):
    card_name: str | None = Field(None, min_length=1, max_length=100)
    is_active: bool | None = None


class VirtualCardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    account_id: uuid.UUID
    holder_id: uuid.UUID
    card_name: str
    last_four: str
    card_type: str
    is_active: bool
    expires_month: int
    expires_year: str = ""  # formatted "MM/YY" string
    created_at: datetime
    updated_at: datetime

    @classmethod
    def model_validate(cls, obj, **kwargs):
        instance = super().model_validate(obj, **kwargs)
        yr = str(obj.expires_year)[-2:] if hasattr(obj, "expires_year") else "00"
        mo = f"{obj.expires_month:02d}" if hasattr(obj, "expires_month") else "00"
        instance.expires_year = f"{mo}/{yr}"
        return instance


# ---------------------------------------------------------------------------
# Money Request
# ---------------------------------------------------------------------------

class MoneyRequestCreate(BaseModel):
    # None = draw from main pool
    from_account_id: uuid.UUID | None = None
    to_account_id: uuid.UUID
    amount_paise: int = Field(..., gt=0, description="Amount in paise (₹1 = 100 paise)")
    description: str = Field(..., min_length=1)


class MoneyRequestReview(BaseModel):
    note: str | None = None


class MoneyRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    from_account_id: uuid.UUID | None
    to_account_id: uuid.UUID
    requester_id: uuid.UUID
    amount_paise: int
    amount_rupees: float = 0.0
    description: str
    status: str
    reviewed_by: uuid.UUID | None
    reviewed_at: datetime | None
    review_note: str | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def model_validate(cls, obj, **kwargs):
        instance = super().model_validate(obj, **kwargs)
        instance.amount_rupees = instance.amount_paise / 100
        return instance
