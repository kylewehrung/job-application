from config import db
from models import ApplicationQuestion
from app import app

with app.app_context():
    db.create_all()

    # Seed data for open-ended questions
    open_ended_questions_data = [
        {"question": "Full name"},
        {"question": "Email"},
        {"question": "Phone"},
        {"question": "Most recent company"},
        {"question": "Linkedin"},
        {"question": "GitHub URL"},
        {"question": "Portfolio URL"},
        {"question": "What are your salary expectations in your next role?"},
        {"question": "Add a cover letter or anything else you want to share"},
    ]

    # Seed data for ApplicationQuestion
    for question_data in open_ended_questions_data:
        question = ApplicationQuestion(open_ended_questions=question_data["question"])
        db.session.add(question)

    db.session.commit()








