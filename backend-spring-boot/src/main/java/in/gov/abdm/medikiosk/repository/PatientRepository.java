package in.gov.abdm.medikiosk.repository;

import in.gov.abdm.medikiosk.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByAbhaNumber(String abhaNumber);
    Optional<Patient> findByMobile(String mobile);
    Optional<Patient> findByAadhaarLastFour(String aadhaarLastFour);
}
