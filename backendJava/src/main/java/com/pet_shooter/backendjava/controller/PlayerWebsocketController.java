package com.pet_shooter.backendjava.controller;


import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

@Controller
public class PlayerWebsocketController {

    private final SimpMessagingTemplate template;

    public PlayerWebsocketController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/{userId}/get-active-players")
    @SendTo("/topic/get-active-players")
    public void getActivePlayers(@DestinationVariable String userId) throws Exception {
        sendActivePlayers();
    }

    @Scheduled(fixedRate = 5000)
    private void sendActivePlayers() throws Exception {
        this.template.convertAndSend("/topic/get-active-players", "test");
    }
}
