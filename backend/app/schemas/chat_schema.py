from pydantic import BaseModel
from typing import Optional


class ChatMessage(BaseModel):
    message: str
    subject: Optional[str] = ""
    exam: Optional[str] = ""
    board: Optional[str] = ""
    class_name: Optional[str] = ""
    # Full conversation history so AI has context
    history: Optional[list[dict]] = []