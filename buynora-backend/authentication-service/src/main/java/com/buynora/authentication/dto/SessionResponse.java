package com.buynora.authentication.dto;

import com.buynora.authentication.entity.enums.SessionStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionResponse {

    private String sessionUuid;

    private String deviceName;

    private String browser;

    private String operatingSystem;

    private String deviceType;

    private String country;

    private String city;

    private String ipAddress;

    private LocalDateTime loginTime;

    private LocalDateTime logoutTime;

    private SessionStatus status;
}
