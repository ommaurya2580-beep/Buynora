package com.buynora.user.controller;

import com.buynora.user.entity.UserProfile;
import com.buynora.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public UserProfile createProfile(@RequestBody UserProfile profile) {
        return userService.createProfile(profile);
    }

    @GetMapping("/{email}")
    public UserProfile getProfile(@PathVariable String email) {
        return userService.getProfileByEmail(email);
    }

    @PutMapping("/{email}")
    public UserProfile updateProfile(@PathVariable String email, @RequestBody UserProfile profile) {
        return userService.updateProfile(email, profile);
    }
}
