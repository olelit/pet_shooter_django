
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

celery_app = Celery('backend')
celery_app.config_from_object('django.conf:settings', namespace='CELERY')
celery_app.autodiscover_tasks()
celery_app.conf.task_default_queue = 'default'
celery_app.conf.task_routes = {
    'pet_shooter.tasks.*': {'queue': 'pet_shooter'},
}


from celery.schedules import crontab

celery_app.conf.beat_schedule = {
    'my_daily_task': {
        'task': 'pet_shooter.tasks.my_daily_task',
        'schedule': crontab(),
    },
}