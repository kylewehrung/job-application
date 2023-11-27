from app import create_celery

celery = create_celery()

if __name__ == '__main__':
    celery.start()
