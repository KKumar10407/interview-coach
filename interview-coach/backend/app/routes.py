from flask import Blueprint, request, jsonify
from app import db
from app.models import Session, Question
from app.gemini_key_system import generate_question, evaluate_answer

bp = Blueprint("api", __name__)


@bp.route("/sessions", methods=["POST"])
def create_session():
    """Start a new mock-interview session on a given topic."""
    data = request.get_json()
    topic = data.get("topic", "general software engineering")

    session = Session(topic=topic)
    db.session.add(session)
    db.session.commit()

    question_text = generate_question(topic)
    question = Question(session_id=session.id, prompt=question_text)
    db.session.add(question)
    db.session.commit()

    return jsonify({"session": session.to_dict(), "question": question.to_dict()}), 201


@bp.route("/questions/<int:question_id>/answer", methods=["POST"])
def submit_answer(question_id):
    """Submit an answer to a question and get back structured, scored feedback."""
    data = request.get_json()
    answer_text = data.get("answer", "")

    question = Question.query.get_or_404(question_id)
    feedback = evaluate_answer(question.prompt, answer_text)

    question.answer_text = answer_text
    question.correctness_score = feedback.correctness_score
    question.communication_score = feedback.communication_score
    question.feedback = feedback.feedback
    db.session.commit()

    return jsonify(question.to_dict())


@bp.route("/sessions", methods=["GET"])
def list_sessions():
    """Session history -- this is what feeds the score-over-time dashboard."""
    sessions = Session.query.order_by(Session.created_at.desc()).all()
    result = []
    for s in sessions:
        result.append({
            **s.to_dict(),
            "questions": [q.to_dict() for q in s.questions],
        })
    return jsonify(result)


@bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})
