package in.gov.abdm.medikiosk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * MediKiosk Spring Boot Application Entry Point
 * Smart India Hackathon - Problem Statement: SIH26047
 */
@SpringBootApplication
public class MediKioskApplication {

    public static void main(String[] args) {
        SpringApplication.run(MediKioskApplication.class, args);
        System.out.println("===============================================================");
        System.out.println("MediKiosk Spring Boot Server Running on http://localhost:8080");
        System.out.println("ABDM FHIR R4 & Relational SQL Backend Active");
        System.out.println("H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("===============================================================");
    }
}
