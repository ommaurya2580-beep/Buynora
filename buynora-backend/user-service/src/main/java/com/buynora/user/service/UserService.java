package com.buynora.user.service;

import com.buynora.user.dto.UserProfileRequest;
import com.buynora.user.dto.UserProfileResponse;
import com.buynora.user.entity.UserProfile;
import com.buynora.user.exception.ResourceNotFoundException;
import com.buynora.user.mapper.UserProfileMapper;
import com.buynora.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository repository;
    private final UserProfileMapper mapper;

    @Transactional
    public UserProfileResponse createProfile(UserProfileRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }
        UserProfile entity = mapper.toEntity(request);
        UserProfile savedEntity = repository.save(entity);
        return mapper.toResponse(savedEntity);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfileByEmail(String email) {
        UserProfile profile = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for email: " + email));
        return mapper.toResponse(profile);
    }

    @Transactional
    public UserProfileResponse updateProfile(String email, UserProfileRequest request) {
        UserProfile existingProfile = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for email: " + email));
        
        mapper.updateEntityFromRequest(request, existingProfile);
        UserProfile savedProfile = repository.save(existingProfile);
        return mapper.toResponse(savedProfile);
    }
}
