import logging
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import Player

logger = logging.getLogger(__name__)


@shared_task
def my_daily_task():
    try:
        logger.info("Запуск ежедневной задачи")
        print('TEST')
        one_hour_ago = timezone.now() - timedelta(hours=1)
        logger.info("Удаление игроков, не активных более часа назад")
        Player.objects.filter(last_activity__lt=one_hour_ago).delete()
        logger.info("Удаление всех игроков")
        Player.objects.all().delete()
        logger.info("Завершение ежедневной задачи")
    except Exception as e:
        logger.error(f"Ошибка в my_daily_task: {e}")
