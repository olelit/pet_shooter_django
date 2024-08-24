package com.pet_shooter.backendjava.repository;

import com.pet_shooter.backendjava.model.Player;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    Player findFirstByIpAddress(String ipAddress);
    List<Player> findAll();
   
    @Transactional
    void deleteByName(String playerName);
}