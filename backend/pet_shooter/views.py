from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from .models import Player
from .serializers import PlayerSerializer
from .services.player_service import get_new_player, update_activity, delete_current_player


def get_player_name(request):
    player = get_new_player(request)
    serializer = PlayerSerializer(player)
    return JsonResponse(serializer.data, status=201)


def update_player_activity(request, pk):
    player = get_object_or_404(Player, pk=pk)
    serializer = PlayerSerializer(player)
    return JsonResponse(serializer.data, status=200)


def delete_player(request, pk):
    player = get_object_or_404(Player, pk=pk)
    delete_current_player(player)
    return JsonResponse({
        'status': 'success',
    }, status=200)