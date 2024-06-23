from django.db import models
from django.utils import timezone


class Player(models.Model):
    name = models.CharField(max_length=100)
    health = models.IntegerField(default=100)
    last_activity = models.DateTimeField(default=timezone.now)
    r_g_b = models.CharField(default='255, 255, 255')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
