from pydantic import BaseModel
from typing import Optional, Union


class PlanRequest(BaseModel):

    # subject can be a single string OR a list (multi-subject)
    subject: Union[str, list[str]]

    weeks: int
    hours_per_day: int

    exam:       Optional[str]       = ""
    board:      Optional[str]       = ""
    class_name: Optional[str]       = ""
    name:       Optional[str]       = ""
    history:    Optional[list[str]] = []