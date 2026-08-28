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
    difficulty = data.get("difficulty", 2)

    session = Session(topic=topic, difficulty=difficulty)
    db.session.add(session)
    db.session.flush()

    try:
        generatedQuestion = generate_question(topic, difficulty)
        question = Question(session_id=session.id,
                            prompt = generatedQuestion.question,
                            suggest_time_seconds=generatedQuestion.suggest_time_seconds,)
        db.session.add(question)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Cannot generate question."}), 503

    return jsonify({"session": session.to_dict(), "question": question.to_dict()}), 201


@bp.route("/questions/<int:question_id>/answer", methods=["POST"])
def submit_answer(question_id):
    """Submit an answer to a question and get back structured, scored feedback."""
    data = request.get_json()
    answer_text = data.get("answer", "")
    time_taken_seconds = data.get("time_taken_seconds")
    went_overtime = data.get("went_overtime", False)

    question = Question.query.get_or_404(question_id)
    feedback = evaluate_answer(question.prompt, answer_text)

    question.answer_text = answer_text
    question.correctness_score = feedback.correctness_score
    question.communication_score = feedback.communication_score
    question.feedback = feedback.feedback
    question.time_taken_seconds = time_taken_seconds
    question.went_overtime = went_overtime
    db.session.commit()

    return jsonify(question.to_dict())


@bp.route("/sessions", methods=["GET"])
def list_sessions():
    """Session history -- feeds the score-over-time dashboard."""
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

@bp.route("/questions/<int:question_id>", methods = ["GET"])
def read_question(question_id):
    question = Question.query.get_or_404(question_id)
    return jsonify({"question": question.to_dict()})

@bp.route("/sessions/<int:session_id>", methods = ["POST"])
def create_new_question(session_id):
    session = Session.query.get_or_404(session_id)

    generatedQuestion = generate_question(session.topic, session.difficulty)
    question = Question(session_id=session.id, 
                        prompt=generatedQuestion.question,
                        suggest_time_seconds=generatedQuestion.suggest_time_seconds,)
    db.session.add(question)
    db.session.commit()

    return jsonify(question.to_dict())

@bp.route("/sessions/<int:session_id>/full", methods = ["GET"])
def read_session_full(session_id):
    session = Session.query.get_or_404(session_id)
    return jsonify({
        **session.to_dict(),
        "questions": [q.to_dict() for q in session.questions],
    })