import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  Calendar, 
  Clock, 
  Activity, 
  Pill, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  Search, 
  QrCode, 
  ChevronRight, 
  Hospital, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ExternalLink,
  Printer,
  FileCheck,
  RefreshCw,
  LogOut,
  Stethoscope,
  HeartPulse,
  History,
  FileBadge
} from 'lucide-react';
import { PatientProfile, SupportedLanguage } from '../../types';
import { UI_STRINGS } from '../../services/languageService';

interface PatientDashboardProps {
  currentPatient: PatientProfile;
  onSwitchToKiosk: () => void;
  language: SupportedLanguage;
  onUpdatePatient?: (patient: PatientProfile) => void;
}

interface StoredHistoryResponse {
  patient: any;
  tokens: any[];
  prescriptions: any[];
  documents: any[];
  totalVisits: number;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  currentPatient,
  onSwitchToKiosk,
  language,
  onUpdatePatient,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [historyData, setHistoryData] = useState<StoredHistoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'prescriptions' | 'records'>('overview');
  const [selectedTokenModal, setSelectedTokenModal] = useState<any | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchPatientHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patient/history/${encodeURIComponent(currentPatient.abhaNumber || currentPatient.mobile)}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data);
      }
    } catch (err) {
      console.error('Failed to load patient history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientHistory();
  }, [currentPatient.abhaNumber, currentPatient.mobile]);

  // Derived records
  const tokens = historyData?.tokens || [];
  const prescriptions = historyData?.prescriptions || [];
  const documents = historyData?.documents || [];
  const latestToken = tokens.length > 0 ? tokens[0] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Patient ABHA Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner">
              <User className="w-9 h-9 sm:w-11 sm:h-11 text-blue-100" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {currentPatient.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-300/40 text-emerald-200 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ABDM Verified Citizen
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-blue-100/90 font-mono">
                <span>ABHA ID: <strong className="text-white font-bold">{currentPatient.abhaNumber}</strong></span>
                <span>•</span>
                <span>Address: <strong className="text-white">{currentPatient.abhaAddress}</strong></span>
                <span>•</span>
                <span>Mobile: <strong className="text-white">{currentPatient.mobile}</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-blue-200">
                <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-medium">
                  {currentPatient.age} Yrs / {currentPatient.gender}
                </span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-medium">
                  Blood: {currentPatient.bloodGroup || 'B+'}
                </span>
                <span className="bg-white/10 px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {currentPatient.city}, {currentPatient.state}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5 shrink-0">
            <button
              onClick={onSwitchToKiosk}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-emerald-500/30 transition flex items-center gap-1.5"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Start New OPD Intake</span>
            </button>

            <button
              onClick={fetchPatientHistory}
              disabled={loading}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* Quick Health Stats strip */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-2xl font-black text-white">{tokens.length}</div>
            <div className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">Total Hospital Visits</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-2xl font-black text-emerald-300">{prescriptions.length}</div>
            <div className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">Prescriptions Issued</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-2xl font-black text-cyan-300">{documents.length}</div>
            <div className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">OCR Health Records</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-2xl font-black text-amber-300">
              {latestToken ? latestToken.triagePriority?.split(' ')[0] || 'P3' : 'Active'}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">Current OPD Priority</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Active Token & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Clinical Visits ({tokens.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-4 py-2.5 font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'prescriptions'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Doctor Prescriptions ({prescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2.5 font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'records'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Scanned Health Locker ({documents.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ACTIVE TOKEN */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {latestToken ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Current Active Token
                  </span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {latestToken.tokenNumber}
                    </h2>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                      latestToken.triagePriority?.includes('P1') 
                        ? 'bg-rose-100 text-rose-800 animate-pulse' 
                        : latestToken.triagePriority?.includes('P2')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {latestToken.triagePriority || 'P3 - ROUTINE'}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                      Status: {latestToken.status || 'Waiting'}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-xs text-slate-500 font-medium">Assigned Department</div>
                  <div className="font-extrabold text-slate-800 text-sm">{latestToken.opdDepartment || 'General Medicine'}</div>
                  <div className="text-xs font-bold text-blue-700">{latestToken.consultationRoom || 'Room 204'}</div>
                </div>
              </div>

              {/* Chief complaint & clinical snapshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    Chief Complaint Registered at Kiosk
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    "{latestToken.chiefComplaint}"
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Intake Time: {latestToken.intakeTime || 'Today'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                    Doctor's Pre-Consultation Synthesis
                  </span>
                  <p className="text-xs text-blue-950 font-medium leading-relaxed line-clamp-3">
                    {latestToken.clinicalSummary?.snapshot || 'Intake questions and symptom assessment recorded successfully.'}
                  </p>
                  <button
                    onClick={() => setSelectedTokenModal(latestToken)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 pt-1"
                  >
                    <span>View Full Clinical HPI &amp; Differentials</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Connected Prescriptions if issued */}
              {latestToken.prescription && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-emerald-600" />
                      Doctor Prescription Attached to this Visit
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      Doctor: {latestToken.prescription.doctorName}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {latestToken.prescription.medicines?.map((med: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                        <div>
                          <strong className="font-extrabold text-slate-900 text-sm">{med.drugName || med.name}</strong>
                          <div className="text-slate-500">{med.dosage} • {med.frequency} • {med.mealTiming}</div>
                        </div>
                        <div className="text-right text-emerald-800 font-bold font-mono">
                          {med.duration}
                        </div>
                      </div>
                    ))}
                  </div>

                  {latestToken.prescription.followUpAdvice && (
                    <div className="text-xs text-emerald-900 font-medium">
                      <strong>Follow-up Advice:</strong> {latestToken.prescription.followUpAdvice}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">No Active OPD Token Right Now</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ready to consult a doctor? Walk into the kiosk or start a new intake session to receive an instant OPD priority token.
              </p>
              <button
                onClick={onSwitchToKiosk}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2"
              >
                <HeartPulse className="w-4 h-4" />
                <span>Start Intake Kiosk Session</span>
              </button>
            </div>
          )}

          {/* Emergency Contact & Digital Health ID Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-rose-600" />
                Registered Emergency Contact
              </h3>
              <div className="text-xs space-y-1 text-slate-600">
                <div>Name: <strong className="text-slate-900">{currentPatient.emergencyContact?.name || 'Sunita Verma'}</strong></div>
                <div>Relation: <strong className="text-slate-900">{currentPatient.emergencyContact?.relation || 'Spouse'}</strong></div>
                <div>Phone: <strong className="text-slate-900 font-mono">{currentPatient.emergencyContact?.phone || '9876543211'}</strong></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-blue-600" />
                ABDM Digital Health Card
              </h3>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Ayushman Bharat Health Account (ABHA): <strong className="text-slate-900 font-mono">{currentPatient.abhaNumber}</strong></div>
                <div>Consent Framework: <strong className="text-emerald-700 font-bold">DPDP Act 2023 Compliant</strong></div>
                <div>Health Data Locker: <strong className="text-blue-700">Encrypted &amp; Sync Active</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VISIT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Prior OPD Visits &amp; Case Notes ({tokens.length})
            </h2>
            <span className="text-xs text-slate-500 font-mono">Sorted by latest visit</span>
          </div>

          {tokens.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <p className="text-slate-500 text-xs">No visit history recorded yet for this patient.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.map((token: any, idx: number) => (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 transition shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-slate-900 font-mono">
                        {token.tokenNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        token.triagePriority?.includes('P1') 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {token.triagePriority || 'P3'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {token.intakeTime || token.createdAt ? new Date(token.createdAt || Date.now()).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                        {token.opdDepartment || 'General Medicine'}
                      </span>
                      <button
                        onClick={() => setSelectedTokenModal(token)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition"
                      >
                        Details
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900">Chief Complaint:</strong> {token.chiefComplaint}
                  </div>

                  {token.clinicalSummary?.snapshot && (
                    <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-700">Clinical Snapshot:</strong> {token.clinicalSummary.snapshot}
                    </div>
                  )}

                  {token.prescription && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Prescription Issued by {token.prescription.doctorName} ({token.prescription.medicines?.length || 0} drugs)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Pill className="w-5 h-5 text-indigo-600" />
              Prescription Archive ({prescriptions.length})
            </h2>
          </div>

          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <p className="text-slate-500 text-xs">No doctor prescriptions issued yet for this account.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((rx: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{rx.tokenNumber}</div>
                      <div className="text-[11px] text-slate-400">{new Date(rx.prescribedAt || rx.date || Date.now()).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-800">{rx.doctorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rx.doctorRegNumber}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {rx.medicines?.map((m: any, mIdx: number) => (
                      <div key={mIdx} className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-slate-900">{m.drugName || m.name}</strong>
                          <span className="text-slate-500 text-[11px] ml-1">({m.dosage})</span>
                          <div className="text-[10px] text-blue-700">{m.frequency} • {m.mealTiming}</div>
                        </div>
                        <span className="font-mono text-slate-600 font-bold text-[11px]">{m.duration}</span>
                      </div>
                    ))}
                  </div>

                  {rx.followUpAdvice && (
                    <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                      <strong>Advice:</strong> {rx.followUpAdvice}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SCANNED OCR RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              OCR Document Repository ({documents.length})
            </h2>
          </div>

          {documents.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <p className="text-slate-500 text-xs">No prior physical prescriptions or lab reports scanned yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((doc: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-slate-900">{doc.title || 'Medical Record'}</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">
                      {doc.documentDate || 'Recent'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <div>Hospital: <strong className="text-slate-900">{doc.hospitalName || 'Civil Hospital'}</strong></div>
                    <div>Doctor: <strong className="text-slate-900">{doc.doctorName || 'Attending Physician'}</strong></div>
                  </div>
                  {doc.diagnoses && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.diagnoses.map((d: string, dIdx: number) => (
                        <span key={dIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: TOKEN DETAILS */}
      {selectedTokenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedTokenModal.tokenNumber}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-1">
                  Complete Clinical Intake Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedTokenModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Chief Complaint:</div>
                <p className="text-slate-700 leading-relaxed">{selectedTokenModal.chiefComplaint}</p>
              </div>

              {selectedTokenModal.clinicalSummary?.hpi && (
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="font-bold text-blue-900 mb-1">History of Present Illness (HPI):</div>
                  <p className="text-blue-950 leading-relaxed">{selectedTokenModal.clinicalSummary.hpi}</p>
                </div>
              )}

              {selectedTokenModal.clinicalSummary?.pastHistory && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Past Medical History:</div>
                  <p className="text-slate-700 leading-relaxed">{selectedTokenModal.clinicalSummary.pastHistory}</p>
                </div>
              )}

              {selectedTokenModal.clinicalSummary?.differentials && (
                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                  <div className="font-bold text-indigo-900">Differential Diagnoses Considered:</div>
                  {selectedTokenModal.clinicalSummary.differentials.map((diff: any, dIdx: number) => (
                    <div key={dIdx} className="bg-white p-2.5 rounded-lg border border-indigo-100">
                      <div className="font-bold text-indigo-950 flex justify-between">
                        <span>{diff.condition}</span>
                        <span className="text-indigo-600 font-mono text-[11px]">{diff.likelihood}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{diff.reasoning}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTokenModal(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
