import React, { useState } from 'react';
import { Sidebar, ExtendedPage } from './components/Sidebar';
import { AbhaLoginStep } from './components/KioskTerminal/AbhaLoginStep';
import { VoiceTouchInterviewStep } from './components/KioskTerminal/VoiceTouchInterviewStep';
import { DocumentScanStep } from './components/KioskTerminal/DocumentScanStep';
import { ClinicalSynthesisSummaryStep } from './components/KioskTerminal/ClinicalSynthesisSummaryStep';
import { KioskCompletionStep } from './components/KioskTerminal/KioskCompletionStep';
import { PatientDashboard } from './components/PatientPortal/PatientDashboard';
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
import { 
  Menu, 
  HeartPulse, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  ExternalLink, 
  Terminal, 
  Copy, 
  Check, 
  X, 
  GitBranch 
} from 'lucide-react';

export default function App() {
  // Current active individual page
  const [currentPage, setCurrentPage] = useState<ExtendedPage>('kiosk');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showLocalhostModal, setShowLocalhostModal] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

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
                {currentPage === 'patient-portal' && 'Registered Patient Portal & Medical History'}
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

          <div className="flex items-center gap-2 text-xs">
            {/* Active Language Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-800 font-bold rounded-xl border border-blue-200">
              <span className="text-[10px] uppercase font-mono text-blue-600">Lang:</span>
              <span>{language.toUpperCase()}</span>
            </div>

            {/* Live Public Deployment Link */}
            <a
              href="https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs transition"
              title="Open Official Live Publication Link in new tab"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live App ↗</span>
            </a>

            {/* Run on Localhost Modal Trigger */}
            <button
              onClick={() => setShowLocalhostModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 transition"
              title="Copy repo and run in localhost guide"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Run Localhost</span>
            </button>

            {/* Quick Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
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
                  onBack={() => setKioskStep(1)}
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
                  onBackToSummary={() => setKioskStep(4)}
                  onGoToPatientDashboard={() => {
                    stopSpeaking();
                    setCurrentPage('patient-portal');
                  }}
                />
              )}
            </div>
          )}

          {/* INDIVIDUAL PAGE: PATIENT DASHBOARD & HISTORY */}
          {currentPage === 'patient-portal' && (
            <PatientDashboard
              currentPatient={activePatient}
              language={language}
              onSwitchToKiosk={() => {
                stopSpeaking();
                setCurrentPage('kiosk');
                setKioskStep(1);
              }}
              onUpdatePatient={(updated) => setActivePatient(updated)}
            />
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
            <span>SIH26047 Hospital Case-Taking Kiosk</span>
            <span>•</span>
            <a
              href="https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200 transition inline-flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              <span>Public Live URL ↗</span>
            </a>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <button
              onClick={() => setShowLocalhostModal(true)}
              className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
            >
              Localhost Setup Guide
            </button>
            <span>•</span>
            <span>Gemini 2.5 Flash • ABDM & FHIR R4 Ready</span>
          </div>
        </footer>
      </div>

      {/* GitHub Repository & Localhost Run Guide Modal */}
      {showLocalhostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Run MediKiosk on Localhost
                  </h3>
                  <p className="text-xs text-slate-500">
                    Smart India Hackathon 2024 • Problem Statement SIH26047
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocalhostModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Official Publication Link */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Official Live Publication URL (Cloud Run)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                  Live & Deployed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app"
                  className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-mono text-blue-900 select-all"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app");
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                  className="px-3 py-2 bg-white hover:bg-blue-100 border border-blue-300 text-blue-700 rounded-xl font-bold text-xs flex items-center gap-1 transition"
                  title="Copy URL"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href="https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition shadow-xs"
                >
                  <span>Open ↗</span>
                </a>
              </div>
            </div>

            {/* 2. Step-by-Step Localhost Setup Commands */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-slate-600" />
                  Terminal Commands (Clone & Run on Localhost)
                </h4>
                <button
                  onClick={() => {
                    const script = `git clone https://github.com/<your-username>/medikiosk-clinical-history-kiosk.git\ncd medikiosk-clinical-history-kiosk\nnpm install\ncp .env.example .env\nnpm run dev`;
                    navigator.clipboard.writeText(script);
                    setCopiedCmd(true);
                    setTimeout(() => setCopiedCmd(false), 2000);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd ? 'Commands Copied!' : 'Copy All Commands'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2 shadow-inner">
                <div className="text-slate-400"># 1. Clone repository to your machine</div>
                <div className="text-emerald-400">git clone https://github.com/&lt;your-username&gt;/medikiosk-clinical-history-kiosk.git</div>
                <div className="text-slate-400"># 2. Enter folder & install dependencies</div>
                <div className="text-emerald-400">cd medikiosk-clinical-history-kiosk && npm install</div>
                <div className="text-slate-400"># 3. Create environment config file</div>
                <div className="text-emerald-400">cp .env.example .env</div>
                <div className="text-slate-400"># 4. Start local development server</div>
                <div className="text-cyan-400">npm run dev</div>
              </div>
              <p className="text-[11px] text-slate-500">
                Server runs at <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">http://localhost:3000</span>.
                Includes full Express backend with persistent patient, doctor & queue database.
              </p>

              {/* Spring Boot & SQL Option */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>🍃 Java Spring Boot & Relational SQL Backend</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono">Port 8080</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Full Spring Boot 3.2 + JPA + PostgreSQL/H2 source code included in <code className="font-bold bg-white/80 px-1 py-0.5 rounded">/backend-spring-boot</code>:
                </p>
                <div className="font-mono text-[11px] bg-slate-900 text-emerald-300 p-2 rounded-lg select-all">
                  cd backend-spring-boot &amp;&amp; mvn spring-boot:run
                </div>
                <div className="text-[10px] text-emerald-700">
                  H2 Web SQL Console: <code className="font-mono font-bold">http://localhost:8080/h2-console</code> (JDBC: <code className="font-mono">jdbc:h2:mem:medikioskdb</code>)
                </div>
              </div>
            </div>

            {/* 3. Pre-Loaded Test Accounts for Localhost Testing */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                Instant Test Credentials
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Patient Portal Login</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-1.5 rounded">ABHA</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
                    <div>ABHA: <strong className="text-slate-900">91-4523-8821-9043</strong></div>
                    <div>Mobile: <strong className="text-slate-900">9876543210</strong></div>
                    <div>PIN: <strong className="text-slate-900">1234</strong></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Doctor Portal Login</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-mono font-bold px-1.5 rounded">NMC</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
                    <div>Reg No: <strong className="text-slate-900">TSMC-48921</strong></div>
                    <div>Password: <strong className="text-slate-900">doctor123</strong></div>
                    <div>Sample Token: <strong className="text-slate-900">OPD-A-042</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowLocalhostModal(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
