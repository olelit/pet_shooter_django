package com.pet_shooter.backendjava.service;

import com.pet_shooter.backendjava.model.Player;
import com.pet_shooter.backendjava.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public Player createOrGetPlayer(String ipAddress) {
        Player existPlayer = playerRepository.findFirstByIpAddress(ipAddress);
//        if (existPlayer != null) {
//            return existPlayer;
//        }

        long playersCount = playerRepository.count();
        Random random = new Random();
        int r = random.nextInt(256);
        int g = random.nextInt(256);
        int b = random.nextInt(256);
        String rgb = String.format("#%02x%02x%02x", r, g, b);

        Player player = new Player();
        player.setName("player" + playersCount);
        player.setRGB(rgb);
        player.setIpAddress(ipAddress);
        playerRepository.save(player);

        return player;
    }
}
