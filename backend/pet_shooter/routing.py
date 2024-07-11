from django.urls import path
from .consumers import ActivePlayerConsumer

ws_patterns = [
    path('ws/players/<int:pk>/get-active-players', ActivePlayerConsumer.as_asgi()),
]