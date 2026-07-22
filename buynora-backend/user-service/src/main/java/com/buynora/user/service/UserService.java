package com.buynora.user.service;

import com.buynora.user.entity.UserProfile;
import com.buynora.user.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserProfileRepository repository;

    public UserProfile createProfile(UserProfile profile) {
        return repository.save(profile);
    }

    public UserProfile getProfileByEmail(String email) {
        return repository.findByEmail(email).orElseThrow(() -> new RuntimeException("User profile not found for email: " + email));
    }

    public UserProfile updateProfile(String email, UserProfile updatedProfile) {
        UserProfile existingProfile = getProfileByEmail(email);
        existingProfile.setFirstName(updatedProfile.getFirstName());
        existingProfile.setLastName(updatedProfile.getLastName());
        existingProfile.setPhone(updatedProfile.getPhone());
        existingProfile.setAddress(updatedProfile.getAddress());
        return repository.save(existingProfile);
    }
}
