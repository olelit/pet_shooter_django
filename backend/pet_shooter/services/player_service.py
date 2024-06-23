import pdb
import random

from django.shortcuts import get_object_or_404
from django.utils import timezone

from ..models import Player


def get_new_player(request):
    ip = request.META['REMOTE_ADDR']

    # exist_player = Player.objects.filter(ip_address=ip)
    #
    # if exist_player:
    #     return exist_player.first()

    players_count = Player.objects.count()
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    rgb = "#{:02x}{:02x}{:02x}".format(r, g, b)
    player = Player(name='player' + str(players_count), r_g_b=rgb, ip_address=ip)
    player.save()
    return player


def update_activity(player):
    player.last_activity = timezone.now()
    player.save()
    return player


def delete_current_player(player):
    player.delete()
