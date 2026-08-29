"""
All LLM API calls live here, isolated from the Flask routes.
"""
import os
from google import genai
from pydantic import BaseModel, Field

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

MODEL = "gemini-3.5-flash-lite"  # free tier model

class GeneratedQuestion(BaseModel):
    question: str = Field(description="The interview question text")
    suggest_time_seconds: int = Field(description="Reasonable time in seconds to answer this question, given its difficulty")

def generate_question(topic: str, difficulty: int) -> GeneratedQuestion:
    """Ask Gemini for one realistic interview question on a given topic."""
    set_difficulty = {1: "easy", 2: "medium", 3: "hard"}[difficulty]
    prompt = (
        f"Generate one realistic junior software engineer interview "
        f"question about '{topic}' at {set_difficulty} difficulty. "
        f"Avoid the most commonly cited textbook example for this topic -- "
        f"generate something a real interviewer might ask that isn't the "
        f"first thing that comes to mind. "
        f"Also estimate a reasonable time limit, in seconds, for a "
        f"candidate to answer it well."
    )


    response = client.models.generate_content(
        model=MODEL,
        contents= prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": GeneratedQuestion,
            "temperature": 1.3, #prevents a highly generic generated prompt
        }
    )
    return GeneratedQuestion.model_validate_json(response.text.strip())

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