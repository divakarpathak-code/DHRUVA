from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.post("/create")
def create_profile(data: UserCreate, db: Session = Depends(get_db)):

    user = User(
        name=data.name,
        class_name=data.class_name
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Profile created",
        "user": user
    }


@router.get("/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    return user