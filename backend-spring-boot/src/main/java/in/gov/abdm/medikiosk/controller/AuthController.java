package in.gov.abdm.medikiosk.controller;

import in.gov.abdm.medikiosk.entity.Doctor;
import in.gov.abdm.medikiosk.entity.Patient;
import in.gov.abdm.medikiosk.repository.DoctorRepository;
import in.gov.abdm.medikiosk.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // Patient Sign-In (by ABHA ID, Mobile, or Aadhaar last 4 digits)
    @PostMapping("/patient/login")
    public ResponseEntity<?> loginPatient(@RequestBody Map<String, String> credentials) {
        String identifier = credentials.get("identifier");
        String pin = credentials.get("pin");

        if (identifier == null || identifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Identifier (ABHA / Mobile / Aadhaar) is required"));
        }

        String clean = identifier.trim().replaceAll("[\\s-]", "");

        Optional<Patient> match = patientRepository.findAll().stream().filter(p -> {
            String pAbha = p.getAbhaNumber().replaceAll("[\\s-]", "");
            String pMob = p.getMobile().replaceAll("[\\s-]", "");
            String pAadhaar = p.getAadhaarLastFour() != null ? p.getAadhaarLastFour() : "";
            return clean.equalsIgnoreCase(pAbha) || clean.equalsIgnoreCase(pMob) || clean.equalsIgnoreCase(pAadhaar);
        }).findFirst();

        if (match.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Patient account not found. Please create a new ABHA record."));
        }

        Patient patient = match.get();
        if (pin != null && !pin.isEmpty() && !patient.getPin().equals(pin.trim())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Incorrect 4-digit security PIN."));
        }

        return ResponseEntity.ok(Map.of(
            "status", "authenticated",
            "patient", patient
        ));
    }

    // Patient Register (ABHA Generation)
    @PostMapping("/patient/register")
    public ResponseEntity<?> registerPatient(@RequestBody Patient patient) {
        if (patient.getFullName() == null || patient.getMobile() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Full name and mobile number are required."));
        }

        if (patient.getId() == null || patient.getId().isEmpty()) {
            patient.setId("pat-" + UUID.randomUUID().toString().substring(0, 8));
        }

        if (patient.getAbhaNumber() == null || patient.getAbhaNumber().isEmpty()) {
            patient.setAbhaNumber(String.format("91-%04d-%04d-%04d", 
                new Random().nextInt(9000) + 1000, 
                new Random().nextInt(9000) + 1000, 
                new Random().nextInt(9000) + 1000));
        }

        if (patient.getAbhaAddress() == null || patient.getAbhaAddress().isEmpty()) {
            patient.setAbhaAddress(patient.getFullName().toLowerCase().replaceAll("\\s+", ".") + "@abdm");
        }

        Patient saved = patientRepository.save(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "status", "registered",
            "patient", saved
        ));
    }

    // Doctor Sign-In (NMC Reg Number & Password)
    @PostMapping("/doctor/login")
    public ResponseEntity<?> loginDoctor(@RequestBody Map<String, String> credentials) {
        String regNumber = credentials.get("regNumber");
        String password = credentials.get("password");

        if (regNumber == null || regNumber.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "NMC / State registration number is required"));
        }

        Optional<Doctor> match = doctorRepository.findAll().stream().filter(d -> 
            d.getRegNumber().trim().equalsIgnoreCase(regNumber.trim())
        ).findFirst();

        if (match.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Doctor registration record not found on NMC registry."));
        }

        Doctor doctor = match.get();
        if (password != null && !password.isEmpty() && !doctor.getPassword().equals(password.trim())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid doctor password credentials."));
        }

        return ResponseEntity.ok(Map.of(
            "status", "authenticated",
            "doctor", doctor
        ));
    }

    // Doctor Registration (New verified practitioner)
    @PostMapping("/doctor/register")
    public ResponseEntity<?> registerDoctor(@RequestBody Doctor doctor) {
        if (doctor.getRegNumber() == null || doctor.getFullName() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "NMC Registration Number and Full Name are mandatory."));
        }

        if (doctor.getId() == null || doctor.getId().isEmpty()) {
            doctor.setId("doc-" + UUID.randomUUID().toString().substring(0, 8));
        }

        Doctor saved = doctorRepository.save(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "status", "registered",
            "doctor", saved
        ));
    }
}
