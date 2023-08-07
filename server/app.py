from flask import Flask, request, session, make_response, abort
from flask_restful import Resource
from sqlalchemy.orm import subqueryload
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import ApplicationQuestion, User




class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        # Extract username, email and password from the JSON data

        new_user = User(
            username=username,
            email=email,
        )
        # Create a new User instance with the provided username

        new_user.password_hash = password

        try:
            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id
            # Add the new user to the database, commit changes, store the user's ID in the session

            return new_user.to_dict(), 201
        
        except IntegrityError:
            return {"error": "422 Unprocessable Entity"}, 422
            # If there's an integrity error (e.g., duplicate username), return an error message with HTTP status code 422 (Unprocessable Entity)
        
api.add_resource(Signup, "/signup")






class ApplicationQuestions(Resource):
    def get(self):
        application_questions = [application_question.to_dict() for application_question in ApplicationQuestion.query.all()] 
        # Query for all application questions

        return make_response(application_questions, 200)
    
api.add_resource(ApplicationQuestions, "/application_questions")
















if __name__ == '__main__':
    app.run(port=5555, debug=True)