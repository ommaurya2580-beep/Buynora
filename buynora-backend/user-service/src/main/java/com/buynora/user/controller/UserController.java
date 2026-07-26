package com.buynora.user.controller;

import com.buynora.user.dto.UserProfileRequest;
import com.buynora.user.dto.UserProfileResponse;
import com.buynora.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserProfileResponse> createProfile(@Valid @RequestBody UserProfileRequest request) {
        return new ResponseEntity<>(userService.createProfile(request), HttpStatus.CREATED);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable String email) {
        return ResponseEntity.ok(userService.getProfileByEmail(email));
    }

    @PutMapping("/{email}")
    public ResponseEntity<UserProfileResponse> updateProfile(@PathVariable String email, @Valid @RequestBody UserProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }
}
