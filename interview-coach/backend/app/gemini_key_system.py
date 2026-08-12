"""
All LLM API calls live here, isolated from the Flask routes.
"""
import os
from google import genai
from pydantic import BaseModel, Field

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

MODEL = "gemini-flash-latest"  # free tier model


def generate_question(topic: str) -> str:
    """Ask Gemini for one realistic interview question on a given topic."""
    response = client.models.generate_content(
        model=MODEL,
        contents=(
            f"Generate one realistic junior software engineer interview "
            f"question about '{topic}'. Return ONLY the question text, "
            f"nothing else."
        ),
    )
    return response.text.strip()


class InterviewFeedback(BaseModel):
    correctness_score: int = Field(description="0-10, technical accuracy")
    communication_score: int = Field(description="0-10, clarity of explanation")
    feedback: str = Field(description="2-3 sentences of specific, actionable feedback")


def evaluate_answer(question: str, answer: str) -> InterviewFeedback:
    prompt = (
        "You are a strict but fair technical interviewer. Evaluate the "
        "candidate's answer honestly -- do not inflate scores.\n\n"
        f"Question: {question}\n\nCandidate's answer: {answer}"
    )

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": InterviewFeedback,
        },
    )

    return InterviewFeedback.model_validate_json(response.text)