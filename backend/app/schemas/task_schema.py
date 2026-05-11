from pydantic import BaseModel


class TaskResponse(BaseModel):

    day: int
    task: str
    completed: bool
    