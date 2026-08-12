from datetime import datetime
from app import db


class Session(db.Model):
    """One mock-interview sitting. A user can have many of these over time,
    which is what powers the score-history dashboard later."""

    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(120), nullable=False)  # e.g. "arrays", "behavioral"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    questions = db.relationship("Question", backref="session", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "topic": self.topic,
            "created_at": self.created_at.isoformat(),
        }


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey("session.id"), nullable=False)
    prompt = db.Column(db.Text, nullable=False)

    answer_text = db.Column(db.Text, nullable=True)
    correctness_score = db.Column(db.Integer, nullable=True)   # 0-10
    communication_score = db.Column(db.Integer, nullable=True)  # 0-10
    feedback = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "prompt": self.prompt,
            "answer_text": self.answer_text,
            "correctness_score": self.correctness_score,
            "communication_score": self.communication_score,
            "feedback": self.feedback,
        }
