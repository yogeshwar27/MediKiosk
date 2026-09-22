-- ===================================================================
-- MediKiosk Initial Seed Data (Patients, Doctors, Active OPD Tokens)
-- ===================================================================

-- 1. Seed Patients
INSERT INTO patients (id, abha_number, abha_address, aadhaar_last_four, full_name, age, gender, mobile, pin, blood_group, state, city, emergency_contact_name, emergency_contact_relation, emergency_contact_phone)
VALUES 
('pat-001', '91-4523-8821-9043', 'rajesh.verma@abdm', '9043', 'Rajesh Kumar Verma', 48, 'Male', '9876543210', '1234', 'B+', 'Telangana', 'Hyderabad', 'Sunita Verma', 'Spouse', '9876543211'),
('pat-002', '91-3214-7749-6712', 'priya.sharma@abdm', '6712', 'Priya Sharma', 29, 'Female', '9811223344', '1234', 'O+', 'Delhi', 'New Delhi', 'Amit Sharma', 'Brother', '9811223345'),
('pat-003', '91-6677-2211-4589', 'ramesh.rao@abdm', '4589', 'Ramesh Rao Patel', 64, 'Male', '9988776655', '1234', 'A+', 'Maharashtra', 'Nagpur', 'Vikram Patel', 'Son', '9988776656');

-- 2. Seed Doctors
INSERT INTO doctors (id, reg_number, full_name, email, password, specialty, hospital_name, department, room_number, duty_shift)
VALUES
('doc-001', 'TSMC-48921', 'Dr. Anand K. Sharma, MD', 'anand.sharma@osmania.gov.in', 'doctor123', 'Internal Medicine', 'District Civil Hospital, Secunderabad', 'General Medicine OPD', 'Room 204', 'Morning (08:00 - 14:00)'),
('doc-002', 'MCI-19482', 'Dr. Sunita Deshmukh, MD', 'sunita.deshmukh@aiims.gov.in', 'doctor123', 'Emergency Medicine', 'District Civil Hospital, Secunderabad', 'Trauma & Emergency Bay', 'Room 102', '24x7 Emergency Triage'),
('doc-003', 'TSMC-39102', 'Dr. Rajeshwar Rao, MS', 'rajeshwar.rao@osmania.gov.in', 'doctor123', 'Orthopaedics', 'District Civil Hospital, Secunderabad', 'Orthopaedic OPD', 'Room 301', 'Morning (08:00 - 14:00)');

-- 3. Seed OPD Tokens
INSERT INTO queue_tokens (id, token_number, patient_id, patient_name, abha_number, age, gender, chief_complaint, primary_language, priority, status, assigned_room, assigned_doctor, department, turn_count, time_saved_minutes, summary_snapshot, hpi_narrative, past_history, suggested_workup)
VALUES
('token-001', 'OPD-A-042', 'pat-001', 'Rajesh Kumar Verma', '91-4523-8821-9043', 48, 'Male', 'Acid reflux and severe epigastric burning after meals for 3 weeks', 'Hindi', 'P3', 'WAITING', 'Room 204', 'Dr. Anand K. Sharma, MD', 'General Medicine', 3, 8, '48M presenting with persistent burning retrosternal discomfort. History of Type 2 Diabetes.', 'Patient reports recurrent postprandial burning sensation localized to epigastrium, aggravated by spicy food and recumbency.', 'Known Type 2 Diabetes Mellitus on Metformin 500mg BD. No known drug allergies.', 'Upper GI Endoscopy if alarm symptoms develop; Fasting Blood Sugar, HbA1c, Serum Creatinine'),
('token-002', 'P1-EMERGENCY-102', 'pat-003', 'Smt. Sunita Devi', '91-9988-1122-3344', 58, 'Female', 'Acute substernal chest heaviness radiating to left shoulder with cold diaphoresis', 'Hindi', 'P1', 'IN_CONSULTATION', 'Room 102', 'Dr. Sunita Deshmukh, MD', 'Emergency Trauma', 2, 12, 'CRITICAL P1: 58F with acute coronary syndrome presentation. Immediate triage bypass active.', 'Patient experienced sudden onset crushing chest pain 45 minutes prior to arrival, accompanied by sweating and nausea.', 'Hypertension for 8 years on Amlodipine 5mg. High cardiovascular risk profile.', 'STAT 12-Lead ECG, Serum Troponin-I / T, Bedside Echocardiography, STAT Oxygen & Aspirin');
