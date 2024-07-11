from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio
from channels.db import database_sync_to_async

from .models import Player
from .serializers import PlayerSerializer


class ActivePlayerConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.pk = self.scope['url_route']['kwargs']['pk']
        # Создаём задачу без ожидания
        asyncio.create_task(self.send_data_continuously())

    async def disconnect(self, close_code):
        pass

    async def send_data_continuously(self):
        while True:
            try:
                # Получаем игроков в асинхронном контексте
                players = await self.get_players()
                # Сериализуем данные в асинхронном контексте
                serialized_data = await self.serialize_players(players)
                # Отправляем сериализованные данные
                await self.send(text_data=json.dumps(serialized_data))
                # Ожидаем 1 секунду перед следующей отправкой
                await asyncio.sleep(1)
            except Exception as e:
                # Обрабатываем исключения и выводим их в лог
                print(f"Error in send_data_continuously: {e}")
                break

    @database_sync_to_async
    def get_players(self):
        return Player.objects.exclude(id=self.pk)

    @database_sync_to_async
    def serialize_players(self, players):
        serializer = PlayerSerializer(players, many=True)
        return serializer.data
