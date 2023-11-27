from flask_mail import Message
from celery import Celery
from config import mail

celery = Celery(__name__)

@celery.task
def send_email(to_email, subject, body):
    msg = Message(subject=subject, recipients=[to_email], body=body)
    mail.send(msg)
