package in.gov.abdm.medikiosk.controller;

import in.gov.abdm.medikiosk.entity.Prescription;
import in.gov.abdm.medikiosk.entity.QueueToken;
import in.gov.abdm.medikiosk.repository.PrescriptionRepository;
import in.gov.abdm.medikiosk.repository.QueueTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QueueController {

    @Autowired
    private QueueTokenRepository queueTokenRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "framework", "Spring Boot 3.2.5",
            "runtime", "Java 17",
            "database", "PostgreSQL / H2 Relational SQL",
            "service", "MediKiosk Clinical AI Engine (SIH26047)",
            "sihCode", "SIH26047"
        ));
    }

    // Get all active queue tokens
    @GetMapping("/queue/tokens")
    public ResponseEntity<List<QueueToken>> getAllTokens() {
        return ResponseEntity.ok(queueTokenRepository.findAllByOrderByCreatedAtDesc());
    }

    // Get token by token number (e.g. OPD-A-042)
    @GetMapping("/queue/token/{tokenNumber}")
    public ResponseEntity<?> getTokenByNumber(@PathVariable String tokenNumber) {
        Optional<QueueToken> token = queueTokenRepository.findByTokenNumber(tokenNumber.trim());
        if (token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Token " + tokenNumber + " not found in hospital queue."));
        }
        return ResponseEntity.ok(token.get());
    }

    // Save newly issued kiosk token
    @PostMapping("/queue/token")
    public ResponseEntity<?> saveToken(@RequestBody QueueToken token) {
        if (token.getId() == null || token.getId().isEmpty()) {
            token.setId("token-" + UUID.randomUUID().toString().substring(0, 8));
        }

        if (token.getTokenNumber() == null || token.getTokenNumber().isEmpty()) {
            String prefix = "P1".equalsIgnoreCase(token.getPriority()) ? "P1-EMERGENCY-" : "OPD-A-";
            token.setTokenNumber(prefix + String.format("%03d", new Random().nextInt(900) + 100));
        }

        token.setCreatedAt(LocalDateTime.now());
        token.setUpdatedAt(LocalDateTime.now());

        QueueToken saved = queueTokenRepository.save(token);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "status", "saved",
            "token", saved
        ));
    }

    // Doctor Prescribe & Complete Consultation
    @PostMapping("/doctor/prescribe")
    public ResponseEntity<?> savePrescription(@RequestBody Map<String, Object> payload) {
        String tokenNumber = (String) payload.get("tokenNumber");
        String doctorId = (String) payload.get("doctorId");
        String doctorName = (String) payload.get("doctorName");
        String diagnosis = (String) payload.get("diagnosis");
        String clinicalNotes = (String) payload.get("clinicalNotes");
        String followUpAdvice = (String) payload.get("followUpAdvice");
        String followUpDate = (String) payload.get("followUpDate");

        if (tokenNumber == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token number is required"));
        }

        Optional<QueueToken> tokenOpt = queueTokenRepository.findByTokenNumber(tokenNumber.trim());
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Queue token not found"));
        }

        QueueToken token = tokenOpt.get();
        token.setStatus("COMPLETED");
        token.setUpdatedAt(LocalDateTime.now());
        queueTokenRepository.save(token);

        Prescription rx = new Prescription();
        rx.setId("rx-" + UUID.randomUUID().toString().substring(0, 8));
        rx.setTokenId(token.getId());
        rx.setDoctorId(doctorId != null ? doctorId : "doc-001");
        rx.setDoctorName(doctorName != null ? doctorName : "Dr. Anand K. Sharma, MD");
        rx.setFinalDiagnosis(diagnosis != null ? diagnosis : "Clinical Consultation Completed");
        rx.setClinicalNotes(clinicalNotes);
        rx.setFollowUpAdvice(followUpAdvice);
        rx.setFollowUpDate(followUpDate);
        rx.setCreatedAt(LocalDateTime.now());

        prescriptionRepository.save(rx);

        return ResponseEntity.ok(Map.of(
            "status", "prescribed",
            "prescriptionId", rx.getId(),
            "token", token
        ));
    }
}
