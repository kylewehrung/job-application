from flask import Flask, request, session, make_response, abort, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS
import json
from config import app, db, api
from models import ApplicationQuestion, User, Answer
from flask_mail import Mail, Message

CORS(app)
mail = Mail(app)


class Signup(Resource):
    def post(self):
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        new_user = User(email=email)

        new_user.password_hash = password

        try:
            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id

            return new_user.to_dict(), 201

        except IntegrityError:
            return {"error": "422 Unprocessable Entity"}, 422


api.add_resource(Signup, "/signup")


class Login(Resource):
    def post(self):
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        user = User.query.filter(User.email == email).first()

        if user:
            if user.authenticate(password):
                session["user_id"] = user.id
                return user.to_dict(), 200

        return {"error": "401 Unauthorized"}, 401


api.add_resource(Login, "/login")


class Logout(Resource):
    def delete(self):
        if session.get("user_id"):
            session["user_id"] = None
            return {}, 204

        return {"error": "401 Unauthorized"}, 401


api.add_resource(Logout, "/logout")


class CheckSession(Resource):
    def get(self):
        try:
            user = User.query.filter_by(id=session["user_id"]).first()
            response = make_response(user.to_dict(), 200)
            return response

        except:
            abort(401, "unauthorized")


api.add_resource(CheckSession, "/check_session")


class ApplicationQuestionListResource(Resource):
    def get(self):
        questions = ApplicationQuestion.query.all()
        questions_data = []

        for question in questions:
            question_data = {
                'id': question.id,
                'open_ended_questions': question.open_ended_questions,
                'yes_no_questions': question.yes_no_questions,
                'multiple_choice_questions': json.loads(
                    question.multiple_choice_questions) if question.multiple_choice_questions else None
            }
            questions_data.append(question_data)

        return jsonify(questions_data)


api.add_resource(ApplicationQuestionListResource, '/questions')


class SubmitAnswer(Resource):
    def post(self, question_id):
        try:
            data = request.get_json()

            if 'answers' not in data:
                return make_response({"error": "Answers not provided"}, 400)

            answer = Answer(question_id=question_id, answer=data['answers'])
            db.session.add(answer)
            db.session.commit()

            user = User.query.filter_by(id=session.get("user_id")).first()
            if user and user.email:
                send_email(user.email, f"Answer submitted for question {question_id}", json.dumps(data['answers']))

            return make_response({"message": "Answer submitted successfully"}, 201)
        except Exception as e:
            print("Error:", str(e))
            return make_response({"error": "Internal server error"}, 500)

# Send_email function inside the SubmitAnswer class
def send_email(to_email, subject, body):
    msg = Message(subject=subject, recipients=[to_email], body=body)
    mail.send(msg)

api.add_resource(SubmitAnswer, "/<int:question_id>/submit_answer")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
