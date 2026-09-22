package in.gov.abdm.medikiosk.repository;

import in.gov.abdm.medikiosk.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    List<Prescription> findByTokenId(String tokenId);
    List<Prescription> findByDoctorId(String doctorId);
}
