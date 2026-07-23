package com.buynora.authentication.repository;

import com.buynora.authentication.entity.FailedLoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FailedLoginAttemptRepository extends JpaRepository<FailedLoginAttempt, Long> {
    Optional<FailedLoginAttempt> findByEmailAndIpAddress(String email, String ipAddress);
}
