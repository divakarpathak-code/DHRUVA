from fastapi import APIRouter
from app.schemas.chat_schema import ChatMessage
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/ask")
def ask_bot(data: ChatMessage):
    try:
        # Build system prompt based on student profile
        context_parts = []
        if data.exam:       context_parts.append(f"Target exam: {data.exam}")
        if data.board:      context_parts.append(f"Board: {data.board}")
        if data.class_name: context_parts.append(f"Class: {data.class_name}")
        if data.subject:    context_parts.append(f"Currently studying: {data.subject}")

        context = " | ".join(context_parts) if context_parts else "Indian student"

        system_prompt = f"""You are Dhruva Bot — a friendly, sharp academic assistant for Indian students.

Student profile: {context}

Your job:
- Answer subject doubts clearly and concisely
- Give step-by-step solutions for problems
- Explain concepts with Indian exam context (JEE/NEET/Boards)
- Use simple language, avoid jargon unless necessary
- For numericals: show full working step by step
- For theory: explain with examples relevant to Indian curriculum
- Keep answers focused — no unnecessary padding
- If asked about NCERT: give chapter-accurate answers
- If asked about JEE/NEET PYQs: mention the year if you know it

Never say you can't help. Always attempt an answer.
Keep responses under 300 words unless a detailed solution is needed."""

        # Build message history for context
        messages = [{"role": "system", "content": system_prompt}]

        # Add last 6 messages from history (3 exchanges)
        for msg in data.history[-6:]:
            if msg.get("role") in ("user", "assistant") and msg.get("content"):
                messages.append({
                    "role":    msg["role"],
                    "content": msg["content"]
                })

        # Add current message
        messages.append({"role": "user", "content": data.message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.5,
            max_tokens=600,
        )

        reply = response.choices[0].message.content.strip()

        return {"status": "success", "reply": reply}

    except Exception as e:
        return {"status": "error", "reply": f"Sorry, I couldn't process that. Error: {str(e)}"}