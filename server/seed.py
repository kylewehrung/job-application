import json
from config import db
from models import ApplicationQuestion, User
from app import app

with app.app_context():
    db.create_all()
     # Clear the ApplicationQuestion table before seeding
    db.session.query(ApplicationQuestion).delete()
    db.session.query(User).delete()


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

    yes_no_questions_data = [
        {"id": 1, "question": "Are you now legally authorized to work in the posted primary location for this requisition?"},
        {"id": 2, "question": "Will you require sponsorship in the future for this location (for example, if you are on a temporary visa)?"},
    ]



    multiple_choice_questions_data = [
        {   "id": 1,
            "question": "How do you identify?",
            "choices": ["Male", "Female", "Non-Binary", "Gender is a construct", "Decline not to answer"],
        },
        {   "id": 2,
            "question": "What's your race?",
            "choices": ["Hispanic or Latino", "White (Not Hispanic or Latino)", "Black or African American (Not Hispanic or Latino)",
                         "Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)",
                           "Asian (Not Hispanic or Latino)", "American Indian or Alaska Native (Not Hispanic or Latino)", "Two or More Races (Not Hispanic or Latino)",
                         "Decline to self-identify"  ],
        },
        {   "id": 3,
            "question": "Are you a veteran?",
            "choices": ["I am veteran", "I am not a veteran", "'Decline to self-identify"]
        }
    ]

    # Seed data for ApplicationQuestion
    for question_data in open_ended_questions_data:
        question = ApplicationQuestion(open_ended_questions=question_data["question"])
        db.session.add(question)

    for question_data in yes_no_questions_data:
        question = ApplicationQuestion(yes_no_questions=question_data["question"])
        db.session.add(question)

    for question_data in multiple_choice_questions_data:
        question = ApplicationQuestion(
            multiple_choice_questions=json.dumps(
                {
                    "question": question_data["question"],
                    "choices": question_data["choices"],
                }
            )
        )
        db.session.add(question)

    db.session.commit()






