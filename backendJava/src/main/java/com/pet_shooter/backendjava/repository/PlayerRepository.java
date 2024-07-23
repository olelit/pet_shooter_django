package com.pet_shooter.backendjava.repository;

import com.pet_shooter.backendjava.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    Player findFirstByIpAddress(String ipAddress);
}