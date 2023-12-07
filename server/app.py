import re
from flask import Flask, request, session, make_response, abort, jsonify
from flask_restful import Resource, Api
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS
import json

from config import app, db  # Assuming 'api' is not used in this script
from models import ApplicationQuestion, User, Answer

CORS(app)

class Signup(Resource):
    def post(self):
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"error": "Email and password are required"}, 400

        # Validate the email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return {"error": "Invalid email address"}, 400

        new_user = User(email=email)

        new_user.password_hash = password

        try:
            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id

            return new_user.to_dict(), 201

        except IntegrityError:
            db.session.rollback()
            return {"error": "Email already exists"}, 422

class Login(Resource):
    def post(self):
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"error": "Email and password are required"}, 400

        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return {"error": "Invalid email address"}, 400

        user = User.query.filter(User.email == email).first()

        if user and user.authenticate(password):
            session["user_id"] = user.id
            return user.to_dict(), 200

        return {"error": "Unauthorized", "status_code": 401}, 401

class Logout(Resource):
    def delete(self):
        if session.get("user_id"):
            session["user_id"] = None
            return {}, 204

        return {"error": "Unauthorized", "status_code": 401}, 401

class CheckSession(Resource):
    def get(self):
        try:
            user = User.query.filter_by(id=session["user_id"]).first()

            response = make_response(user.to_dict(), 200)

            return response

        except Exception as e:
            app.logger.error(f"Error checking session: {str(e)}")
            return {"error": "Internal server error"}, 500

class ApplicationQuestionListResource(Resource):
    def get(self):
        questions = ApplicationQuestion.query.all()
        questions_data = []

        for question in questions:
            question_data = {
                'id': question.id,
                'open_ended_questions': question.open_ended_questions,
                'yes_no_questions': question.yes_no_questions,
                'multiple_choice_questions': json.loads(question.multiple_choice_questions) if question.multiple_choice_questions else None
            }
            questions_data.append(question_data)

        return jsonify(questions_data)

class SubmitAnswer(Resource):
    def post(self, question_id):
        try:
            data = request.get_json()

            if 'answers' not in data:
                return make_response({"error": "Answers not provided"}, 400)

            answer = Answer(question_id=question_id, answer=data['answers'])
            db.session.add(answer)
            db.session.commit()

            return make_response({"message": "Answer submitted successfully"}, 201)
        except Exception as e:
            app.logger.error(f"Error submitting answer: {str(e)}")
            return make_response({"error": "Internal server error"}, 500)

api = Api(app)

api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, "/check_session")
api.add_resource(ApplicationQuestionListResource, '/questions')
api.add_resource(SubmitAnswer, "/<int:question_id>/submit_answer")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
