export type AppMode = 
  | 'kiosk'
  | 'doctor'
  | 'triage';

export type SupportedLanguage = 
  | 'en'
  | 'hi'
  | 'te'
  | 'ta'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'kn';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeLabel: string;
  greeting: string;
  speechCode: string;
}

export interface PatientProfile {
  id: string;
  abhaNumber: string; // e.g. "91-4523-8821-9043"
  abhaAddress: string; // e.g. "rajesh.kumar@abdm"
  aadhaarLastFour: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  bloodGroup: string;
  state: string;
  city: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  consentGiven?: boolean;
  consentTimestamp?: string;
  dpdpConsentVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user' | 'system';
  text: string;
  vernacularText?: string;
  timestamp: string;
  quickChips?: string[];
  isEmergencyAlert?: boolean;
  emergencyDetails?: {
    severity: string;
    reason: string;
    action: string;
  };
}

export interface ScannedMedication {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
}

export interface ScannedLabTest {
  testName: string;
  value: string;
  normalRange: string;
  isAbnormal: boolean;
}

export interface ScannedDocument {
  id: string;
  title: string;
  documentDate: string;
  hospitalName: string;
  doctorName: string;
  documentType: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Radiology / ECG' | 'Other';
  diagnoses: string[];
  medications: ScannedMedication[];
  labResults: ScannedLabTest[];
  allergies?: string[];
  chronologicalNote: string;
  repeatedTestWarning?: string;
  imageUrl?: string;
  source: 'uploaded' | 'sample' | 'abdm-repo';
}

export interface DoctorClinicalSummary {
  snapshot: string;
  hpi: string;
  pastHistory: string;
  activeMedications: {
    drug: string;
    frequency: string;
    compliance: string;
  }[];
  chronologicalTimeline: {
    date: string;
    event: string;
  }[];
  redFlags: {
    flag: string;
    risk: string;
    status: string;
  }[];
  differentials: {
    condition: string;
    likelihood: string;
    reasoning: string;
  }[];
  suggestedWorkup: string[];
  timeSavedMinutes: number;
  fhirBundleSnippet?: any;
}

export interface PrescribedMedicine {
  id: string;
  drugName: string;
  dosage: string; // e.g. "500 mg", "40 mg"
  frequency: string; // "1-0-1", "1-0-0", "0-0-1", "1-1-1", "SOS"
  duration: string; // e.g. "5 days", "7 days"
  mealTiming: string; // "After Food (भोजन के बाद)" | "Before Food (भोजन से पहले)"
  instructions?: string;
  category?: 'Antibiotic' | 'Analgesic' | 'Antacid' | 'Antidiabetic' | 'Antihypertensive' | 'General';
}

export interface DoctorPrescriptionSlip {
  rxNumber: string;
  tokenNumber: string;
  date: string;
  time: string;
  doctorName: string;
  doctorDepartment: string;
  doctorRegNo: string;
  hospitalName: string;
  patient: PatientProfile;
  provisionalDiagnosis: string;
  chiefComplaints: string;
  medications: PrescribedMedicine[];
  clinicalSuggestions: string[];
  orderedInvestigations: string[];
  dietaryLifestyleAdvice: string;
  followUpAdvice: string;
  qrCode: string;
  abdmSyncStatus: 'synced' | 'pending';
}

export interface QueueEntry {
  tokenNumber: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  abhaId: string;
  chiefComplaint: string;
  triagePriority: 'P1 - EMERGENCY' | 'P2 - URGENT' | 'P3 - ROUTINE';
  status: 'Waiting' | 'In Consultation' | 'Completed' | 'Triage Fast-Track';
  intakeTime: string;
  emergencyAlert: boolean;
  emergencyReason?: string;
  opdDepartment: string;
  consultationRoom: string;
}

