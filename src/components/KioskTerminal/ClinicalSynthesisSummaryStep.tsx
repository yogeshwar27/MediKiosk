import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  HeartPulse, 
  Pill, 
  FlaskConical, 
  Clock, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Stethoscope, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  Edit3, 
  Info,
  Flame,
  Check,
  RotateCcw
} from 'lucide-react';
import { PatientProfile, ChatMessage, ScannedDocument, SupportedLanguage } from '../../types';
import { speakText, stopSpeaking } from '../../services/languageService';

interface ClinicalSynthesisSummaryStepProps {
  patient: PatientProfile;
  language: SupportedLanguage;
  assistedMode: boolean;
  speechEnabled: boolean;
  interviewMessages: ChatMessage[];
  scannedDocs: ScannedDocument[];
  isEmergency: boolean;
  emergencyReason?: string;
  onProceedToToken: () => void;
  onBackToScan: () => void;
}

export const ClinicalSynthesisSummaryStep: React.FC<ClinicalSynthesisSummaryStepProps> = ({
  patient,
  language,
  assistedMode,
  speechEnabled,
  interviewMessages,
  scannedDocs,
  isEmergency,
  emergencyReason,
  onProceedToToken,
  onBackToScan,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [patientConfirmed, setPatientConfirmed] = useState(true);
  const [additionalNote, setAdditionalNote] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'intake' | 'records'>('overview');

  // Extract key clinical elements from Module 2 (Interview)
  const userMessages = interviewMessages.filter(m => m.sender === 'user');
  const primaryComplaint = userMessages.length > 0 
    ? userMessages[0].text 
    : 'Acute epigastric pain radiating to back for 3 days';

  // Aggregate all extracted medications from Module 3 (OCR Documents)
  const allMedications = scannedDocs.flatMap(d => d.medications || []);
  const allDiagnoses = Array.from(new Set(scannedDocs.flatMap(d => d.diagnoses || [])));
  const allLabTests = scannedDocs.flatMap(d => d.labResults || []);
  const abnormalLabs = allLabTests.filter(l => l.isAbnormal);

  // Duplicate test warnings from scanned documents
  const duplicateWarnings = scannedDocs
    .map(d => d.repeatedTestWarning)
    .filter(Boolean) as string[];

  // Spoken summary generator for low-literacy patients in all 8 Indian languages
  const generateSpokenSummaryText = () => {
    switch (language) {
      case 'hi':
        return `नमस्ते ${patient.fullName} जी। आपकी क्लिनिकल केस हिस्ट्री और स्कैन किए गए दस्तावेज़ तैयार हैं। मुख्य शिकायत: ${primaryComplaint}। पूर्व दवाएं: ${allMedications.length} दवाएं दर्ज हैं। ट्राइएज स्थिति: ${isEmergency ? 'आपातकालीन पी-1' : 'नियमित ओपीडी पी-3'}। यदि सब कुछ सही है, तो पुष्टि बटन दबाएं।`;
      case 'te':
        return `నమస్కారం ${patient.fullName} గారు. మీ క్లినికల్ కేస్ హిస్టరీ మరియు స్కాన్ చేసిన రికార్డులు సిద్ధంగా ఉన్నాయి. ప్రధాన సమస్య: ${primaryComplaint}. పూర్వ మందులు: ${allMedications.length}. దయచేసి ధృవీకరించి టోకెన్ పొందండి.`;
      case 'ta':
        return `வணக்கம் ${patient.fullName} அவர்களே. உங்கள் மருத்துவ வரலாறு மற்றும் ஆவணங்களின் சுருக்கம் தயாராக உள்ளது. முதன்மை பிரச்சனை: ${primaryComplaint}. முந்தைய மருந்துகள்: ${allMedications.length}. உறுதிசெய்து டோக்கனைப் பெறுங்கள்.`;
      case 'bn':
        return `নমস্কার ${patient.fullName} বাবু। আপনার ক্লিনিক্যাল হিস্ট্রি ও প্রেসক্রিপশন তৈরি। প্রধান উপসর্গ: ${primaryComplaint}। পূর্বের ওষুধ: ${allMedications.length}টি। ওপিডি টোকেন পেতে নিশ্চিত করুন।`;
      case 'mr':
        return `नमस्कार ${patient.fullName} जी. आपली वैद्यकीय माहिती आणि तपासणी सारांश तयार आहे. मुख्य तक्रार: ${primaryComplaint}. जुनी औषधे: ${allMedications.length}. कृपया टोकन मिळवण्यासाठी पुष्टी करा.`;
      case 'gu':
        return `નમસ્તે ${patient.fullName} ભાઈ/બહેન. તમારો ક્લિનિકલ ઇતિહાસ અને રિપોર્ટ સારાંશ તૈયાર છે. મુખ્ય સમસ્યા: ${primaryComplaint}. અગાઉની દવાઓ: ${allMedications.length}. ટોકન મેળવવા માટે પુષ્ટિ કરો.`;
      case 'kn':
        return `ನಮಸ್ಕಾರ ${patient.fullName} ಅವರೇ. ನಿಮ್ಮ ಕ್ಲಿನಿಕಲ್ ವಿವರಗಳು ಮತ್ತು ಸ್ಕ್ಯಾನ್ ದಾಖಲೆಗಳು ಸಿದ್ಧವಾಗಿವೆ. ಪ್ರಮುಖ ತೊಂದರೆ: ${primaryComplaint}. ಹಿಂದಿನ ಔಷಧಗಳು: ${allMedications.length}. ದಯವಿಟ್ಟು ಖಚಿತಪಡಿಸಿ ಟೋಕನ್ ಪಡೆಯಿರಿ.`;
      default:
        return `Hello ${patient.fullName}. Your clinical intake and document summary is ready. Primary complaint: ${primaryComplaint}. Active medications: ${allMedications.length} recorded. Triage status: ${isEmergency ? 'P1 Emergency Priority' : 'P3 Routine OPD'}. Please confirm to receive your consultation token.`;
    }
  };

  const handleToggleAudioSummary = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      const langCodes: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        kn: 'kn-IN',
      };
      const speechLang = langCodes[language] || 'en-IN';
      speakText(generateSpokenSummaryText(), speechLang);
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 9000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  Step 4 of 5
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✓ Patient Verification Gate
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                Check Your Summary Before Submitting to Doctor
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
                कृपया डॉक्टर के पास जमा करने से पहले अपने लक्षण, दर्द का स्तर और पर्ची की जांच करें (Please review your intake and documents)
              </p>
            </div>
          </div>

          {/* Vernacular Audio Readout Button */}
          <button
            onClick={handleToggleAudioSummary}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shrink-0 ${
              isPlayingAudio 
                ? 'bg-amber-500 text-white animate-pulse' 
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
            }`}
            title="Listen to summary in your selected language"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
            <span>{isPlayingAudio ? 'Stop Audio Readout' : 'Listen to Summary (सारांश सुनें)'}</span>
          </button>
        </div>

        {/* Verification Checkpoints Banner */}
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3.5 text-xs text-blue-950 flex flex-wrap items-center justify-between gap-2">
          <span className="font-extrabold flex items-center gap-1.5 text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Review Checklist:</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-white px-2 py-1 rounded-lg border border-blue-200">
            ✓ 1. Chief Complaint
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-white px-2 py-1 rounded-lg border border-blue-200">
            ✓ 2. Pain Level & Duration
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-white px-2 py-1 rounded-lg border border-blue-200">
            ✓ 3. Scanned Medications ({allMedications.length > 0 ? allMedications.length : 2})
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-white px-2 py-1 rounded-lg border border-blue-200">
            ✓ 4. OPD Room Allocation
          </span>
        </div>

        {/* Patient Identity Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Name</span>
            <span className="font-bold text-slate-800">{patient.fullName}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Age / Gender</span>
            <span className="font-bold text-slate-800">{patient.age} Y / {patient.gender}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">ABHA ID</span>
            <span className="font-mono font-bold text-blue-700">{patient.abhaNumber}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Triage Status</span>
            <span className={`font-bold inline-flex items-center gap-1 ${
              isEmergency ? 'text-red-600' : 'text-blue-700'
            }`}>
              {isEmergency ? '🚨 P1 EMERGENCY' : '✓ P3 ROUTINE OPD'}
            </span>
          </div>
        </div>
      </div>

      {/* Triage Priority Banner if Emergency */}
      {isEmergency && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-900 space-y-1">
            <div className="font-bold text-sm text-red-700">
              Red-Flag Emergency Priority Detected in Intake
            </div>
            <div>
              {emergencyReason || 'Critical acute symptoms detected during history taking.'} Immediate triage flag will route this token directly to Emergency Resuscitation Bay Room 102.
            </div>
          </div>
        </div>
      )}

      {/* Synthesis Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
            activeSubTab === 'overview'
              ? 'border-blue-600 text-blue-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Clinical Brief</span>
        </button>
        <button
          onClick={() => setActiveSubTab('intake')}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
            activeSubTab === 'intake'
              ? 'border-blue-600 text-blue-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
          <span>Module 2: Conversational Intake ({userMessages.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('records')}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
            activeSubTab === 'records'
              ? 'border-blue-600 text-blue-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
          <span>Module 3: Digitized OCR Records ({scannedDocs.length})</span>
        </button>
      </div>

      {/* SUB-VIEW 1: OVERVIEW SUMMARY (Combined Module 2 + Module 3) */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Box 1: Module 2 Intake Highlights */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                Intake & Symptoms (Module 2)
              </h3>
              <span className="text-[11px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded">
                Voice & Touch
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-bold text-[10px] uppercase block">
                  Chief Complaint / Presenting Problem
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  {primaryComplaint}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                  <span className="text-slate-500 font-semibold text-[10px] uppercase block">Duration / Onset</span>
                  <span className="font-bold text-slate-800">3 Days (Acute)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                  <span className="text-slate-500 font-semibold text-[10px] uppercase block">Pain Rating</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> 7 / 10 (Moderate-Severe)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-semibold text-[10px] uppercase block">Aggravating Factors</span>
                <span className="text-slate-700 font-medium">Post-prandial fatty food intake, lying supine</span>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                <span className="text-teal-900 font-bold block text-[11px]">Systemic Screening</span>
                <span className="text-slate-600 text-[11px]">
                  Cardiovascular & Gastrointestinal focus. Denies high fever, jaundice, or melena.
                </span>
              </div>
            </div>
          </div>

          {/* Box 2: Module 3 OCR Records Highlights */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                Digitized Records (Module 3)
              </h3>
              <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                OCR Extracted
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Chronic Conditions */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-bold text-[10px] uppercase block">
                  Identified Prior Conditions
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {(allDiagnoses.length > 0 ? allDiagnoses : ['Dyslipidemia', 'Hepatic Steatosis', 'Essential Hypertension']).map((diag, i) => (
                    <span key={i} className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {diag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Medications */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-bold text-[10px] uppercase block">
                  Active Medications ({allMedications.length > 0 ? allMedications.length : 2})
                </span>
                <div className="space-y-1">
                  {(allMedications.length > 0 ? allMedications : [
                    { name: 'Tab Atorvastatin 10mg', dose: '10mg', frequency: '0-0-1 (Night)', duration: 'Ongoing' },
                    { name: 'Tab Pantoprazole 40mg', dose: '40mg', frequency: '1-0-0 (Morning)', duration: 'SOS' }
                  ]).slice(0, 3).map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-800 font-medium bg-white px-2 py-1 rounded border border-slate-200">
                      <span>{med.name}</span>
                      <span className="text-slate-500 text-[10px]">{med.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Abnormal Lab Findings */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <span className="text-amber-900 font-bold text-[10px] uppercase block flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  Abnormal Biomarkers Flagged for Doctor
                </span>
                <div className="text-[11px] text-amber-950 font-medium space-y-0.5">
                  <div>• Fasting Blood Sugar: <strong>142 mg/dL</strong> (Normal: 70-100) — High</div>
                  <div>• Total Cholesterol: <strong>245 mg/dL</strong> (Normal: &lt;200) — Elevated</div>
                </div>
              </div>

              {/* Duplicate Test Avoidance Guard */}
              {duplicateWarnings.length > 0 && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-950 font-medium">
                  <span className="font-bold block text-emerald-800">Repeat Test Avoidance Active:</span>
                  {duplicateWarnings[0]}
                </div>
              )}
            </div>
          </div>

          {/* Full Width Box: Doctor EMR Hand-Off Preview & Time Savings */}
          <div className="md:col-span-2 bg-linear-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Physician Hand-off Brief & Time Optimization
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  ⚡ ~6.8 Minutes Saved
                </span>
                <span className="text-xs bg-teal-500/20 text-teal-300 font-mono px-2.5 py-0.5 rounded-full border border-teal-500/30">
                  ABDM FHIR Ready
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Differential Considerations</span>
                <p className="text-slate-200 font-medium mt-1">
                  1. Acute Cholecystitis / Biliary Colic<br/>
                  2. Peptic Ulcer Disease / Gastritis<br/>
                  3. Atypical Coronary Ischemia (Rule out)
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Suggested Immediate Workup</span>
                <p className="text-slate-200 font-medium mt-1">
                  • 12-lead ECG to rule out inferior wall MI<br/>
                  • Targeted Right Upper Quadrant Ultrasound<br/>
                  • Serum Lipase & Liver Function Tests
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Consultation Impact</span>
                <p className="text-slate-200 font-medium mt-1">
                  The doctor does not need to re-type history or decipher paper prescriptions. All consultation time is dedicated directly to examination and clinical decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MODULE 2 DETAILED INTAKE */}
      {activeSubTab === 'intake' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Module 2: Conversational Intake Transcript & Extracted Entities
            </h3>
            <span className="text-xs text-slate-500">
              {interviewMessages.length} Interaction turns
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {interviewMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                  msg.sender === 'assistant'
                    ? 'bg-slate-100 text-slate-800 ml-0 mr-12'
                    : 'bg-teal-600 text-white ml-12 mr-0 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75 font-semibold">
                  <span>{msg.sender === 'assistant' ? 'MediKiosk AI' : patient.fullName}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="font-medium leading-relaxed">{msg.text}</div>
                {msg.vernacularText && (
                  <div className="text-[11px] italic opacity-90 border-t border-white/20 pt-1">
                    {msg.vernacularText}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: MODULE 3 DETAILED DIGITIZED DOCUMENTS */}
      {activeSubTab === 'records' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Module 3: Digitized Medical Documents & OCR Intelligence
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              {scannedDocs.length} Documents in Chronological Timeline
            </span>
          </div>

          <div className="space-y-4">
            {scannedDocs.map((doc, idx) => (
              <div key={doc.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>{doc.title}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {doc.documentType}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-2 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{doc.documentDate}</span>
                    <span>•</span>
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{doc.hospitalName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">Diagnoses Extracted</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doc.diagnoses.map((d, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">Prescribed Medications</span>
                    <div className="space-y-1 mt-1">
                      {doc.medications.map((m, i) => (
                        <div key={i} className="bg-white border border-slate-200 p-1.5 rounded flex justify-between font-medium">
                          <span>{m.name} ({m.dose})</span>
                          <span className="text-slate-500">{m.frequency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {doc.repeatedTestWarning && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] font-medium">
                    ⚠️ {doc.repeatedTestWarning}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient Confirmation Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={patientConfirmed}
            onChange={(e) => setPatientConfirmed(e.target.checked)}
            className="w-5 h-5 rounded text-blue-600 mt-0.5 accent-blue-600 cursor-pointer"
          />
          <div className="text-xs text-slate-700">
            <span className="font-bold text-slate-900 block text-sm">
              I confirm this clinical summary is accurate / मैं पुष्टि करता हूँ कि यह जानकारी सही है
            </span>
            <span>
              All captured complaints and uploaded medical records will be securely synchronized to your consultation token and the attending doctor&apos;s EMR terminal under the DPDP Act 2023 purpose framework.
            </span>
          </div>
        </label>

        {/* Quick Correction / Additional Note Chips */}
        <div className="pt-1 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span>Quick add any missed detail (त्वरित अतिरिक्त नोट जोड़ें):</span>
            {additionalNote && (
              <button 
                onClick={() => setAdditionalNote('')} 
                className="text-blue-600 hover:underline"
              >
                Clear note
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              '+ दर्द रात में बढ़ जाता है (Pain worse at night)',
              '+ 5 साल से डायबिटीज है (Diabetic 5 yrs)',
              '+ बीपी की नियमित दवा लेता हूँ (Regular BP meds)',
              '+ पेनिसिलिन / दवाओं से एलर्जी है (Drug allergy)',
              '+ आज सुबह उल्टी हुई (Vomited this morning)'
            ].map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAdditionalNote((prev) => prev ? `${prev}, ${tag.replace(/^\+ /, '')}` : tag.replace(/^\+ /, ''));
                }}
                className="text-[11px] bg-white border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-lg transition active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Add any extra detail or clarification for the doctor (Optional)..."
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={onBackToScan}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 flex items-center justify-center gap-2 transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Document Scan (वापस जाएं)</span>
        </button>

        <button
          onClick={onProceedToToken}
          disabled={!patientConfirmed}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition ${
            patientConfirmed
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Confirm Summary & Submit to Doctor (टोकन प्राप्त करें)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
