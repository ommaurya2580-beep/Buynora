package com.buynora.authentication.repository;

import com.buynora.authentication.entity.OtpRecord;
import com.buynora.authentication.entity.enums.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRecordRepository extends JpaRepository<OtpRecord, Long> {
    Optional<OtpRecord> findTopByEmailAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(String email, OtpPurpose purpose);
    Optional<OtpRecord> findTopByPhoneAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(String phone, OtpPurpose purpose);
}
