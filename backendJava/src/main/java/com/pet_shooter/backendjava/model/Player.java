package com.pet_shooter.backendjava.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String name;

    private Integer health = 100;

    @Column(name = "last_activity", nullable = false)
    private LocalDateTime lastActivity = LocalDateTime.now();

    @Column(name = "r_g_b", nullable = false)
    private String rgb = "255, 255, 255";

    @Column(name = "ip_address", nullable = false)
    private String ipAddress;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRGB() {
        return rgb;
    }

    public void setRGB(String rgb) {
        this.rgb = rgb;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
}
