import React, { useState } from 'react';
import { Sidebar, ExtendedPage } from './components/Sidebar';
import { AbhaLoginStep } from './components/KioskTerminal/AbhaLoginStep';
import { VoiceTouchInterviewStep } from './components/KioskTerminal/VoiceTouchInterviewStep';
import { DocumentScanStep } from './components/KioskTerminal/DocumentScanStep';
import { ClinicalSynthesisSummaryStep } from './components/KioskTerminal/ClinicalSynthesisSummaryStep';
import { KioskCompletionStep } from './components/KioskTerminal/KioskCompletionStep';
import { DoctorConsultationView } from './components/DoctorPortal/DoctorConsultationView';
import { DoctorAuthGate } from './components/DoctorPortal/DoctorAuthGate';
import { OpdQueueManager } from './components/Triage/OpdQueueManager';
import { ClinicalImpactPage } from './components/Analytics/ClinicalImpactPage';
import { HospitalConfigPage } from './components/Settings/HospitalConfigPage';
import { 
  PatientProfile, 
  SupportedLanguage, 
  ChatMessage, 
  ScannedDocument, 
  QueueEntry 
} from './types';
import { SAMPLE_PATIENTS, SAMPLE_DOCUMENTS } from './data/mockPatients';
import { stopSpeaking, UI_STRINGS } from './services/languageService';
import { Menu, HeartPulse, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Current active individual page
  const [currentPage, setCurrentPage] = useState<ExtendedPage>('kiosk');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Kiosk step progress
  const [kioskStep, setKioskStep] = useState<number>(1); // 1: Login, 2: Interview, 3: OCR, 4: Summary, 5: Token
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [assistedMode, setAssistedMode] = useState<boolean>(false);

  // Active patient and clinical intake state
  const [activePatient, setActivePatient] = useState<PatientProfile>(SAMPLE_PATIENTS[0]);
  const [interviewMessages, setInterviewMessages] = useState<ChatMessage[]>([]);
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([
    SAMPLE_DOCUMENTS[0], // Preload one sample document for instant rich demonstration
  ]);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [emergencyReason, setEmergencyReason] = useState<string | undefined>(undefined);
  const [issuedToken, setIssuedToken] = useState<string>('OPD-A-042');

  // Live hospital queue state
  const [hospitalQueue, setHospitalQueue] = useState<QueueEntry[]>([]);

  // Step 1: Login Complete
  const handleLoginComplete = (patient: PatientProfile) => {
    setActivePatient(patient);
    setKioskStep(2);
  };

  // Step 2: Interview Complete
  const handleInterviewComplete = (
    messages: ChatMessage[], 
    emergencyFlag: boolean, 
    emergencyAlertReason?: string
  ) => {
    setInterviewMessages(messages);
    setIsEmergency(emergencyFlag);
    setEmergencyReason(emergencyAlertReason);
    setKioskStep(3);
  };

  // Step 3: Docs complete -> go to Summary (Step 4)
  const handleProceedToSummary = () => {
    setKioskStep(4);
  };

  // Step 4: Summary confirmed -> Issue Token (Step 5) & Persist to Database
  const handleProceedToToken = async () => {
    const generatedToken = isEmergency 
      ? `P1-EMERGENCY-${Math.floor(100 + Math.random() * 900)}` 
      : `OPD-A-0${Math.floor(40 + Math.random() * 60)}`;
    setIssuedToken(generatedToken);

    const complaint = interviewMessages.find(m => m.sender === 'user')?.text || 'Clinical intake completed at MediKiosk';

    // Add to hospital live queue in UI
    const newQueueEntry: QueueEntry = {
      tokenNumber: generatedToken,
      patientId: activePatient.id,
      patientName: activePatient.fullName,
      age: activePatient.age,
      gender: activePatient.gender,
      abhaId: activePatient.abhaNumber,
      chiefComplaint: complaint,
      triagePriority: isEmergency ? 'P1 - EMERGENCY' : 'P2 - URGENT',
      status: isEmergency ? 'Triage Fast-Track' : 'Waiting',
      intakeTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      emergencyAlert: isEmergency,
      emergencyReason: emergencyReason,
      opdDepartment: isEmergency ? 'Emergency Bay / Resuscitation' : 'General Medicine',
      consultationRoom: isEmergency ? 'Room 102' : 'Room 204',
    };

    setHospitalQueue((prev) => [newQueueEntry, ...prev]);

    // Persist full patient intake and clinical summary to backend database
    try {
      await fetch('/api/queue/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenNumber: generatedToken,
          patientId: activePatient.id,
          patientName: activePatient.fullName,
          age: activePatient.age,
          gender: activePatient.gender,
          abhaNumber: activePatient.abhaNumber,
          mobile: activePatient.mobile,
          bloodGroup: activePatient.bloodGroup,
          chiefComplaint: complaint,
          triagePriority: isEmergency ? 'P1 - EMERGENCY' : 'P2 - URGENT',
          status: isEmergency ? 'Triage Fast-Track' : 'Waiting',
          emergencyAlert: isEmergency,
          emergencyReason,
          opdDepartment: isEmergency ? 'Emergency Bay' : 'General Medicine',
          consultationRoom: isEmergency ? 'Room 102' : 'Room 204',
          interviewMessages,
          scannedDocs,
          clinicalSummary: {
            snapshot: `${activePatient.fullName}, ${activePatient.age}y ${activePatient.gender}. Registered at Kiosk.`,
            hpi: complaint,
            emergencyAlert: isEmergency,
            emergencyReason: emergencyReason,
            pastHistory: 'Documented at MediKiosk Intake',
            activeMedications: [],
            allergies: []
          }
        })
      });
    } catch (e) {
      console.warn('Failed to persist token to server database:', e);
    }

    setKioskStep(5);
  };

  // Switch to Doctor View
  const handleGoToDoctorView = () => {
    stopSpeaking();
    setCurrentPage('doctor');
  };

  // Reset for new patient at kiosk
  const handleStartNewSession = () => {
    stopSpeaking();
    setKioskStep(1);
    setInterviewMessages([]);
    setIsEmergency(false);
    setEmergencyReason(undefined);
    setScannedDocs([SAMPLE_DOCUMENTS[0]]);
  };

  // Emergency Red Flag Demo trigger from Sidebar
  const handleTriggerDemoEmergency = () => {
    setIsEmergency(true);
    setEmergencyReason('Severe crushing substernal chest pain with left arm radiation & cold sweats (Suspected ACS / Acute MI)');
    setCurrentPage('kiosk');
    setKioskStep(2);
  };

  const t = UI_STRINGS[language] || UI_STRINGS.en;

  return (
    <div 
      className="min-h-screen relative flex bg-slate-900 font-sans selection:bg-blue-600 selection:text-white"
      style={{
        backgroundImage: `url('/peaceful_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Peaceful Translucent Blue-Tinted Backdrop Overlay */}
      <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px] pointer-events-none" />

      {/* Vertical Left Dashboard Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page: ExtendedPage) => {
          stopSpeaking();
          setCurrentPage(page);
        }}
        language={language}
        onSelectLanguage={(lang: SupportedLanguage) => {
          stopSpeaking();
          setLanguage(lang);
        }}
        speechEnabled={speechEnabled}
        onToggleSpeech={() => {
          if (speechEnabled) stopSpeaking();
          setSpeechEnabled(!speechEnabled);
        }}
        assistedMode={assistedMode}
        onToggleAssistedMode={() => setAssistedMode(!assistedMode)}
        onTriggerEmergency={handleTriggerDemoEmergency}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area (Offset for lg:ml-72 left sidebar) */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative z-10">
        {/* Top Floating App Bar (Visible on all screens, contains mobile hamburger & status pill) */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-blue-100/60 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                {currentPage === 'kiosk' && 'Patient Intake Terminal'}
                {currentPage === 'doctor' && "Doctor's Consultation Station (EMR)"}
                {currentPage === 'triage' && 'Emergency Priority & Live OPD Queue'}
                {currentPage === 'analytics' && 'Clinical Impact & Bottleneck Analytics'}
                {currentPage === 'settings' && 'Hospital OPD & Speech Settings'}
              </span>

              {isEmergency && (
                <span className="bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1 shadow-sm shadow-red-600/30">
                  <AlertTriangle className="w-3 h-3" />
                  <span>RED FLAG P1</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            {/* Active Language Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 font-bold rounded-xl border border-blue-200">
              <span className="text-[10px] uppercase font-mono text-blue-600">Lang:</span>
              <span>{language.toUpperCase()}</span>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="hidden md:inline">Online •</span>
              <span>AI Active</span>
            </div>
          </div>
        </header>

        {/* Individual Page Views Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* INDIVIDUAL PAGE 1: KIOSK PATIENT INTAKE */}
          {currentPage === 'kiosk' && (
            <div className="space-y-6">
              {/* Step Progress Tracker */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-blue-100 shadow-xs max-w-3xl mx-auto">
                <div className="flex items-center justify-between text-xs">
                  {[
                    { step: 1, title: 'ABHA & Consent' },
                    { step: 2, title: 'Voice/Touch Intake' },
                    { step: 3, title: 'Prescription OCR' },
                    { step: 4, title: 'Clinical Summary' },
                    { step: 5, title: 'Token Slip' },
                  ].map((s) => (
                    <div key={s.step} className="flex flex-col items-center gap-1.5 flex-1 text-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                          kioskStep === s.step
                            ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-xs'
                            : kioskStep > s.step
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {kioskStep > s.step ? '✓' : s.step}
                      </div>
                      <span
                        className={`text-[10px] sm:text-[11px] font-semibold hidden sm:inline ${
                          kioskStep === s.step
                            ? 'text-blue-900 font-bold'
                            : kioskStep > s.step
                            ? 'text-emerald-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: ABHA Login */}
              {kioskStep === 1 && (
                <AbhaLoginStep
                  language={language}
                  assistedMode={assistedMode}
                  onPatientAuthenticated={handleLoginComplete}
                />
              )}

              {/* Step 2: Voice/Touch Adaptive Interview */}
              {kioskStep === 2 && (
                <VoiceTouchInterviewStep
                  patient={activePatient}
                  language={language}
                  assistedMode={assistedMode}
                  speechEnabled={speechEnabled}
                  onCompleteInterview={handleInterviewComplete}
                />
              )}

              {/* Step 3: Prescription / Document OCR */}
              {kioskStep === 3 && (
                <DocumentScanStep
                  language={language}
                  assistedMode={assistedMode}
                  scannedDocs={scannedDocs}
                  onUpdateDocs={setScannedDocs}
                  onProceed={handleProceedToSummary}
                  onBack={() => setKioskStep(2)}
                />
              )}

              {/* Step 4: Clinical Interview & OCR Synthesis Summary */}
              {kioskStep === 4 && (
                <ClinicalSynthesisSummaryStep
                  patient={activePatient}
                  language={language}
                  assistedMode={assistedMode}
                  speechEnabled={speechEnabled}
                  interviewMessages={interviewMessages}
                  scannedDocs={scannedDocs}
                  isEmergency={isEmergency}
                  emergencyReason={emergencyReason}
                  onProceedToToken={handleProceedToToken}
                  onBackToScan={() => setKioskStep(3)}
                />
              )}

              {/* Step 5: Completed Token Slip */}
              {kioskStep === 5 && (
                <KioskCompletionStep
                  patient={activePatient}
                  tokenNumber={issuedToken}
                  isEmergency={isEmergency}
                  emergencyReason={emergencyReason}
                  onGoToDoctorView={handleGoToDoctorView}
                  onStartNewSession={handleStartNewSession}
                />
              )}
            </div>
          )}

          {/* INDIVIDUAL PAGE 2: DOCTOR'S EMR CONSULTATION STATION */}
          {currentPage === 'doctor' && (
            <DoctorAuthGate>
              {(doctor, onLogout) => (
                <DoctorConsultationView
                  doctorProfile={doctor}
                  onLogout={onLogout}
                  patient={activePatient}
                  interviewMessages={interviewMessages}
                  scannedDocs={scannedDocs}
                  isEmergency={isEmergency}
                  emergencyReason={emergencyReason}
                  initialToken={issuedToken}
                  currentQueue={hospitalQueue}
                  onSelectPatientFromQueue={(queueEntry) => {
                    const matched = SAMPLE_PATIENTS.find((p) => p.id === queueEntry.patientId) || activePatient;
                    setActivePatient({
                      ...matched,
                      id: queueEntry.patientId,
                      fullName: queueEntry.patientName,
                      age: queueEntry.age,
                      gender: (queueEntry.gender as 'Male' | 'Female' | 'Other') || 'Male',
                      abhaNumber: queueEntry.abhaId,
                    });
                    setIsEmergency(queueEntry.emergencyAlert);
                    setEmergencyReason(queueEntry.emergencyReason);
                    setIssuedToken(queueEntry.tokenNumber);
                  }}
                  onRefreshSummary={() => {}}
                />
              )}
            </DoctorAuthGate>
          )}

          {/* INDIVIDUAL PAGE 3: OPD QUEUE & EMERGENCY TRIAGE MONITOR */}
          {currentPage === 'triage' && (
            <OpdQueueManager
              currentQueue={hospitalQueue}
              onSelectPatient={(entry: QueueEntry) => {
                const matched = SAMPLE_PATIENTS.find((p: PatientProfile) => p.id === entry.patientId) || activePatient;
                setActivePatient(matched);
                setIsEmergency(entry.emergencyAlert);
                setEmergencyReason(entry.emergencyReason);
                setCurrentPage('doctor');
              }}
            />
          )}

          {/* INDIVIDUAL PAGE 4: CLINICAL IMPACT & ANALYTICS */}
          {currentPage === 'analytics' && (
            <ClinicalImpactPage language={language} />
          )}

          {/* INDIVIDUAL PAGE 5: HOSPITAL & AUDIO SETTINGS */}
          {currentPage === 'settings' && (
            <HospitalConfigPage
              language={language}
              onSelectLanguage={setLanguage}
              speechEnabled={speechEnabled}
              onToggleSpeech={() => {
                if (speechEnabled) stopSpeaking();
                setSpeechEnabled(!speechEnabled);
              }}
              assistedMode={assistedMode}
              onToggleAssistedMode={() => setAssistedMode(!assistedMode)}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="mt-auto bg-white/90 backdrop-blur-md border-t border-blue-100 py-3.5 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-blue-900">MediKiosk</span>
            <span>•</span>
            <span>Indian Hospital OPD Clinical Intake & Triage System</span>
            <span>•</span>
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold">
              Live OPD Fast-Track Ready
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Bhashini Multilingual Speech Engine • Gemini 3.8 Flash • Real-time Triage
          </div>
        </footer>
      </div>
    </div>
  );
}
