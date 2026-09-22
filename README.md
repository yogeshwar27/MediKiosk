# MediKiosk (मेडीकियोस्क) — AI-Powered Multilingual Clinical History & Case-Taking Kiosk

> **Smart India Hackathon (SIH) | Problem Statement: SIH26047**  
> **Domain**: MedTech / Digital Health / Ayushman Bharat Digital Mission (ABDM)  
> **Target Environment**: District Civil Hospitals, Medical Colleges & Rural Community Health Centers (CHCs/PHCs)

[![Live Public Deployment](https://img.shields.io/badge/Live_Deployment-Cloud_Run-blue?style=for-the-badge&logo=googlecloud)](https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot 3.2](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL / SQL](https://img.shields.io/badge/SQL-PostgreSQL_%7C_MySQL_%7C_JPA-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![ABDM Compliant](https://img.shields.io/badge/ABDM-FHIR_R4_Ready-138808?style=for-the-badge)](https://abdm.gov.in/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌐 Official Publication & Live Links

| Environment | Access Link | Description |
| :--- | :--- | :--- |
| 🚀 **Live Production App (Public)** | **[https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app](https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app)** | Primary public deployment hosted on Google Cloud Run with persistent backend API |
| 🛠️ **Dev Preview Instance** | [https://ais-dev-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app](https://ais-dev-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app) | Live preview environment with HMR and active debugging tools |
| 🩺 **Backend Health API** | [https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app/api/health](https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app/api/health) | Live JSON health check endpoint confirming API status |

---

## 📋 The Problem (SIH26047)

In Indian government tertiary and district hospitals:
- **Severe OPD Overcrowding**: A single doctor attends to **80 to 200+ patients per 4-hour morning OPD session**, leaving only **2–3 minutes per patient**.
- **Incomplete History Taking**: Rushed interactions lead to missed past medication records, unspotted drug-drug interactions, and overlooked red-flag symptoms.
- **Linguistic & Literacy Barriers**: Rural and migrant patients speak regional languages or have low literacy, making paper forms ineffective.
- **Delayed Emergency Detection**: Critical patients (e.g., acute myocardial infarction, severe sepsis, acute stroke) stand in long OPD lines unrecognized until their turn arrives.
- **Doctor Burnout**: Clinicians spend up to 60% of their time writing repetitive notes, demographics, and previous prescriptions rather than examining patients.

---

## 💡 The Solution: MediKiosk

**MediKiosk** is a standalone, AI-powered interactive clinical case-taking kiosk terminal deployed at hospital OPD waiting areas. It empowers patients to self-document their complaints before seeing the doctor, autonomously extracts records from old paper prescriptions, detects life-threatening red flags, and presents an instant, synthesized pre-consultation summary directly into the doctor's EMR station.

```
                      [ PATIENT ENTERS HOSPITAL OPD ]
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │        MEDIKIOSK TERMINAL (STEP 1-5)    │
                │                                         │
                │ 1. ABHA / Aadhaar / Mobile Sign-In      │
                │ 2. Vernacular Voice/Touch Case-Taking   │
                │ 3. Optical Character Recognition (OCR)  │
                │ 4. AI Clinical Synthesis & Red Flags    │
                │ 5. Smart Token Slip & Queue Dispatch    │
                └────────────────────┬────────────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
        [ NORMAL / URGENT (P2/P3) ]          [ RED-FLAG EMERGENCY (P1) ]
                     │                               │
                     ▼                               ▼
      ┌─────────────────────────────┐  ┌─────────────────────────────┐
      │   Standard OPD Queue Line   │  │ EMERGENCY FAST-TRACK BYPASS │
      │   Assigned Consultation Room│  │ Immediate Red Alarm & Audio │
      │   Doctor EMR receives notes │  │ Straight to Triage Trauma   │
      └──────────────┬──────────────┘  └─────────────┬───────────────┘
                     │                               │
                     └───────────────┬───────────────┘
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │      DOCTOR'S CONSULTATION STATION      │
                │                                         │
                │ • NMC Verified Doctor Login             │
                │ • Scan / Enter Patient Token Number     │
                │ • Instant History, Vitals & Timeline    │
                │ • Differential Diagnoses & Drug Checks  │
                │ • 1-Click Digital Rx & Patient Copy     │
                └─────────────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Vernacular Voice & Touch Interface (8 Indian Languages)
- Real-time spoken and visual intake in:
  - **Hindi (हिन्दी)**
  - **Telugu (తెలుగు)**
  - **Tamil (தமிழ்)**
  - **Bengali (বাংলা)**
  - **Marathi (मराठी)**
  - **Gujarati (ગુજરાતી)**
  - **Kannada (ಕನ್ನಡ)**
  - **English**
- Natural speech synthesis powered by phonetic prosody modulation and expanded Indian medical abbreviations (BP, ECG, OPD, ORS, ABDM).
- High-contrast visual touch cards and Senior Citizen / Assisted Mode with large 56px touch targets.

### 2. Dual Patient Authentication & ABHA Registration
- Sign in with verified **14-digit ABHA Number**, **Mobile**, or **Aadhaar Last 4 Digits**.
- Built-in **ABHA Card Registration Gate**: Allows unregistered citizens to instantly generate their digital health account with complete demographic capture and emergency contacts.
- QR code integration for instant scanner check-in.

### 3. Prescription & Lab Report OCR (Computer Vision)
- High-resolution camera capture or digital upload of previous handwritten prescriptions and lab reports.
- Extracts:
  - Document Date, Hospital & Doctor Information
  - Past Diagnoses & Chronic Conditions
  - Active Medications, Dosages, and Regimens
  - Abnormal Lab Test Values with standard reference ranges
  - Known Drug Allergies
  - Duplicate Test Warnings (e.g., prevents repeat HbA1c testing within 90 days).

### 4. Real-Time Red-Flag Emergency Triage (P1 Bypass)
- Continuous natural-language symptom screening against clinical emergency protocols (Chest Pain radiating to arm, Acute Breathlessness, Stroke Signs, Severe Abdominal Rigidity).
- Instantly triggers an audible visual alarm, bypasses standard queues, and assigns a **P1 - EMERGENCY** token routed straight to the Emergency Bay.

### 5. Doctor's EMR Consultation Station
- **NMC Credential Verification**: Secure gateway requiring official National Medical Commission or State Medical Council registration numbers.
- **Token Barcode & Number Lookup**: Doctor enters or scans token (`OPD-A-042`) to instantly retrieve the full synthesized intake, medical timeline, and past reports.
- **Pre-Generated Clinical Synthesis**:
  - Patient Snapshot & Chief Complaints
  - History of Present Illness (HPI)
  - Chronological Timeline & Past Medical History
  - Differential Diagnoses with Likelihood Scores & Clinical Reasoning
  - Suggested Diagnostic Workup
- **Digital Prescription & Discharge Writer**: One-click medication prescription, dietary recommendations, follow-up advice, and printable bilingual patient prescription slip.

### 6. Hospital Queue Management & Analytics Dashboard
- Live OPD waiting list categorized by priority (`P1 Emergency`, `P2 Urgent`, `P3 Routine`).
- Comprehensive metrics on doctor time saved per patient (~7.2 minutes), emergency detection rate, and patient throughput.

---

## 🚀 How to Run in Localhost

You can easily copy this entire repository to GitHub and run it on your local machine. Follow these instructions:

### Prerequisites
- **Node.js**: Version 18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm** (bundled with Node.js) or **yarn** / **pnpm** / **bun**
- (Optional) **Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) for live AI reasoning. If omitted, the app operates automatically using built-in rule-based fallback intelligence.

---

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/medikiosk-clinical-history-kiosk.git
cd medikiosk-clinical-history-kiosk
```

#### 2. Install Project Dependencies
```bash
npm install
```
*(or `bun install` if using Bun)*

#### 3. Set Up Environment Variables
Create a `.env` file in the root directory by copying the example:
```bash
cp .env.example .env
```

Open `.env` and add your Gemini API Key (optional):
```env
# Google Gemini API key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY="your_api_key_here"

# Port configuration (default: 3000)
APP_URL="http://localhost:3000"
```
> **Note**: Even without an API key, MediKiosk runs with zero crashes using its intelligent clinical offline fallbacks!

#### 4. Launch the Local Development Server
```bash
npm run dev
```

You should see output similar to:
```
Server running on http://localhost:3000
Vite development server ready!
```

#### 5. Open in Your Browser
Visit:
```
http://localhost:3000
```

---

### Production Build & Deployment

To compile and run MediKiosk in production mode locally:

```bash
# 1. Build frontend bundle and compile server
npm run build

# 2. Start the optimized production server
npm start
```
The server will start at `http://localhost:3000`.

---

## 🔑 Default Test Accounts & Credentials

For immediate testing on localhost or live evaluation:

### 1. Patient Portal Logins
| Name | ABHA Number | Mobile | PIN | Chief Complaint |
| :--- | :--- | :--- | :--- | :--- |
| **Rajesh Kumar Verma** | `91-4523-8821-9043` | `9876543210` | `1234` | Acid reflux, upper abdominal burning |
| **Priya Sharma** | `91-3214-7749-6712` | `9811223344` | `1234` | High fever, chills & body aches |
| **Ramesh Rao Patel** | `91-6677-2211-4589` | `9988776655` | `1234` | Chronic knee pain, osteoarthritis |

*(You can also use the **"New ABHA Registration"** tab to register any new citizen!)*

### 2. Doctor Portal Logins (NMC Verified)
| Doctor Name | NMC / State Reg No | Password | Specialty | Room |
| :--- | :--- | :--- | :--- | :--- |
| **Dr. Anand K. Sharma, MD** | `TSMC-48921` | `doctor123` | Internal Medicine | Room 204 |
| **Dr. Sunita Deshmukh, MD** | `MCI-19482` | `doctor123` | Emergency Medicine | Room 102 |
| **Dr. Rajeshwar Rao, MS** | `TSMC-39102` | `doctor123` | Orthopaedics | Room 301 |

*(You can also use the **"Doctor Registration"** tab to register your own credentials!)*

### 3. Sample Queue Tokens
- **`OPD-A-042`**: Rajesh Kumar Verma (Gastric distress & Diabetes intake pre-loaded)
- **`P1-EMERGENCY-102`**: Smt. Sunita Devi (Critical Substernal Chest Pain MI Risk)

---

## 🏗️ Architecture & Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Motion | High-speed, responsive kiosk interface with accessible touch targets |
| **Spring Boot Backend** | Java 17, Spring Boot 3.2.5, Maven (`/backend-spring-boot`) | Production Java REST API with JPA repositories, entities & controllers |
| **Relational SQL Database**| PostgreSQL / MySQL / H2 (`schema.sql` & `data.sql`) | 9 relational tables with foreign keys, indexes, and automated seeds |
| **Cloud Run Full-Stack Server** | Node.js, Express 4.x, tsx, esbuild (`server.ts`) | Single-port cloud container runtime serving Vite SPA + REST API |
| **AI Clinical Engine** | Google Gemini 2.5 Flash (`@google/genai`) | Multilingual conversational intake, prescription OCR, and HPI synthesis |
| **Voice Engine** | Web Speech Synthesis API | Native client-side speech generation with acoustic modulation |
| **Standardization** | ABDM FHIR R4 schema alignment | Seamless mapping to Indian digital health infrastructure |

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check, API key verification, and SIH problem code confirmation |
| `/api/auth/patient/login` | `POST` | Authenticate patient by ABHA ID or mobile number and PIN |
| `/api/auth/patient/register` | `POST` | Register a new patient and generate their ABHA profile |
| `/api/auth/doctor/login` | `POST` | Authenticate medical practitioner by NMC reg number & password |
| `/api/auth/doctor/register` | `POST` | Register a new doctor with specialty, room, and hospital credentials |
| `/api/chat/intake` | `POST` | Conversational clinical intake question generation in 8 languages |
| `/api/ocr/analyze` | `POST` | Gemini Vision analysis of prescription or lab images |
| `/api/summary/generate` | `POST` | Synthesize complete clinical notes, differentials, and red flags |
| `/api/queue/tokens` | `GET` | Fetch all active hospital queue tokens and clinical states |
| `/api/queue/token/:tokenNumber` | `GET` | Retrieve single patient record and pre-consultation intake by token |
| `/api/queue/token` | `POST` | Save complete patient intake when kiosk token is issued |
| `/api/doctor/prescribe` | `POST` | Save doctor's medications, tests, and clinical notes to token record |

---

## 🔒 ABDM & DPDP Act 2023 Compliance

MediKiosk is architected following India's **Digital Personal Data Protection (DPDP) Act 2023** and **National Digital Health Blueprint (NDHB)**:
1. **Explicit Consent Gate**: Patient must acknowledge the digital data consent before clinical question answering begins.
2. **Local Storage & Masking**: Sensitive Aadhaar and contact numbers are masked (e.g., `XXXX-XXXX-9043`).
3. **No Third-Party Tracking**: All Gemini API calls route securely server-side without exposing API keys to client browsers.
4. **FHIR R4 Schema**: Data structures follow international Health Level 7 (HL7) FHIR standards for easy integration with e-Hospital and Ayushman Bharat health records.

---

## 📂 Project Directory Structure

```
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore file for node_modules, build & secrets
├── index.html                    # Single-page HTML entry point with metadata
├── package.json                  # Scripts, dependencies and project definitions
├── metadata.json                 # AI Studio applet metadata & permissions
├── server.ts                     # Full-stack Express server + Gemini AI endpoints
├── tsconfig.json                 # TypeScript compiler options
├── vite.config.ts                # Vite build and Tailwind CSS v4 plugin setup
│
├── data/
│   └── medikiosk_db.json         # File-backed database for patients, doctors & tokens
│
├── server/
│   └── db.ts                     # Database schemas, CRUD repositories & seed data
│
└── src/
    ├── App.tsx                   # Main orchestrator with navigation & state
    ├── types.ts                  # Shared TypeScript interfaces & clinical schemas
    ├── main.tsx                  # React DOM root entry point
    │
    ├── components/
    │   ├── Sidebar.tsx           # Navigation sidebar with public URL & emergency test
    │   │
    │   ├── KioskTerminal/        # Patient Kiosk 5-Step Workflow
    │   │   ├── AbhaLoginStep.tsx               # Step 1: Login & Registration
    │   │   ├── VoiceTouchInterviewStep.tsx     # Step 2: Multilingual Intake
    │   │   ├── DocumentScanStep.tsx            # Step 3: Prescription & Lab OCR
    │   │   ├── ClinicalSynthesisSummaryStep.tsx# Step 4: AI Summary & Triage
    │   │   └── KioskCompletionStep.tsx         # Step 5: Printed Token Slip
    │   │
    │   ├── DoctorPortal/         # Doctor Consultation Station (EMR)
    │   │   ├── DoctorAuthGate.tsx              # NMC Verification & Registration
    │   │   ├── DoctorConsultationView.tsx      # Pre-visit notes & token scanner
    │   │   └── PatientPrescriptionModal.tsx    # Digital Rx & Printable Slip
    │   │
    │   ├── Triage/               # Live OPD & Emergency Monitoring
    │   │   └── OpdQueueManager.tsx             # Real-time queue status & triage
    │   │
    │   ├── Analytics/            # Hospital Velocity & Impact Metrics
    │   │   └── ClinicalImpactPage.tsx          # Time saved & bottleneck charts
    │   │
    │   └── Settings/             # Hardware & Speech Configuration
    │       └── HospitalConfigPage.tsx          # Terminal identity & voice testing
    │
    ├── data/
    │   └── mockPatients.ts       # Clinical presets & simulated medical records
    │
    └── services/
        └── languageService.ts    # Web Speech API, acoustic tuning & translations
```

---

## 👥 Hackathon Team & Acknowledgements

- **Smart India Hackathon (SIH)** — Problem Statement Code: **SIH26047**
- Developed with **Google AI Studio** and **Gemini 2.5 Flash**
- Built for government hospitals, district civil hospitals, and primary health centers across India.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
