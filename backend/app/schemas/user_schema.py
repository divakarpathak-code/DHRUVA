from pydantic import BaseModel


class UserCreate(BaseModel):

    name: str

    class_name: str


class UserResponse(BaseModel):

    id: int
    name: str
    class_name: str
    streak: int