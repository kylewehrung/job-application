import json
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Enum
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy


from config import db

class ApplicationQuestion(db.Model, SerializerMixin):
    __tablename__ = "application_questions"

    id = db.Column(db.Integer, primary_key=True)
    open_ended_questions = db.Column(db.String(500))  # Store open-ended questions as a JSON-encoded list of strings.
    yes_no_questions = db.Column(db.String(500))  # Store yes/no questions as a JSON-encoded list of strings.
    multiple_choice_questions = db.Column(db.String(500))  # Store multiple-choice questions as a JSON-encoded list of strings.
    answers = db.relationship('Answer', backref='application_question', lazy=True)

class Answer(db.Model, SerializerMixin):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('application_questions.id'), nullable=False)
    answer = db.Column(db.String(500))  # Store answers to open-ended questions as text.
    yes_no_answers = db.Column(db.String(500))  # Store yes/no answers as a JSON-encoded list of boolean values.
    multiple_choice_answers = db.relationship('MultipleChoiceAnswer', backref='answer', lazy=True)

class MultipleChoiceAnswer(db.Model, SerializerMixin):
    __tablename__ = "multiple_choice_answers"

    id = db.Column(db.Integer, primary_key=True)
    answer_id = db.Column(db.Integer, db.ForeignKey('answers.id'), nullable=False)
    choice = db.Column(db.String(150)) # Each multiple-choice answer is associated with a single answer that is associated with a specific question.

class Choice(db.Model, SerializerMixin):
    __tablename__ = "choices"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('application_questions.id'), nullable=False)# Reference the ApplicationQuestion table. 
    choice = db.Column(db.String(150))

    






