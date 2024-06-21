from django.urls import path
from . import views

urlpatterns = [
    path('players/get-player-name', views.get_player_name),
    path('players/<int:pk>/update-activity', views.update_player_activity),
]