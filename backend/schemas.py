from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class HistoryBase(BaseModel):
    bf_path: str
    he_path: str
    metadata_info: Optional[Dict[str, Any]] = None

class HistoryCreate(HistoryBase):
    pass

class HistoryResponse(HistoryBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True
