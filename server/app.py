from flask import Flask, request, session, make_response, abort, jsonify
from flask_restful import Resource
from sqlalchemy.orm import subqueryload
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS
import json


from config import app, db, api
from models import ApplicationQuestion, User, Answer
CORS(app)



class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        email = data.get("email")
        password = data.get("password")
        # Extract email and password from the JSON data

        new_user = User(
            email=email,
        )
        # Create a new User instance with the provided email

        new_user.password_hash = password

        try:
            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id
            # Add the new user to the database, commit changes, store the user's ID in the session
            print(new_user.to_dict())
            return new_user.to_dict(), 201
        
        except IntegrityError:
            return {"error": "422 Unprocessable Entity"}, 422
            # If there's an integrity error return an error message with HTTP status code 422 (Unprocessable Entity)
        
api.add_resource(Signup, "/signup")






class Login(Resource):
    def post(self):
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")
        # Extract email and password from the JSON data

        user = User.query.filter(User.email == email).first()
        # Query the user with the provided email

        if user:
            if user.authenticate(password):
                session["user_id"] = user.id
                # If the user exists and the password is correct, store the user's ID in the session

                return user.to_dict(), 200
                # Return the authenticated user as JSON response
            
        return {"error": "401 Unauthorized"}, 401
        # If the user doesn't exist, return an error message with HTTP status code 401

api.add_resource(Login, "/login")






class Logout(Resource):
    def delete(self):
        if session.get("user_id"):
            session["user_id"] = None
            # If the user is authenticated, clear the stored user ID in the session

            return {}, 204
            # Return an empty response with HTTP status code 204 (No Content)
        
        return {"error": "401 Unauthorized"}, 401
        # If the user is not authenticated, return an error message with HTTP status code 401 (Unauthorized)

api.add_resource(Logout, "/logout")
# Add the Logout resource to the API with the specified URL endpoint





class CheckSession(Resource):
    def get(self):
        try:
            # Query the User table for the user with the stored user_id from the session
            user = User.query.filter_by(id=session["user_id"]).first()

            # Create a response with the user's information and a 200 status code
            response = make_response(
                user.to_dict(),
                200
            )

            return response
        
        except:
            # If the session is invalid or user does not exist, return a 401 error
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
                'multiple_choice_questions': json.loads(question.multiple_choice_questions) if question.multiple_choice_questions else None
            }
            questions_data.append(question_data)

        return jsonify(questions_data)

api.add_resource(ApplicationQuestionListResource, '/questions')











class SubmitAnswer(Resource):
    def post(self, question_id):
        try:
            data = request.get_json()

            # Ensure that the 'answers' key exists in the request data
            if 'answers' not in data:
                return make_response({"error": "Answers not provided"}, 400)

            # Create a new Answer record in the database and associate it with the question
            answer = Answer(question_id=question_id, answer=data['answers'])
            db.session.add(answer)
            db.session.commit()

            return make_response({"message": "Answer submitted successfully"}, 201)
        except Exception as e:
            # Log the error
            print("Error:", str(e))
            return make_response({"error": "Internal server error"}, 500)


api.add_resource(SubmitAnswer, "/<int:question_id>/submit_answer")






if __name__ == '__main__':
    app.run(port=5555, debug=True)