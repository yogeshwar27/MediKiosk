import fs from 'fs';
import path from 'path';

export interface StoredPatient {
  id: string;
  abhaNumber: string;
  abhaAddress: string;
  aadhaarLastFour: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  pin: string;
  bloodGroup: string;
  state: string;
  city: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  createdAt: string;
}

export interface StoredDoctor {
  id: string;
  fullName: string;
  regNumber: string; // NMC / State Council Reg No
  email: string;
  password: string;
  specialty: string;
  hospitalName: string;
  department: string;
  roomNumber: string;
  dutyShift: string;
  createdAt: string;
}

export interface StoredTokenSummary {
  snapshot: string;
  hpi: string;
  pastHistory?: string;
  differentials?: Array<{ condition: string; likelihood: string; reasoning: string }>;
  redFlags?: Array<{ flag: string; risk: string; status: string }>;
  activeMedications?: Array<{ drug: string; frequency: string; compliance: string }>;
  labResults?: Array<{ testName: string; value: string; normalRange: string; isAbnormal: boolean }>;
  suggestedWorkup?: string[];
  timeSavedMinutes?: number;
  fhirBundleSnippet?: any;
}

export interface StoredPrescription {
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    mealTiming: string;
    duration: string;
    instructions: string;
    category?: string;
  }>;
  clinicalSuggestions: string[];
  orderedInvestigations: string[];
  dietaryAdvice: string;
  followUpAdvice: string;
  doctorNotes: string;
  prescribedAt: string;
  doctorName: string;
  doctorRegNumber: string;
}

export interface StoredQueueToken {
  tokenNumber: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  abhaNumber: string;
  mobile: string;
  bloodGroup: string;
  chiefComplaint: string;
  triagePriority: 'P1 - EMERGENCY' | 'P2 - URGENT' | 'P3 - ROUTINE';
  status: 'Waiting' | 'In Consultation' | 'Prescription Issued' | 'Completed';
  intakeTime: string;
  createdAt: string;
  emergencyAlert: boolean;
  emergencyReason?: string;
  opdDepartment: string;
  consultationRoom: string;
  interviewMessages: any[];
  scannedDocs: any[];
  clinicalSummary: StoredTokenSummary;
  prescription?: StoredPrescription;
}

export interface DatabaseSchema {
  patients: StoredPatient[];
  doctors: StoredDoctor[];
  tokens: StoredQueueToken[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'medikiosk_db.json');

// Initial database seed for real hospital testing
const INITIAL_DB: DatabaseSchema = {
  patients: [
    {
      id: 'PAT-9043',
      abhaNumber: '91-4523-8821-9043',
      abhaAddress: 'rajesh.kumar@abdm',
      aadhaarLastFour: '9043',
      fullName: 'Rajesh Kumar Verma',
      age: 52,
      gender: 'Male',
      mobile: '9876543210',
      pin: '1234',
      bloodGroup: 'B+',
      state: 'Delhi',
      city: 'New Delhi',
      emergencyContact: {
        name: 'Sunita Verma',
        relation: 'Spouse',
        phone: '9876543211',
      },
      createdAt: '2026-03-01T08:00:00.000Z',
    },
    {
      id: 'PAT-6712',
      abhaNumber: '91-3214-7749-6712',
      abhaAddress: 'priya.sharma@abdm',
      aadhaarLastFour: '6712',
      fullName: 'Priya Sharma',
      age: 29,
      gender: 'Female',
      mobile: '9811223344',
      pin: '1234',
      bloodGroup: 'O+',
      state: 'Telangana',
      city: 'Hyderabad',
      emergencyContact: {
        name: 'Ramesh Sharma',
        relation: 'Father',
        phone: '9811223355',
      },
      createdAt: '2026-03-02T09:30:00.000Z',
    },
  ],
  doctors: [
    {
      id: 'DOC-88421',
      fullName: 'Dr. Arvind Sharma, MD',
      regNumber: 'NMC-2018-88421',
      email: 'arvind.sharma@aiims.edu.in',
      password: 'doctorpassword',
      specialty: 'Internal Medicine & Gastroenterology',
      hospitalName: 'AIIMS New Delhi / OPD Block',
      department: 'General Medicine & Acute Care',
      roomNumber: 'Room 204',
      dutyShift: 'Morning OPD (08:00 - 14:00)',
      createdAt: '2026-01-15T00:00:00.000Z',
    },
    {
      id: 'DOC-99104',
      fullName: 'Dr. Radhika Sen, MD',
      regNumber: 'NMC-2020-99104',
      email: 'radhika.sen@aiims.edu.in',
      password: 'doctorpassword',
      specialty: 'Emergency Medicine & Triage Specialist',
      hospitalName: 'AIIMS New Delhi / Emergency Block',
      department: 'Emergency Resuscitation Unit',
      roomNumber: 'Emergency Room 102',
      dutyShift: 'Emergency Triage Shift',
      createdAt: '2026-01-15T00:00:00.000Z',
    }
  ],
  tokens: [
    {
      tokenNumber: 'OPD-A-042',
      patientId: 'PAT-9043',
      patientName: 'Rajesh Kumar Verma',
      age: 52,
      gender: 'Male',
      abhaNumber: '91-4523-8821-9043',
      mobile: '9876543210',
      bloodGroup: 'B+',
      chiefComplaint: 'Severe upper abdominal burning pain after eating with acidity for 3 days',
      triagePriority: 'P2 - URGENT',
      status: 'Waiting',
      intakeTime: '09:15 AM IST',
      createdAt: new Date().toISOString(),
      emergencyAlert: false,
      opdDepartment: 'General Medicine & Gastroenterology',
      consultationRoom: 'Room 204',
      interviewMessages: [
        {
          id: 'msg-1',
          sender: 'assistant',
          text: 'Namaste Rajesh Kumar Verma. What primary problem or health discomfort brings you to the hospital today?',
          timestamp: '09:12 AM',
        },
        {
          id: 'msg-2',
          sender: 'user',
          text: 'Severe upper abdominal burning pain after eating for the last 3 days',
          timestamp: '09:13 AM',
        },
        {
          id: 'msg-3',
          sender: 'assistant',
          text: 'How would you describe the discomfort? Is it sharp, burning, or cramping?',
          timestamp: '09:13 AM',
        },
        {
          id: 'msg-4',
          sender: 'user',
          text: 'It is a continuous burning sensation with acid reflux and nausea',
          timestamp: '09:14 AM',
        }
      ],
      scannedDocs: [
        {
          id: 'doc-seed-1',
          title: 'OPD Prescription - AIIMS Delhi',
          documentDate: '2025-08-14',
          hospitalName: 'AIIMS New Delhi',
          doctorName: 'Dr. A. Sharma (MD)',
          diagnoses: ['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Mild Gastritis'],
          medications: [
            { name: 'Metformin 500mg', dose: '1 Tab', frequency: '1-0-1', duration: '90 days' },
            { name: 'Telmisartan 40mg', dose: '1 Tab', frequency: '1-0-0', duration: '90 days' }
          ],
          labResults: [
            { testName: 'HbA1c', value: '7.8%', normalRange: '< 5.7%', isAbnormal: true },
            { testName: 'Fasting Blood Sugar', value: '142 mg/dL', normalRange: '70-99 mg/dL', isAbnormal: true }
          ],
          allergies: ['Penicillin - Mild skin rash'],
          repeatedTestWarning: 'HbA1c was recorded within 3 months (7.8%). Routine re-ordering avoided.',
        }
      ],
      clinicalSummary: {
        snapshot: 'Rajesh Kumar Verma, 52Y/M with known T2DM and Hypertension, presenting with acute-on-chronic epigastric burning pain radiating to back for 3 days.',
        hpi: 'Patient reports progressive retrosternal burning and epigastric discomfort aggravated post-prandially and when lying down. Accompanied by nausea, no hematemesis or melena. Subjective pain score 7/10.',
        pastHistory: 'History of T2DM (HbA1c 7.8%) and Hypertension on Metformin & Telmisartan. Known Penicillin allergy.',
        differentials: [
          { condition: 'Acute Erosive Gastritis / Peptic Ulcer Disease', likelihood: 'High', reasoning: 'Matches postprandial epigastric burning and antacid relief.' },
          { condition: 'Gastroesophageal Reflux Disease (GERD)', likelihood: 'Moderate', reasoning: 'Retrosternal pyrosis worsening in recumbent posture.' },
          { condition: 'Atypical Angina / Inferior Wall Ischemia', likelihood: 'Low-Moderate (Rule out)', reasoning: 'Diabetic patient with epigastric discomfort requires ECG baseline.' }
        ],
        redFlags: [
          { flag: 'High Blood Sugar History (HbA1c 7.8%)', risk: 'Diabetic Comorbidity', status: 'Controlled' }
        ],
        activeMedications: [
          { drug: 'Metformin 500mg', frequency: '1-0-1', compliance: 'Good' },
          { drug: 'Telmisartan 40mg', frequency: '1-0-0', compliance: 'Good' }
        ],
        suggestedWorkup: [
          '12-Lead Electrocardiogram (ECG)',
          'Complete Blood Count (CBC)',
          'Upper Abdominal Ultrasound'
        ],
        timeSavedMinutes: 14,
      }
    }
  ]
};

// Ensure data directory and DB file exist
export function initDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('[DB] Failed to load database file, initializing defaults:', err);
    return INITIAL_DB;
  }
}

export function saveDatabase(data: DatabaseSchema): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DB] Failed to save database file:', err);
    return false;
  }
}

// ---------------- PATIENT REPOSITORY ----------------
export function getPatients(): StoredPatient[] {
  const db = initDatabase();
  return db.patients || [];
}

export function findPatient(identifier: string): StoredPatient | undefined {
  const db = initDatabase();
  const cleanId = identifier.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return db.patients.find(p => {
    const abhaClean = p.abhaNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    const mobileClean = p.mobile.replace(/\D/g, '');
    const idClean = p.id.toLowerCase();
    const aadhaarClean = p.aadhaarLastFour;
    return (
      abhaClean === cleanId ||
      mobileClean === cleanId ||
      idClean === cleanId ||
      aadhaarClean === cleanId ||
      p.abhaAddress.toLowerCase() === identifier.trim().toLowerCase()
    );
  });
}

export function createPatient(patientData: Omit<StoredPatient, 'id' | 'createdAt'>): StoredPatient {
  const db = initDatabase();
  const newPatient: StoredPatient = {
    ...patientData,
    id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  // Check if patient already exists by ABHA or mobile
  const existingIdx = db.patients.findIndex(
    p => p.abhaNumber === patientData.abhaNumber || (p.mobile && p.mobile === patientData.mobile)
  );

  if (existingIdx >= 0) {
    // Update existing
    db.patients[existingIdx] = {
      ...db.patients[existingIdx],
      ...newPatient,
      id: db.patients[existingIdx].id,
      createdAt: db.patients[existingIdx].createdAt,
    };
    saveDatabase(db);
    return db.patients[existingIdx];
  }

  db.patients.unshift(newPatient);
  saveDatabase(db);
  return newPatient;
}

// ---------------- DOCTOR REPOSITORY ----------------
export function getDoctors(): StoredDoctor[] {
  const db = initDatabase();
  return db.doctors || [];
}

export function findDoctor(identifier: string): StoredDoctor | undefined {
  const db = initDatabase();
  const clean = identifier.trim().toLowerCase();
  return db.doctors.find(d => {
    return (
      d.regNumber.toLowerCase() === clean ||
      d.email.toLowerCase() === clean ||
      d.id.toLowerCase() === clean
    );
  });
}

export function createDoctor(doctorData: Omit<StoredDoctor, 'id' | 'createdAt'>): StoredDoctor {
  const db = initDatabase();
  const newDoctor: StoredDoctor = {
    ...doctorData,
    id: `DOC-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
  };

  const existingIdx = db.doctors.findIndex(
    d => d.regNumber.toLowerCase() === doctorData.regNumber.toLowerCase() || d.email.toLowerCase() === doctorData.email.toLowerCase()
  );

  if (existingIdx >= 0) {
    db.doctors[existingIdx] = {
      ...db.doctors[existingIdx],
      ...newDoctor,
      id: db.doctors[existingIdx].id,
      createdAt: db.doctors[existingIdx].createdAt,
    };
    saveDatabase(db);
    return db.doctors[existingIdx];
  }

  db.doctors.unshift(newDoctor);
  saveDatabase(db);
  return newDoctor;
}

// ---------------- QUEUE & TOKEN REPOSITORY ----------------
export function getAllTokens(): StoredQueueToken[] {
  const db = initDatabase();
  return db.tokens || [];
}

export function findToken(tokenNumber: string): StoredQueueToken | undefined {
  const db = initDatabase();
  const clean = tokenNumber.trim().toUpperCase();
  return db.tokens.find(t => t.tokenNumber.toUpperCase() === clean);
}

export function saveTokenRecord(tokenRecord: StoredQueueToken): StoredQueueToken {
  const db = initDatabase();
  const existingIdx = db.tokens.findIndex(
    t => t.tokenNumber.toUpperCase() === tokenRecord.tokenNumber.toUpperCase()
  );

  if (existingIdx >= 0) {
    db.tokens[existingIdx] = {
      ...db.tokens[existingIdx],
      ...tokenRecord,
    };
  } else {
    db.tokens.unshift(tokenRecord);
  }

  saveDatabase(db);
  return tokenRecord;
}

export function saveDoctorPrescription(
  tokenNumber: string,
  prescription: StoredPrescription
): StoredQueueToken | null {
  const db = initDatabase();
  const existingIdx = db.tokens.findIndex(
    t => t.tokenNumber.toUpperCase() === tokenNumber.trim().toUpperCase()
  );

  if (existingIdx < 0) return null;

  db.tokens[existingIdx].prescription = prescription;
  db.tokens[existingIdx].status = 'Prescription Issued';
  saveDatabase(db);
  return db.tokens[existingIdx];
}

export function getTokensByPatient(patientIdentifier: string): StoredQueueToken[] {
  const db = initDatabase();
  const clean = patientIdentifier.trim().toLowerCase().replace(/[\s-]/g, '');
  return db.tokens.filter(t => {
    const pId = (t.patientId || '').toLowerCase().replace(/[\s-]/g, '');
    const abha = (t.abhaNumber || '').toLowerCase().replace(/[\s-]/g, '');
    const mob = (t.mobile || '').replace(/[\s-]/g, '');
    return pId === clean || abha === clean || mob === clean;
  });
}

