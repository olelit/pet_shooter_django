from django.shortcuts import get_object_or_404
from django.utils import timezone

from ..models import Player


def get_new_player():
    players_count = Player.objects.count()
    player = Player(name='player' + str(players_count))
    player.save()
    return player


def update_activity(player):
    player.last_activity = timezone.now()
    player.save()
    return player

