from fastapi import APIRouter
from app.schemas.plan_schema import PlanRequest
from app.services.ai import generate_study_plan
from app.services.task_parser import convert_plan_to_tasks

router = APIRouter(prefix="/plans", tags=["Plans"])


@router.post("/generate")
def generate_plan(data: PlanRequest):

    try:

        plan_text = generate_study_plan(
            subjects=data.subject,
            weeks=data.weeks,
            hours=data.hours_per_day,
            exam=data.exam,
            board=data.board,
            class_name=data.class_name,
            name=data.name,
            history=data.history,
        )

        tasks = convert_plan_to_tasks(plan_text)

        return {
            "status": "success",
            "plan":   plan_text,
            "tasks":  tasks
        }

    except Exception as e:

        return {
            "status":  "error",
            "message": str(e)
        }