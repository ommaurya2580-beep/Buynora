package com.buynora.authentication.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "devices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "device_uuid", nullable = false, unique = true, length = 36)
    private String deviceUuid;

    @Column(name = "device_name", length = 100)
    private String deviceName;

    @Column(name = "platform", length = 50)
    private String platform;

    @Column(name = "browser", length = 100)
    private String browser;

    @Column(name = "app_version", length = 50)
    private String appVersion;

    @Column(name = "push_token", length = 512)
    private String pushToken;

    @Column(name = "trusted", nullable = false)
    @Builder.Default
    private Boolean trusted = false;

    @Column(name = "last_seen", nullable = false)
    private LocalDateTime lastSeen;

    @PrePersist
    protected void onCreate() {
        if (deviceUuid == null) {
            deviceUuid = UUID.randomUUID().toString();
        }
        if (lastSeen == null) {
            lastSeen = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        lastSeen = LocalDateTime.now();
    }
}
