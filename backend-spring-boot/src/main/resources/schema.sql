-- ===================================================================
-- MediKiosk Relational SQL Schema (PostgreSQL / MySQL / H2 Compliant)
-- SIH26047: Hospital OPD Clinical Intake & Triage System
-- ===================================================================

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(64) PRIMARY KEY,
    abha_number VARCHAR(32) UNIQUE NOT NULL,
    abha_address VARCHAR(128) UNIQUE NOT NULL,
    aadhaar_last_four VARCHAR(8),
    full_name VARCHAR(128) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(16) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    pin VARCHAR(16) NOT NULL,
    blood_group VARCHAR(8),
    state VARCHAR(64),
    city VARCHAR(64),
    emergency_contact_name VARCHAR(128),
    emergency_contact_relation VARCHAR(64),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doctors Table (NMC Verified Practitioners)
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(64) PRIMARY KEY,
    reg_number VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    specialty VARCHAR(64) NOT NULL,
    hospital_name VARCHAR(128) NOT NULL,
    department VARCHAR(64) NOT NULL,
    room_number VARCHAR(32) NOT NULL,
    duty_shift VARCHAR(32) DEFAULT 'Morning (08:00 - 14:00)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. OPD Queue & Triage Tokens Table
CREATE TABLE IF NOT EXISTS queue_tokens (
    id VARCHAR(64) PRIMARY KEY,
    token_number VARCHAR(32) UNIQUE NOT NULL,
    patient_id VARCHAR(64) NOT NULL,
    patient_name VARCHAR(128) NOT NULL,
    abha_number VARCHAR(32) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(16) NOT NULL,
    chief_complaint TEXT NOT NULL,
    primary_language VARCHAR(32) DEFAULT 'English',
    priority VARCHAR(16) NOT NULL, -- 'P1', 'P2', 'P3'
    status VARCHAR(32) NOT NULL,   -- 'WAITING', 'IN_CONSULTATION', 'COMPLETED'
    assigned_room VARCHAR(32) NOT NULL,
    assigned_doctor VARCHAR(128),
    department VARCHAR(64) NOT NULL,
    turn_count INT DEFAULT 1,
    time_saved_minutes INT DEFAULT 7,
    summary_snapshot TEXT,
    hpi_narrative TEXT,
    past_history TEXT,
    suggested_workup TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_token_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 4. Clinical Red Flags Table
CREATE TABLE IF NOT EXISTS token_red_flags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token_id VARCHAR(64) NOT NULL,
    flag VARCHAR(255) NOT NULL,
    risk VARCHAR(32) NOT NULL,
    status VARCHAR(64) NOT NULL,
    CONSTRAINT fk_flag_token FOREIGN KEY (token_id) REFERENCES queue_tokens(id) ON DELETE CASCADE
);

-- 5. Differential Diagnoses Table
CREATE TABLE IF NOT EXISTS token_differential_diagnoses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token_id VARCHAR(64) NOT NULL,
    condition_name VARCHAR(128) NOT NULL,
    likelihood VARCHAR(32) NOT NULL,
    reasoning TEXT,
    CONSTRAINT fk_diff_token FOREIGN KEY (token_id) REFERENCES queue_tokens(id) ON DELETE CASCADE
);

-- 6. Active Medications Extracted from OCR / Intake
CREATE TABLE IF NOT EXISTS token_medications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token_id VARCHAR(64) NOT NULL,
    drug_name VARCHAR(128) NOT NULL,
    frequency VARCHAR(64),
    compliance VARCHAR(64),
    CONSTRAINT fk_med_token FOREIGN KEY (token_id) REFERENCES queue_tokens(id) ON DELETE CASCADE
);

-- 7. Abnormal Lab Results from OCR
CREATE TABLE IF NOT EXISTS token_lab_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token_id VARCHAR(64) NOT NULL,
    test_name VARCHAR(128) NOT NULL,
    observed_value VARCHAR(64) NOT NULL,
    normal_range VARCHAR(64) NOT NULL,
    is_abnormal BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_lab_token FOREIGN KEY (token_id) REFERENCES queue_tokens(id) ON DELETE CASCADE
);

-- 8. Doctor Prescriptions & Consultations Record
CREATE TABLE IF NOT EXISTS doctor_prescriptions (
    id VARCHAR(64) PRIMARY KEY,
    token_id VARCHAR(64) NOT NULL,
    doctor_id VARCHAR(64) NOT NULL,
    doctor_name VARCHAR(128) NOT NULL,
    final_diagnosis TEXT NOT NULL,
    clinical_notes TEXT,
    follow_up_advice TEXT,
    follow_up_date VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rx_token FOREIGN KEY (token_id) REFERENCES queue_tokens(id) ON DELETE CASCADE,
    CONSTRAINT fk_rx_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 9. Prescription Medicines Line Items
CREATE TABLE IF NOT EXISTS prescription_medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_id VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    dosage VARCHAR(64) NOT NULL,
    frequency VARCHAR(64) NOT NULL,
    meal_timing VARCHAR(64) NOT NULL,
    duration VARCHAR(64) NOT NULL,
    instructions TEXT,
    category VARCHAR(64),
    CONSTRAINT fk_rx_med FOREIGN KEY (prescription_id) REFERENCES doctor_prescriptions(id) ON DELETE CASCADE
);

-- Create Indexes for fast querying in large hospital databases
CREATE INDEX IF NOT EXISTS idx_patients_mobile ON patients(mobile);
CREATE INDEX IF NOT EXISTS idx_patients_abha ON patients(abha_number);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON queue_tokens(status);
CREATE INDEX IF NOT EXISTS idx_tokens_priority ON queue_tokens(priority);
CREATE INDEX IF NOT EXISTS idx_doctors_reg ON doctors(reg_number);
