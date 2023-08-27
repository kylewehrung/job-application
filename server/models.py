import json
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Enum
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt



# Define the User model
class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))
    
    def __repr__(self):
        return f"User ID: {self.id}, Email: {self.email}"




# Define the ApplicationQuestion model
class ApplicationQuestion(db.Model, SerializerMixin):
    __tablename__ = "application_questions"

    id = db.Column(db.Integer, primary_key=True)
    open_ended_questions = db.Column(db.String(500))  # Store open-ended questions as a JSON-encoded list of strings.
    yes_no_questions = db.Column(db.String(500))  # Store yes/no questions as a JSON-encoded list of strings.
    multiple_choice_questions = db.Column(db.String(500))  # Store multiple-choice questions as a JSON-encoded list of strings.
    answers = db.relationship('Answer', backref='application_question', lazy=True)

    def __repr__(self):
        return (
            f"ApplicationQuestion ID: {self.id}, "
            f"Open-ended Questions: {self.open_ended_questions}, "
            f"Yes/No Questions: {self.yes_no_questions}, "
            f"Multiple Choice Questions: {self.multiple_choice_questions}"
        )




# Define the Answer model
class Answer(db.Model, SerializerMixin):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('application_questions.id'), nullable=False)
    answer = db.Column(db.String(500))  # Store answers to open-ended questions as text.
    yes_no_answers = db.Column(db.String(500))  # Store yes/no answers as a JSON-encoded list of boolean values.
    multiple_choice_answers = db.relationship('MultipleChoiceAnswer', backref='answer', lazy=True)

    def __repr__(self):
        return (
            f"Answer ID: {self.id}, "
            f"Question ID: {self.question_id}, "
            f"Answer: {self.answer}, "
            f"Yes/No Answers: {self.yes_no_answers}"
        )




# Define the MultipleChoiceAnswer model
class MultipleChoiceAnswer(db.Model, SerializerMixin):
    __tablename__ = "multiple_choice_answers"

    id = db.Column(db.Integer, primary_key=True)
    answer_id = db.Column(db.Integer, db.ForeignKey('answers.id'), nullable=False)
    choice = db.Column(db.String(150)) # Each multiple-choice answer is associated with a single answer that is associated with a specific question.

    def __repr__(self):
        return f"MultipleChoiceAnswer ID: {self.id}, Answer ID: {self.answer_id}, Choice: {self.choice}"




# Define the Choice model
class Choice(db.Model, SerializerMixin):
    __tablename__ = "choices"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('application_questions.id'), nullable=False)# Reference the ApplicationQuestion table. 
    choice = db.Column(db.String(150))

    def __repr__(self):
        return f"Choice ID: {self.id}, Question ID: {self.question_id}, Choice: {self.choice}"




# Define the Application model
class Application(db.Model, SerializerMixin):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('application_questions.id'), nullable=False)
    answer_id = db.Column(db.Integer, db.ForeignKey('answers.id'), nullable=False)

    user = db.relationship('User', backref='applications', lazy=True)
    question = db.relationship('ApplicationQuestion', backref='applications', lazy=True)
    answer = db.relationship('Answer', backref='applications', lazy=True)

    def __repr__(self):
        return (
            f"Application ID: {self.id}, "
            f"User ID: {self.user_id}, "
            f"Question ID: {self.question_id}, "
            f"Answer ID: {self.answer_id}"
        )







