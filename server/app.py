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







# This endpoint didn't work, don't fully know why yet so I'm keeping it until I do
# class ApplicationQuestions(Resource):
#     def get(self):
#         application_questions = [application_question.to_dict() for application_question in ApplicationQuestion.query.all()] 
#         # Query for all application questions

#         return make_response(application_questions, 200)
    
# api.add_resource(ApplicationQuestions, "/application_questions")





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







# class ApplicationQuestionsById(Resource):
#     def get(self, question_id):
#         # Query for the application question by ID
#         application_question = ApplicationQuestion.query.get(question_id)
        
#         if not application_question:
#             return make_response({"message": "Question not found"}, 404)
        
#         # Convert the application question to a dictionary or serialize it as needed
#         question_data = application_question.to_dict()
        
#         return make_response(question_data, 200)
    

# api.add_resource(ApplicationQuestionsById, "/application_questions/<int:question_id>")





class SubmitAnswer(Resource):
    def post(self, question_id):
        data = request.get_json()
        
        # Assuming data contains the user's answer

        # Create a new Answer record in the database and associate it with the question
        answer = Answer(question_id=question_id, answer=data['answer'])  # Use 'answer' key
        db.session.add(answer)
        db.session.commit()

        return make_response({"message": "Answer submitted successfully"}, 201)



api.add_resource(SubmitAnswer, "/application_questions/<int:question_id>/submit_answer")







class UserAllAnswers(Resource):
    def get(self):
        # You need a way to identify the user (e.g., by user ID or username)
        # Assuming you have a way to identify the user, you can retrieve all their answers here
        user_id = 1  # Replace with the actual user ID
        user = User.query.get(user_id)
        if user:
            user_answers = [{"question_id": answer.question_id, "answer": answer.answer} for answer in user.answers]
            return {"user_id": user.id, "answers": user_answers}
        else:
            return {"message": "User not found"}, 404

api.add_resource(UserAllAnswers, "/user_all_answers")










if __name__ == '__main__':
    app.run(port=5555, debug=True)