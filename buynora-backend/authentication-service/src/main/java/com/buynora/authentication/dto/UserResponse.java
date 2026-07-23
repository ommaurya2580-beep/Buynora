package com.buynora.authentication.dto;

import com.buynora.authentication.entity.enums.AccountStatus;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private String uuid;

    private String firstName;

    private String lastName;

    private String displayName;

    private String email;

    private String phone;

    private String profileImage;

    private Set<String> roles;

    private AccountStatus accountStatus;

    private Boolean emailVerified;

    private Boolean phoneVerified;

    private Boolean twoFactorEnabled;
}
