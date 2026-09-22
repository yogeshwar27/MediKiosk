package in.gov.abdm.medikiosk.repository;

import in.gov.abdm.medikiosk.entity.QueueToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueTokenRepository extends JpaRepository<QueueToken, String> {
    Optional<QueueToken> findByTokenNumber(String tokenNumber);
    List<QueueToken> findAllByOrderByCreatedAtDesc();
    List<QueueToken> findByStatus(String status);
    List<QueueToken> findByPriority(String priority);
}
