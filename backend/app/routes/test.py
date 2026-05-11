from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from groq import Groq
from dotenv import load_dotenv
import os, json, re

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

router = APIRouter(prefix="/test", tags=["Mock Test"])


class TestRequest(BaseModel):
    topics:     list[str]
    exam:       Optional[str] = ""
    board:      Optional[str] = ""
    class_name: Optional[str] = ""
    week:       Optional[int] = 1


class TestResult(BaseModel):
    question_times: list[float]
    answers:        list[str]
    correct:        list[str]
    questions:      list[dict]


@router.post("/generate")
def generate_test(data: TestRequest):
    try:
        topics_text = "\n".join(f"- {t}" for t in data.topics[:40])

        prompt = f"""You are an expert question setter for Indian competitive exams.

Student profile:
- Exam: {data.exam or 'General'}
- Board: {data.board or 'CBSE'}
- Class: {data.class_name or '12'}

Topics studied (generate questions ONLY from these):
{topics_text}

Generate exactly 30 multiple choice questions.
Rules:
- Mix difficulty: 10 easy, 14 medium, 6 hard
- Each question has exactly 4 options: A, B, C, D
- One correct answer per question
- Questions must be from the topics listed ONLY
- Make questions exam-relevant based on the exam type

Respond ONLY with a valid JSON array, no markdown, no preamble:
[
  {{
    "id": 1,
    "question": "Question text?",
    "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
    "correct": "A",
    "difficulty": "easy",
    "topic": "topic name"
  }}
]"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=4000,
        )

        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
        questions = json.loads(raw)

        return {"status": "success", "week": data.week, "questions": questions, "total": len(questions)}

    except json.JSONDecodeError:
        return {"status": "error", "message": "AI returned invalid JSON. Try again."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.post("/analyse")
def analyse_test(data: TestResult):
    try:
        total     = len(data.questions)
        correct   = sum(1 for i in range(total) if i < len(data.answers) and data.answers[i] == data.correct[i])
        score_pct = round((correct / total) * 100) if total else 0
        avg_time  = round(sum(data.question_times) / len(data.question_times), 1) if data.question_times else 0

        slow_qs = [
            data.questions[i]
            for i, t in enumerate(data.question_times)
            if t > 90 and i < len(data.questions)
        ]

        weak_topics: dict[str, int] = {}
        for i, q in enumerate(data.questions):
            if i < len(data.answers) and data.answers[i] != data.correct[i]:
                topic = q.get("topic", "Unknown")
                weak_topics[topic] = weak_topics.get(topic, 0) + 1

        weak_sorted = sorted(weak_topics.items(), key=lambda x: -x[1])

        return {
            "status":       "success",
            "score":        correct,
            "total":        total,
            "score_pct":    score_pct,
            "wrong":        total - correct,
            "avg_time_sec": avg_time,
            "slow_questions": slow_qs[:5],
            "weak_topics":  [{"topic": t, "wrong": c} for t, c in weak_sorted[:5]],
            "grade": (
                "Excellent 🏆" if score_pct >= 85 else
                "Good 👍"      if score_pct >= 65 else
                "Needs Work 📚" if score_pct >= 40 else
                "Keep Studying 💪"
            ),
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}