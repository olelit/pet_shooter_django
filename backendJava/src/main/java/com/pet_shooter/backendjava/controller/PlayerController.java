package com.pet_shooter.backendjava.controller;

import com.pet_shooter.backendjava.model.Player;
import com.pet_shooter.backendjava.service.PlayerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/v1/players")
public class PlayerController {

    private static final Logger logger = LoggerFactory.getLogger(PlayerController.class);

    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/get-all-players")
    public List<Player> getAllPlayers(){
        return playerService.getAllPlayers();
    }

    @GetMapping("/get-player-name")
    public Player getPlayerName(HttpServletRequest request) {
        try {
            String ipAddress = request.getRemoteAddr();
            logger.info("Received request from IP: " + ipAddress);
            return playerService.createOrGetPlayer(ipAddress);
        } catch (Exception e) {
            logger.error("Error processing request", e);
            throw e; // This will ensure the exception is still thrown after logging
        }
    }

    @DeleteMapping("/delete-player/{playerName}")
    public void deletePlayer(@PathVariable String playerName){
        playerService.deletePlayer(playerName);
    }
}