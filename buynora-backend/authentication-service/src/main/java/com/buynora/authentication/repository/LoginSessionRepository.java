package com.buynora.authentication.repository;

import com.buynora.authentication.entity.LoginSession;
import com.buynora.authentication.entity.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoginSessionRepository extends JpaRepository<LoginSession, Long> {
    Optional<LoginSession> findBySessionUuid(String sessionUuid);
    List<LoginSession> findByUserIdAndStatus(Long userId, SessionStatus status);
}
