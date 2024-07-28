package com.pet_shooter.backendjava.controller;

import com.pet_shooter.backendjava.dto.PlayerCoords;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class PlayerWebsocketController {

    @MessageMapping("send-coords")
    @SendTo("/topic/get-coords")
    public PlayerCoords sendCoords(PlayerCoords coords) throws Exception {
        return coords;
    }

    @MessageMapping("send-transform")
    @SendTo("/topic/get-transform")
    public PlayerCoords sendTransform(PlayerCoords coords) throws Exception {
        return coords;
    }

    @MessageMapping("new-player")
    @SendTo("/topic/new-player")
    public PlayerCoords newPlayer(PlayerCoords coords) throws Exception {
        return coords;
    }
}
