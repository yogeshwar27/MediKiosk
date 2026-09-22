# ===================================================================
# MediKiosk Java Spring Boot & Relational SQL Backend
# ===================================================================

This directory contains the complete, production-ready **Java Spring Boot 3.x + Spring Data JPA + Relational SQL** backend service for the **MediKiosk (SIH26047)** clinical history-taking system.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17+
- **Persistence / ORM**: Spring Data JPA & Hibernate
- **Databases Supported**:
  - **H2 In-Memory Database** (pre-configured for zero-install instant local runs)
  - **PostgreSQL** (production grade, configured in `application.properties`)
  - **MySQL** (supported via bundled connector)
- **AI Integration**: Google Gemini 2.5 Flash (`@google/genai` REST API)

---

## 📂 Directory Structure

```
backend-spring-boot/
├── pom.xml                                      # Maven dependencies (Web, JPA, Postgres, MySQL, H2)
├── README.md                                    # This guide
└── src/
    └── main/
        ├── resources/
        │   ├── application.properties           # Spring datasource & server configs
        │   ├── schema.sql                       # Complete Relational SQL DDL (9 Tables, Indexes, FKs)
        │   └── data.sql                         # Initial database seed (Patients, Doctors, Tokens)
        └── java/in/gov/abdm/medikiosk/
            ├── MediKioskApplication.java        # Spring Boot main class
            ├── entity/                          # JPA / Hibernate Relational Entities
            │   ├── Patient.java                 # Patients table entity
            │   ├── Doctor.java                  # NMC-registered doctors table entity
            │   ├── QueueToken.java              # OPD tokens & triage entity
            │   └── Prescription.java            # Clinical prescriptions & consultations entity
            ├── repository/                      # Spring Data JPA Repositories
            │   ├── PatientRepository.java
            │   ├── DoctorRepository.java
            │   ├── QueueTokenRepository.java
            │   └── PrescriptionRepository.java
            ├── controller/                      # REST API Endpoints
            │   ├── AuthController.java          # /api/auth/patient/* and /api/auth/doctor/*
            │   └── QueueController.java         # /api/queue/* and /api/doctor/prescribe
            └── service/
                └── GeminiService.java           # Google Gemini AI clinical reasoning integration
```

---

## 🚀 How to Run the Spring Boot Backend

### 1. Prerequisites
- **Java 17** or higher (`java -version`)
- **Apache Maven 3.8+** (`mvn -v`)

### 2. Quick Run (H2 In-Memory Database - Zero Setup)
By default, the backend runs with an in-memory SQL database and loads `schema.sql` and `data.sql` automatically:

```bash
cd backend-spring-boot
mvn clean spring-boot:run
```

The Spring Boot server will start at:
- **REST API Base URL**: `http://localhost:8080/api`
- **Health Endpoint**: `http://localhost:8080/api/health`
- **Interactive H2 SQL Web Console**: `http://localhost:8080/h2-console`
  - *JDBC URL*: `jdbc:h2:mem:medikioskdb`
  - *Username*: `sa`
  - *Password*: (leave empty)

---

### 3. Running with PostgreSQL
1. Start your local PostgreSQL server or create a database:
   ```sql
   CREATE DATABASE medikiosk_db;
   ```
2. Open `src/main/resources/application.properties` and uncomment the PostgreSQL configuration:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/medikiosk_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```
3. Run the application:
   ```bash
   mvn clean spring-boot:run
   ```

---

## 🔗 Connecting the React Frontend to Spring Boot

The React frontend currently proxies `/api` to the local Node server (`http://localhost:3000`). If you wish to point the React frontend directly to this Spring Boot backend:
1. In `vite.config.ts`, set the proxy target to `http://localhost:8080`.
2. Both servers can run concurrently:
   - React UI on `http://localhost:3000`
   - Spring Boot + SQL API on `http://localhost:8080`
