package in.gov.abdm.medikiosk.repository;

import in.gov.abdm.medikiosk.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
    Optional<Doctor> findByRegNumber(String regNumber);
    Optional<Doctor> findByEmail(String email);
}
