import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  FlaskConical, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Printer, 
  Send,
  Download, 
  Share2, 
  ChevronRight, 
  TrendingDown, 
  Info,
  QrCode,
  Scan,
  Search,
  Plus,
  Trash2,
  Calendar,
  MessageSquare,
  Volume2,
  Check,
  X,
  Camera,
  Sun,
  Moon,
  Utensils,
  LogOut
} from 'lucide-react';
import { 
  PatientProfile, 
  ChatMessage, 
  ScannedDocument, 
  DoctorClinicalSummary,
  QueueEntry,
  PrescribedMedicine,
  DoctorPrescriptionSlip
} from '../../types';
import { PatientPrescriptionModal } from './PatientPrescriptionModal';
import { DoctorProfile } from './DoctorAuthGate';

interface DoctorConsultationViewProps {
  doctorProfile?: DoctorProfile;
  onLogout?: () => void;
  patient: PatientProfile;
  interviewMessages: ChatMessage[];
  scannedDocs: ScannedDocument[];
  isEmergency: boolean;
  emergencyReason?: string;
  initialToken?: string;
  currentQueue?: QueueEntry[];
  onSelectPatientFromQueue?: (entry: QueueEntry) => void;
  onRefreshSummary?: () => void;
}

// Popular Indian OPD Medications Quick-Pick
const POPULAR_OPD_DRUGS = [
  { name: 'Tab Pantoprazole 40mg', dose: '1 Tab', freq: '1-0-0', timing: 'Before Food (भोजन से पहले)', duration: '7 days', category: 'Antacid' as const },
  { name: 'Tab Paracetamol 650mg', dose: '1 Tab', freq: '1-0-1', timing: 'After Food (भोजन के बाद)', duration: '5 days', category: 'Analgesic' as const },
  { name: 'Tab Amoxicillin-Clav 625mg', dose: '1 Tab', freq: '1-0-1', timing: 'After Food (भोजन के बाद)', duration: '5 days', category: 'Antibiotic' as const },
  { name: 'Tab Metformin 500mg', dose: '1 Tab', freq: '1-0-1', timing: 'With Food (भोजन के साथ)', duration: '30 days', category: 'Antidiabetic' as const },
  { name: 'Tab Telmisartan 40mg', dose: '1 Tab', freq: '1-0-0', timing: 'After Food (भोजन के बाद)', duration: '30 days', category: 'Antihypertensive' as const },
  { name: 'Tab Ondansetron 4mg', dose: '1 Tab', freq: 'SOS', timing: 'Before Food (भोजन से पहले)', duration: '3 days', category: 'General' as const },
  { name: 'Tab Cetirizine 10mg', dose: '1 Tab', freq: '0-0-1', timing: 'At Bedtime (रात को सोते समय)', duration: '5 days', category: 'General' as const },
  { name: 'ORS Sachet', dose: '1 Sachet', freq: 'SOS', timing: 'With Water (पानी के साथ)', duration: '3 days', category: 'General' as const },
  { name: 'Syrup Sucralfate 10ml', dose: '10 ml', freq: '1-1-1', timing: 'Before Food (भोजन से पहले)', duration: '7 days', category: 'Antacid' as const },
];

export const DoctorConsultationView: React.FC<DoctorConsultationViewProps> = ({
  doctorProfile,
  onLogout,
  patient,
  interviewMessages,
  scannedDocs,
  isEmergency,
  emergencyReason,
  initialToken = 'OPD-A-042',
  currentQueue = [],
  onSelectPatientFromQueue,
  onRefreshSummary,
}) => {
  const [tokenSearch, setTokenSearch] = useState(initialToken);
  const [activeToken, setActiveToken] = useState(initialToken);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerSuccessNotice, setScannerSuccessNotice] = useState<string | null>(null);
  const [dbTokens, setDbTokens] = useState<any[]>([]);

  // Fetch live queue tokens from persistent database
  useEffect(() => {
    fetch('/api/queue/tokens')
      .then((r) => r.json())
      .then((data) => {
        if (data?.tokens && Array.isArray(data.tokens)) {
          setDbTokens(data.tokens);
        }
      })
      .catch((e) => console.warn('Could not load queue tokens from database', e));
  }, [activeToken]);

  // Summary State
  const [summary, setSummary] = useState<DoctorClinicalSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'clinical' | 'timeline' | 'chat' | 'fhir'>('clinical');

  // Doctor Clinical Orders & Prescription Builder
  const [prescribedMedications, setPrescribedMedications] = useState<PrescribedMedicine[]>([
    {
      id: 'med-1',
      drugName: 'Tab Pantoprazole 40mg',
      dosage: '1 Tab',
      frequency: '1-0-0',
      duration: '7 days',
      mealTiming: 'Before Food (भोजन से पहले)',
      instructions: 'Take 30 mins before morning breakfast with warm water',
      category: 'Antacid',
    },
    {
      id: 'med-2',
      drugName: 'Tab Paracetamol 650mg',
      dosage: '1 Tab',
      frequency: '1-0-1',
      duration: '3 days',
      mealTiming: 'After Food (भोजन के बाद)',
      instructions: 'Take after meals for fever/pain relief; discontinue when pain subsides',
      category: 'Analgesic',
    },
    {
      id: 'med-3',
      drugName: 'Syrup Sucralfate 10ml',
      dosage: '10 ml',
      frequency: '1-1-1',
      duration: '5 days',
      mealTiming: 'Before Food (भोजन से पहले)',
      instructions: 'Take 1 hour before meals to coat mucosal lining',
      category: 'Antacid',
    }
  ]);

  // Form states for adding custom drug
  const [customDrugName, setCustomDrugName] = useState('');
  const [customDosage, setCustomDosage] = useState('1 Tab');
  const [customFreq, setCustomFreq] = useState('1-0-1');
  const [customTiming, setCustomTiming] = useState('After Food (भोजन के बाद)');
  const [customDuration, setCustomDuration] = useState('5 days');
  const [customInstructions, setCustomInstructions] = useState('');

  // Suggestions & Advice
  const [clinicalSuggestions, setClinicalSuggestions] = useState<string[]>([
    'Maintain light, bland khichdi or soft porridge diet for 3 days',
    'Avoid spicy, deep-fried, oily food and caffeine',
    'Drink at least 2.5 to 3 liters of boiled, cooled water daily',
    'Do not lie down immediately after meals; keep head elevated'
  ]);
  const [newSuggestionInput, setNewSuggestionInput] = useState('');

  const [orderedInvestigations, setOrderedInvestigations] = useState<string[]>([
    'Ultrasound Whole Abdomen (Routine)',
    'Complete Blood Picture (CBC)'
  ]);

  const [dietaryAdvice, setDietaryAdvice] = useState('Soft khichdi, curd rice, coconut water. Strictly avoid red chili and sour foods.');
  const [followUpAdvice, setFollowUpAdvice] = useState('Review in General Medicine OPD Room 204 after 5 days with ultrasound report, or report to Emergency Room 102 if severe pain recurs.');
  const [doctorNotes, setDoctorNotes] = useState('Patient examined at OPD station. Abdominal soft, epigastric tenderness present without guarding or rebound. Vitals stable. Prescribed mucosal protectant and antacid.');

  // Patient Prescription Copy Modal
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, [patient, interviewMessages, scannedDocs]);

  // Sync token search with prop changes
  useEffect(() => {
    if (initialToken) {
      setTokenSearch(initialToken);
      setActiveToken(initialToken);
    }
  }, [initialToken]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/clinical-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientProfile: patient,
          interviewDialogue: interviewMessages,
          pastRecords: scannedDocs,
        }),
      });
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setSummary({
        snapshot: `${patient.age}Y / ${patient.gender} (${patient.fullName}) presenting with chief complaints captured at MediKiosk. Triage status: ${isEmergency ? 'P1 Emergency' : 'P3 Routine'}.`,
        hpi: 'Patient completed adaptive clinical intake at kiosk. Reported symptoms evaluated and cross-checked against chronological history from linked ABHA profile.',
        pastHistory: 'Known history of Hypertension and Dyslipidemia. Previous prescriptions available in chronological timeline.',
        activeMedications: [
          { drug: 'Telmisartan 40mg', frequency: '1-0-0', compliance: 'Regular' },
          { drug: 'Metformin 500mg', frequency: '1-0-1', compliance: 'Irregular' },
        ],
        chronologicalTimeline: scannedDocs.map(d => ({
          date: d.documentDate,
          event: `${d.title} (${d.hospitalName}): ${d.diagnoses.join(', ')}`,
        })),
        redFlags: isEmergency ? [
          { flag: emergencyReason || 'Acute Red Flag', risk: 'Immediate intervention required', status: 'Active Watch' }
        ] : [],
        differentials: [
          { condition: 'Acute Gastritis / Acid Peptic Disease', likelihood: 'High', reasoning: 'Burning epigastric discomfort triggered post-meal with nausea.' },
          { condition: 'Gastroesophageal Reflux Disease (GERD)', likelihood: 'Moderate', reasoning: 'Retrosternal burning after lying down.' },
          { condition: 'Biliary Colic', likelihood: 'Low-Moderate', reasoning: 'Advise ultrasound whole abdomen to rule out cholelithiasis.' }
        ],
        suggestedWorkup: [
          'Ultrasound Whole Abdomen (fasting)',
          'Complete Blood Count (CBC) and Liver Function Test'
        ],
        timeSavedMinutes: 7.4,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Token Scanning / Input
  const handleScanToken = async (tokenToScan: string) => {
    const cleanToken = tokenToScan.trim().toUpperCase();
    setActiveToken(cleanToken);
    setTokenSearch(cleanToken);
    setIsScannerOpen(false);

    try {
      const res = await fetch(`/api/queue/token/${encodeURIComponent(cleanToken)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.token) {
          const t = data.token;
          setScannerSuccessNotice(`Token ${cleanToken} (${t.patientName}) retrieved from hospital database.`);
          
          if (t.clinicalSummary) {
            setSummary(prev => ({
              snapshot: t.clinicalSummary.snapshot || prev?.snapshot || `${t.patientName}, ${t.age}y ${t.gender}`,
              hpi: t.clinicalSummary.hpi || t.chiefComplaint || prev?.hpi || 'Clinical intake completed at MediKiosk',
              pastHistory: t.clinicalSummary.pastHistory || prev?.pastHistory || 'Nil major previous chronic illness documented',
              activeMedications: t.clinicalSummary.activeMedications || prev?.activeMedications || [],
              chronologicalTimeline: t.clinicalSummary.chronologicalTimeline || prev?.chronologicalTimeline || [
                { date: 'Today', event: 'Patient completed digital intake kiosk session' }
              ],
              redFlags: t.clinicalSummary.redFlags || (t.emergencyAlert ? [{ flag: 'Acute Priority Triage Triggered', risk: 'High', status: 'Immediate Attention' }] : (prev?.redFlags || [])),
              differentials: t.clinicalSummary.differentials || prev?.differentials || [
                { condition: t.chiefComplaint || 'Acute OPD Evaluation', likelihood: 'High', reasoning: 'Symptoms reported at kiosk terminal' }
              ],
              suggestedWorkup: t.clinicalSummary.suggestedWorkup || prev?.suggestedWorkup || ['Routine OPD Vitals & Examination'],
              timeSavedMinutes: 7.2,
            }));
          }

          if (t.doctorPrescription?.medicines?.length) {
            setPrescribedMedications(t.doctorPrescription.medicines);
          }
          if (t.doctorPrescription?.clinicalSuggestions?.length) {
            setClinicalSuggestions(t.doctorPrescription.clinicalSuggestions);
          }
          if (t.doctorPrescription?.orderedInvestigations?.length) {
            setOrderedInvestigations(t.doctorPrescription.orderedInvestigations);
          }
          if (t.doctorPrescription?.dietaryAdvice) {
            setDietaryAdvice(t.doctorPrescription.dietaryAdvice);
          }
          if (t.doctorPrescription?.followUpAdvice) {
            setFollowUpAdvice(t.doctorPrescription.followUpAdvice);
          }
          if (t.doctorPrescription?.doctorNotes) {
            setDoctorNotes(t.doctorPrescription.doctorNotes);
          }
        }
      } else {
        setScannerSuccessNotice(`Token ${cleanToken} loaded from active OPD station.`);
      }
    } catch (e) {
      console.warn('Error fetching token details from database:', e);
      setScannerSuccessNotice(`Token ${cleanToken} loaded.`);
    }

    setTimeout(() => setScannerSuccessNotice(null), 4000);

    // If matches a queue entry, inform parent
    if (onSelectPatientFromQueue && currentQueue.length > 0) {
      const match = currentQueue.find(q => q.tokenNumber.toLowerCase() === cleanToken.toLowerCase());
      if (match) {
        onSelectPatientFromQueue(match);
      }
    }
  };

  // Add Popular Drug Shortcut
  const handleAddPopularDrug = (drug: typeof POPULAR_OPD_DRUGS[0]) => {
    const newMed: PrescribedMedicine = {
      id: `med-${Date.now()}`,
      drugName: drug.name,
      dosage: drug.dose,
      frequency: drug.freq,
      duration: drug.duration,
      mealTiming: drug.timing,
      instructions: `Take as directed for ${drug.category}`,
      category: drug.category,
    };
    setPrescribedMedications(prev => [...prev, newMed]);
  };

  // Add Custom Drug from form
  const handleAddCustomDrug = () => {
    if (!customDrugName.trim()) return;
    const newMed: PrescribedMedicine = {
      id: `med-${Date.now()}`,
      drugName: customDrugName.trim(),
      dosage: customDosage.trim(),
      frequency: customFreq,
      duration: customDuration.trim(),
      mealTiming: customTiming,
      instructions: customInstructions.trim() || undefined,
      category: 'General',
    };
    setPrescribedMedications(prev => [...prev, newMed]);
    setCustomDrugName('');
    setCustomInstructions('');
  };

  const handleRemoveDrug = (id: string) => {
    setPrescribedMedications(prev => prev.filter(m => m.id !== id));
  };

  // Add Clinical Suggestion
  const handleAddSuggestion = () => {
    if (!newSuggestionInput.trim()) return;
    setClinicalSuggestions(prev => [...prev, newSuggestionInput.trim()]);
    setNewSuggestionInput('');
  };

  // Toggle Investigation
  const handleToggleInvestigation = (test: string) => {
    if (orderedInvestigations.includes(test)) {
      setOrderedInvestigations(prev => prev.filter(t => t !== test));
    } else {
      setOrderedInvestigations(prev => [...prev, test]);
    }
  };

  // Build Final Prescription Slip Object
  const prescriptionSlipData: DoctorPrescriptionSlip = {
    rxNumber: `RX-OPD-${Math.floor(100000 + Math.random() * 900000)}`,
    tokenNumber: activeToken,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    doctorName: doctorProfile?.fullName || 'Dr. Anand K. Sharma, MD',
    doctorDepartment: doctorProfile?.department || (isEmergency ? 'Emergency Medicine & Trauma' : 'Internal & General Medicine'),
    doctorRegNo: doctorProfile?.regNumber || 'TSMC-48921',
    hospitalName: doctorProfile?.hospitalName || 'District Civil Hospital & Medical College, Hyderabad',
    patient: patient,
    provisionalDiagnosis: summary?.differentials?.[0]?.condition || 'Acute Gastritis / Acid Peptic Disease',
    chiefComplaints: interviewMessages.find(m => m.sender === 'user')?.text || 'Severe stomach burning & discomfort after meals',
    medications: prescribedMedications,
    clinicalSuggestions: clinicalSuggestions,
    orderedInvestigations: orderedInvestigations,
    dietaryLifestyleAdvice: dietaryAdvice,
    followUpAdvice: followUpAdvice,
    qrCode: `ABDM-RX-${activeToken}`,
    abdmSyncStatus: 'synced',
  };

  const handleIssuePrescription = async () => {
    setIsPrescriptionModalOpen(true);
    try {
      await fetch('/api/doctor/prescribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenNumber: activeToken,
          medicines: prescribedMedications,
          clinicalSuggestions,
          orderedInvestigations,
          dietaryAdvice,
          followUpAdvice,
          doctorNotes,
          doctorName: doctorProfile?.fullName || 'Dr. Anand K. Sharma, MD',
          doctorRegNumber: doctorProfile?.regNumber || 'TSMC-48921'
        })
      });
      setScannerSuccessNotice(`Prescription saved to hospital database for Token ${activeToken}.`);
      setTimeout(() => setScannerSuccessNotice(null), 3000);
    } catch (e) {
      console.warn('Could not persist prescription to server:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 0. VERIFIED DOCTOR PROFILE & NMC CREDENTIALS BANNER */}
      {doctorProfile && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-md border border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200 font-bold text-base shrink-0">
              Dr
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg">{doctorProfile.fullName}</span>
                <span className="text-[11px] font-mono bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full font-bold">
                  {doctorProfile.regNumber}
                </span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                  OPD Duty Active
                </span>
              </div>
              <div className="text-xs text-blue-200/90 mt-0.5">
                {doctorProfile.specialty} • {doctorProfile.hospitalName} • <span className="text-white font-semibold">{doctorProfile.roomNumber}</span> ({doctorProfile.dutyShift})
              </div>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white hover:text-red-200 border border-white/20 hover:border-red-400/40 text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Doctor Sign Out</span>
            </button>
          )}
        </div>
      )}

      {/* 1. TOP TOKEN SCANNER & LIVE QUEUE BAR */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-blue-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  Doctor Consultation & Token Intake Scanner
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  EMR Station
                </span>
                {isEmergency && (
                  <span className="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                    🚨 P1 EMERGENCY
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Scan patient token barcode/QR to instantly pull synthesized history, prior records & write prescription
              </p>
            </div>
          </div>

          {/* Right Token Input & Barcode Scan Trigger */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScanToken(tokenSearch)}
                placeholder="Enter Token e.g. OPD-A-042"
                className="w-48 sm:w-56 text-xs font-mono font-bold uppercase tracking-wider pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            </div>

            <button
              onClick={() => handleScanToken(tokenSearch)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Fetch Token
            </button>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 transition"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Token Barcode / QR</span>
            </button>
          </div>
        </div>

        {/* Success Toast Notice */}
        {scannerSuccessNotice && (
          <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{scannerSuccessNotice}</span>
            </div>
            <span className="text-[11px] bg-emerald-700 px-2 py-0.5 rounded">
              Ready for Consultation
            </span>
          </div>
        )}

        {/* Quick Token Queue Selection Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wide flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Active Queue Tokens:</span>
          </span>

          {/* Database-persisted tokens list */}
          {dbTokens.length > 0 ? (
            dbTokens.map((item) => (
              <button
                key={item.tokenNumber}
                onClick={() => handleScanToken(item.tokenNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeToken === item.tokenNumber
                    ? item.emergencyAlert
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-blue-600 text-white shadow-sm'
                    : item.emergencyAlert
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-800 border border-slate-200'
                }`}
              >
                <span>{item.tokenNumber}</span>
                <span className="font-normal opacity-80">({item.patientName})</span>
                {item.emergencyAlert && <span className="text-[10px] bg-red-800 text-white px-1.5 py-0.2 rounded-full">P1</span>}
              </button>
            ))
          ) : (
            [
              { token: 'OPD-A-042', name: 'Rajesh Kumar', complaint: 'Stomach Pain & Acid Gas', emergency: false },
              { token: 'P1-EMERGENCY-102', name: 'Smt. Sunita Devi', complaint: 'Substernal Chest Pain (MI Risk)', emergency: true },
              { token: 'OPD-A-043', name: 'Anita Ben Patel', complaint: 'Pyrexia & Body Chills', emergency: false },
              { token: 'OPD-B-015', name: 'Ramulu Kethavath', complaint: 'Bilateral Knee Arthritis', emergency: false },
            ].map((item) => (
              <button
                key={item.token}
                onClick={() => handleScanToken(item.token)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeToken === item.token
                    ? item.emergency
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-blue-600 text-white shadow-sm'
                    : item.emergency
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-800 border border-slate-200'
                }`}
              >
                <span>{item.token}</span>
                <span className="font-normal opacity-80">({item.name})</span>
                {item.emergency && <span className="text-[10px] bg-red-800 text-white px-1.5 py-0.2 rounded-full">P1</span>}
              </button>
            ))
          )}
        </div>
      </div>

      {/* MODAL: INTERACTIVE TOKEN BARCODE / QR SCANNER SIMULATOR */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Scan OPD Patient Slip
                  </h3>
                  <p className="text-xs text-slate-500">
                    Align the barcode or QR code on the patient&apos;s slip with the camera
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsScannerOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewfinder simulation with red laser scan line */}
            <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-blue-500/50">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-400" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-400" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-400" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-400" />

              {/* Animated Laser Line */}
              <div className="absolute inset-x-0 h-0.5 bg-red-500 shadow-lg shadow-red-500/80 animate-pulse" />

              {/* Center Target Box */}
              <div className="p-4 border border-dashed border-white/40 rounded-xl text-center space-y-1 bg-white/5">
                <QrCode className="w-12 h-12 text-white/80 mx-auto animate-pulse" />
                <div className="text-[11px] text-white/80 font-mono font-bold uppercase tracking-wider">
                  Target: {activeToken}
                </div>
              </div>
            </div>

            {/* Quick-tap sample tokens for rapid demo */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">
                Or simulate scanning one of these physical slips:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleScanToken('OPD-A-042')}
                  className="p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-left transition"
                >
                  <div className="font-mono font-bold text-xs text-blue-900">OPD-A-042</div>
                  <div className="text-[11px] text-slate-600 font-semibold">Rajesh Kumar (Stomach Pain)</div>
                  <div className="text-[10px] text-blue-700">P3 Routine OPD</div>
                </button>

                <button
                  onClick={() => handleScanToken('P1-EMERGENCY-102')}
                  className="p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-left transition"
                >
                  <div className="font-mono font-bold text-xs text-red-900">P1-EMERGENCY-102</div>
                  <div className="text-[11px] text-slate-600 font-semibold">Sunita Devi (Chest Pain)</div>
                  <div className="text-[10px] text-red-700 font-bold">🚨 CODE RED PRIORITY</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PATIENT DEMOGRAPHIC & INTAKE OVERVIEW STRIP */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md font-mono text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 uppercase font-sans">Current Verified Token:</span>
            <span className="text-base font-extrabold text-teal-300 font-mono bg-slate-800 px-3 py-0.5 rounded-lg border border-slate-700">
              {activeToken}
            </span>
          </div>

          <div className="flex items-center gap-2 font-sans">
            <span className="text-teal-400 bg-teal-950/60 border border-teal-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Intake Verified</span>
            </span>
            <button
              onClick={onRefreshSummary}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
            >
              Re-analyze AI Summary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 font-sans">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
            <span className="font-bold text-sm text-white">{patient.fullName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
            <span className="text-teal-300 font-bold text-sm">{patient.age} Y / {patient.gender}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">ABHA Health ID</span>
            <span className="text-blue-300 font-mono font-bold">{patient.abhaNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
            <span className="text-rose-300 font-bold">{patient.bloodGroup}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobile Number</span>
            <span className="text-slate-300 font-mono">{patient.mobile}</span>
          </div>
        </div>
      </div>

      {/* Emergency Red Flag Notice if applicable */}
      {isEmergency && (
        <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg flex items-start gap-3 animate-pulse">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-black text-sm uppercase tracking-wide">
              EMERGENCY RED-FLAG DETECTED AT KIOSK: P1 FAST-TRACK
            </div>
            <div className="text-white/95">
              {emergencyReason || 'Critical red-flag symptoms detected. Patient routed directly to resuscitation bay.'}
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONSULTATION WORKSPACE (2 COLS: LEFT INTAKE INFO, RIGHT PRESCRIPTION WRITER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: INTAKE INFORMATION & AI SUMMARY */}
        <div className="lg:col-span-7 space-y-5">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('clinical')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'clinical'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Synthesized Clinical Brief</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kiosk Dialogue ({interviewMessages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Prior Records ({scannedDocs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('fhir')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'fhir'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>FHIR R4</span>
            </button>
          </div>

          {/* TAB 1: SYNTHESIZED CLINICAL BRIEF */}
          {activeTab === 'clinical' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              {/* Snapshot / Chief Complaint */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
                  Intake Snapshot & Chief Presentation
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                  {summary?.snapshot || `${patient.fullName}, ${patient.age}Y/${patient.gender}, presented at MediKiosk reporting severe stomach discomfort and acid burning for the last 2 days.`}
                </p>
              </div>

              {/* History of Present Illness (HPI) */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>History of Present Illness (HPI)</span>
                </h4>
                <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {summary?.hpi || 'Patient reported episodic epigastric pain with postprandial burning sensation. No radiating pain to left shoulder or jaw. Elicited pain rating: 7/10.'}
                </div>
              </div>

              {/* AI Differentials & Clinical Likelihoods */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Differential Diagnoses & Likelihood</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(summary?.differentials || [
                    { condition: 'Acute Gastritis / Acid Peptic Disease', likelihood: 'High', reasoning: 'Matches postprandial epigastric burning and nausea.' },
                    { condition: 'Gastroesophageal Reflux Disease (GERD)', likelihood: 'Moderate', reasoning: 'Associated with nocturnal recumbency symptoms.' }
                  ]).map((diff, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{diff.condition}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          diff.likelihood === 'High' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {diff.likelihood}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{diff.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Chronic Medications from Prior OCR Scans */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>Active Chronic Medications (Digitized from Past Records)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { drug: 'Telmisartan 40mg', freq: '1-0-0 (Morning)', compliance: 'Regular' },
                    { drug: 'Metformin 500mg', freq: '1-0-1 (After Food)', compliance: 'Irregular' },
                  ].map((med, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{med.drug}</div>
                        <div className="text-[11px] text-slate-500">{med.freq}</div>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {med.compliance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KIOSK DIALOGUE CHAT TIMELINE */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="text-xs font-bold text-slate-800">
                  Verbatim Kiosk Dialogue with Patient ({patient.fullName})
                </div>
                <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                  Audio & Touch Transcribed
                </span>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {interviewMessages.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No conversational messages recorded for this session.</p>
                ) : (
                  interviewMessages.map((msg, i) => (
                    <div
                      key={msg.id || i}
                      className={`p-3 rounded-2xl text-xs space-y-1 ${
                        msg.sender === 'assistant'
                          ? 'bg-blue-50/80 text-blue-950 border border-blue-100 mr-8'
                          : 'bg-slate-100 text-slate-900 ml-8 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                        <span>{msg.sender === 'assistant' ? 'MediKiosk AI' : patient.fullName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRIOR RECORDS TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                Chronological Digitized Prescriptions & Lab Tests
              </div>
              <div className="space-y-3">
                {scannedDocs.map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{doc.title}</div>
                        <div className="text-[11px] text-slate-500">{doc.hospitalName} • {doc.doctorName}</div>
                      </div>
                      <span className="bg-white border border-slate-200 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded">
                        {doc.documentDate}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="font-semibold text-slate-700">Diagnoses: </span>
                      <span className="text-slate-900">{doc.diagnoses.join(', ')}</span>
                    </div>

                    {doc.repeatedTestWarning && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                        ⚠️ {doc.repeatedTestWarning}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FHIR R4 SNIPPET */}
          {activeTab === 'fhir' && (
            <div className="bg-slate-950 text-emerald-400 rounded-3xl p-6 font-mono text-xs overflow-x-auto max-h-[480px]">
              <pre>
                {JSON.stringify(
                  {
                    resourceType: 'Bundle',
                    type: 'document',
                    identifier: { system: 'https://healthid.ndhm.gov.in', value: patient.abhaNumber },
                    entry: [
                      {
                        resource: {
                          resourceType: 'Encounter',
                          status: 'finished',
                          class: { code: 'AMB', display: 'ambulatory' },
                          subject: { display: patient.fullName, reference: patient.abhaAddress },
                          period: { start: new Date().toISOString() }
                        }
                      }
                    ]
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* RIGHT 5 COLS: DOCTOR'S PRESCRIPTION & CLINICAL ORDERS PAD */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-sm space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  ℞
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Doctor&apos;s Prescription & Order Pad
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Prescribe medicines & clinical advice for {patient.fullName}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                {prescribedMedications.length} Tablets Added
              </span>
            </div>

            {/* Quick 1-Click Popular Indian OPD Medication Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                Quick-Add Popular OPD Medications:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_OPD_DRUGS.slice(0, 6).map((drug, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddPopularDrug(drug)}
                    className="text-[11px] bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 px-2 py-1 rounded-lg transition active:scale-95 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                    <span>{drug.name.replace(/^Tab /, '')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Prescribed Medication List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                Prescribed Tablets for Patient Slip:
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {prescribedMedications.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No medications added yet. Use quick-add chips above or add custom drugs below.
                  </div>
                ) : (
                  prescribedMedications.map((med, idx) => (
                    <div
                      key={med.id || idx}
                      className="p-3 rounded-xl border border-blue-100 bg-blue-50/40 text-xs flex items-start justify-between gap-2 transition hover:bg-blue-50"
                    >
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-slate-900 text-xs">
                          {med.drugName} ({med.dosage})
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="font-mono font-bold bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded text-[10px]">
                            {med.frequency}
                          </span>
                          <span>• {med.mealTiming}</span>
                          <span>• {med.duration}</span>
                        </div>
                        {med.instructions && (
                          <div className="text-[10px] text-slate-500 italic">
                            {med.instructions}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveDrug(med.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Custom Drug Input Form */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                Add Custom Medication:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Drug Name e.g. Tab Dolo 650"
                  value={customDrugName}
                  onChange={(e) => setCustomDrugName(e.target.value)}
                  className="col-span-2 text-xs p-2 rounded-xl border border-slate-300 bg-white"
                />
                <select
                  value={customFreq}
                  onChange={(e) => setCustomFreq(e.target.value)}
                  className="text-xs p-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="1-0-1">1-0-1 (Morning & Night)</option>
                  <option value="1-0-0">1-0-0 (Morning only)</option>
                  <option value="0-0-1">0-0-1 (Bedtime)</option>
                  <option value="1-1-1">1-1-1 (Thrice daily)</option>
                  <option value="SOS">SOS (As needed)</option>
                </select>
                <select
                  value={customTiming}
                  onChange={(e) => setCustomTiming(e.target.value)}
                  className="text-xs p-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="After Food (भोजन के बाद)">After Food (भोजन के बाद)</option>
                  <option value="Before Food (भोजन से पहले)">Before Food (भोजन से पहले)</option>
                  <option value="With Food (भोजन के साथ)">With Food (भोजन के साथ)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Duration e.g. 5 days"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="w-1/2 text-xs p-2 rounded-xl border border-slate-300 bg-white"
                />
                <button
                  onClick={handleAddCustomDrug}
                  className="w-1/2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Rx</span>
                </button>
              </div>
            </div>

            {/* Doctor's Clinical Suggestions & Advice */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                Doctor&apos;s Suggestions & Advice (सलाह):
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Avoid sour foods, drink lukewarm water..."
                  value={newSuggestionInput}
                  onChange={(e) => setNewSuggestionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSuggestion()}
                  className="flex-1 text-xs p-2 rounded-xl border border-slate-300 bg-white"
                />
                <button
                  onClick={handleAddSuggestion}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  + Add
                </button>
              </div>

              {/* Quick suggestion tags */}
              <div className="flex flex-wrap gap-1">
                {[
                  'Light bland khichdi diet',
                  'Drink 2.5L boiled water',
                  'Strict bed rest 48 hrs',
                  'Avoid spicy & deep-fried foods'
                ].map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!clinicalSuggestions.includes(sug)) {
                        setClinicalSuggestions(prev => [...prev, sug]);
                      }
                    }}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Ordered Diagnostic Investigations */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                Ordered Investigations / Lab Tests:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Ultrasound Whole Abdomen',
                  'Complete Blood Count (CBC)',
                  'Fasting Blood Sugar & HbA1c',
                  '12-Lead ECG',
                  'Serum Creatinine'
                ].map((test, idx) => {
                  const isSelected = orderedInvestigations.includes(test);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleToggleInvestigation(test)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-blue-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {test}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BIG ACTION BUTTON: ISSUE PATIENT PRESCRIPTION COPY */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <button
                onClick={handleIssuePrescription}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <FileText className="w-5 h-5" />
                <span>Issue Patient Prescription Copy (मरीज को पर्ची दें)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="text-[11px] text-center text-slate-500">
                Generates a clean printable and downloadable tablet schedule slip with visual icons for the patient.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL: PATIENT PRESCRIPTION SLIP (PRINT & DOWNLOAD READY) */}
      <PatientPrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        prescriptionSlip={prescriptionSlipData}
      />
    </div>
  );
};
