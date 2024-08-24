package com.pet_shooter.backendjava.controller;

import com.pet_shooter.backendjava.dto.BulletCoords;
import com.pet_shooter.backendjava.dto.PlayerCoords;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class PlayerWebsocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public PlayerWebsocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("send-coords")
    public void sendCoords(PlayerCoords coords, Principal principal) {
        messagingTemplate.convertAndSend("/topic/get-coords", coords);
        messagingTemplate.convertAndSendToUser(principal.getName(), "/topic/get-coords", coords);
    }

    @MessageMapping("send-transform")
    public void sendTransform(PlayerCoords coords, Principal principal) {
        messagingTemplate.convertAndSend("/topic/get-transform", coords);
        messagingTemplate.convertAndSendToUser(principal.getName(), "/topic/get-transform", coords);
    }

    @MessageMapping("new-player")
    public void newPlayer(PlayerCoords coords, Principal principal) {
        messagingTemplate.convertAndSend("/topic/new-player", coords);
        messagingTemplate.convertAndSendToUser(principal.getName(), "/topic/new-player", coords);
    }

    @MessageMapping("send-bullet")
    public void sendBullet(BulletCoords coords, Principal principal) {
        messagingTemplate.convertAndSend("/topic/get-bullet", coords);
        messagingTemplate.convertAndSendToUser(principal.getName(), "/topic/get-bullet", coords);
    }
}