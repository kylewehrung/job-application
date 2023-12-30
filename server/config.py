from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import boto3
from botocore.exceptions import ClientError
import json
from alembic.config import Config
import os

# Configure Flask app
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')

# Function to retrieve database credentials from AWS Secrets Manager
def get_secret():
    secret_name = "JobAppSecretNameDB"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e

    secret = get_secret_value_response['SecretString']
    return json.loads(secret)

# Retrieve database credentials from AWS Secrets Manager
secret_values = get_secret()
print("Secret Values:", secret_values)

# Use the credentials to construct the SQLAlchemy URL
db_username = os.environ.get('username')
db_password = os.environ.get('password')
sqlalchemy_url = f"postgresql://{db_username}:{db_password}@job-app-postgres-db.c10eucqcgpbr.us-east-1.rds.amazonaws.com:5432/job-app-postgres-db"

# Configure Flask app with database URI
app.config['SQLALCHEMY_DATABASE_URI'] = sqlalchemy_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.json.compact = False
app.debug = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

bcrypt = Bcrypt(app)
api = Api(app)
