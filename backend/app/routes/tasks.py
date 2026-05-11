from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.task import Task

router = APIRouter()

@router.get("/tasks")
def get_tasks():

    db: Session = SessionLocal()

    tasks = db.query(Task).all()

    return tasks


@router.post("/tasks")
def create_task(text: str):

    db: Session = SessionLocal()

    task = Task(text=text)

    db.add(task)

    db.commit()

    db.refresh(task)

    return task


@router.put("/tasks/{task_id}")
def toggle_task(task_id: int):

    db: Session = SessionLocal()

    task = db.query(Task).filter(Task.id == task_id).first()

    task.done = not task.done

    db.commit()

    return task

