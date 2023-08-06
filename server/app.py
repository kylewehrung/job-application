from flask import Flask, request, session, make_response, abort
from flask_restful import Resource

from config import app, db, api
from models import ApplicationQuestion





class ApplicationQuestions(Resource):
    def get(self):
        application_questions = [application_question.to_dict() for application_question in ApplicationQuestion.query.all()]

        return make_response(application_questions, 200)
    
api.add_resource(ApplicationQuestions, "/application_questions")



















if __name__ == '__main__':
    app.run(port=5555, debug=True)