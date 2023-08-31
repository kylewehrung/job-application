from flask import Flask, request, session, make_response, abort
from flask_restful import Resource
from sqlalchemy.orm import subqueryload
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS

from config import app, db, api
from models import ApplicationQuestion, User
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








class ApplicationQuestions(Resource):
    def get(self):
        application_questions = [application_question.to_dict() for application_question in ApplicationQuestion.query.all()] 
        # Query for all application questions

        return make_response(application_questions, 200)
    
api.add_resource(ApplicationQuestions, "/application_questions")












if __name__ == '__main__':
    app.run(port=5555, debug=True)