from sqlalchemy import Column, Integer, String, DateTime, JSON
from .database import Base
from datetime import datetime

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    bf_path = Column(String, index=True) # Path to Brightfield image
    he_path = Column(String) # Path to H&E image
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_info = Column(JSON, nullable=True) # Renamed from metadata to avoid conflict
