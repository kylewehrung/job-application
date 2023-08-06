from flask import Flask
from flask_restful import Resource

from config import app, db, api

# Basic message to test if it's working when running
class HelloWorld(Resource):
    def get(self):
        return {"Message": "Hello, World!"}

api.add_resource(HelloWorld, "/hello_world")




if __name__ == '__main__':
    app.run(port=5555, debug=True)