package com.buynora.user.mapper;

import com.buynora.user.dto.UserProfileRequest;
import com.buynora.user.dto.UserProfileResponse;
import com.buynora.user.entity.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserProfileMapper {

    UserProfile toEntity(UserProfileRequest request);

    UserProfileResponse toResponse(UserProfile entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true) // Email should typically not be updatable, or handled separately
    void updateEntityFromRequest(UserProfileRequest request, @MappingTarget UserProfile entity);
}
