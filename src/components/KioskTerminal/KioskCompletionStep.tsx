import React, { useState } from 'react';
import { 
  CheckCircle2, 
  QrCode, 
  Printer, 
  ArrowRight, 
  ArrowLeft,
  AlertTriangle, 
  Clock, 
  Building, 
  Stethoscope,
  Sparkles,
  RotateCcw,
  Download,
  FileText,
  Share2,
  Check
} from 'lucide-react';
import { PatientProfile } from '../../types';

interface KioskCompletionStepProps {
  patient: PatientProfile;
  tokenNumber: string;
  isEmergency: boolean;
  emergencyReason?: string;
  onGoToDoctorView: () => void;
  onStartNewSession: () => void;
  onGoToPatientDashboard?: () => void;
  onBackToSummary?: () => void;
}

export const KioskCompletionStep: React.FC<KioskCompletionStepProps> = ({
  patient,
  tokenNumber,
  isEmergency,
  emergencyReason,
  onGoToDoctorView,
  onStartNewSession,
  onGoToPatientDashboard,
  onBackToSummary,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const issueTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const department = isEmergency ? 'Emergency Resuscitation Bay' : 'General Medicine OPD';
  const room = isEmergency ? 'Room 102 (Emergency)' : 'Room 204 (General Medicine)';

  // 1. Download formatted text receipt
  const handleDownloadTextSlip = () => {
    const slipText = `================================================================
           DISTRICT CIVIL HOSPITAL & MEDICAL COLLEGE
           GOVERNMENT HEALTHCARE SERVICES • SMART OPD
               MediKiosk AI Self-Service Terminal
================================================================
TOKEN NUMBER        : ${tokenNumber}
TRIAGE PRIORITY     : ${isEmergency ? 'P1 - CODE RED EMERGENCY' : 'P3 - ROUTINE OPD'}
ISSUE DATE & TIME   : ${issueDate} at ${issueTime} IST
ASSIGNED DEPARTMENT : ${department}
CONSULTATION ROOM   : ${room}
ESTIMATED WAIT TIME : ${isEmergency ? '0 Mins (Emergency Priority)' : '10 - 15 Mins'}
================================================================
                      PATIENT INFORMATION
================================================================
Patient Name        : ${patient.fullName}
Age / Gender        : ${patient.age} Years / ${patient.gender}
ABHA Health ID      : ${patient.abhaNumber}
ABHA Address        : ${patient.abhaAddress}
Mobile Number       : ${patient.mobile}
Emergency Contact   : Active on file
================================================================
                  CLINICAL CASE-TAKING SUMMARY
================================================================
Chief Complaint     : Clinical history elicited at MediKiosk
Triage Status       : ${isEmergency ? 'CRITICAL - ' + (emergencyReason || 'Immediate Care Required') : 'Stable / Routine Consultation'}
Prescriptions Linked: Previous prescriptions & lab reports OCR digitized
Data Sync           : Synchronized to Doctor EMR Workstation
Consent Framework   : DPDP Act 2023 Digital Consent Granted
EMR Verification ID : EMR-SYNC-${Math.random().toString(36).substring(2, 8).toUpperCase()}
================================================================
INSTRUCTIONS:
1. Please report to the nurse station outside ${room}.
2. When your token (${tokenNumber}) is called, enter the consultation room.
3. The doctor will already have your pre-filled history and records on screen.
================================================================
         Ayushman Bharat Digital Mission (ABDM) Compliant
================================================================`;

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MediKiosk_OPD_Slip_${tokenNumber.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Text slip downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // 2. Download standalone styled printable HTML slip (can save as PDF or view on phone)
  const handleDownloadHtmlSlip = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MediKiosk OPD Slip - ${tokenNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 20px; color: #0f172a; }
    .slip { max-width: 480px; margin: 0 auto; background: #ffffff; border: 2px dashed #94a3b8; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 16px; }
    .hospital { font-size: 14px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; }
    .title { font-size: 18px; font-weight: 900; margin: 4px 0; color: #0f172a; }
    .sub { font-size: 11px; color: #64748b; }
    .token-box { text-align: center; background: ${isEmergency ? '#fee2e2' : '#eff6ff'}; border: 1px solid ${isEmergency ? '#fca5a5' : '#bfdbfe'}; border-radius: 12px; padding: 14px; margin-bottom: 16px; }
    .token-label { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; }
    .token-num { font-size: 38px; font-weight: 900; color: ${isEmergency ? '#dc2626' : '#1d4ed8'}; font-family: monospace; }
    .badge { display: inline-block; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; margin-top: 4px; background: ${isEmergency ? '#dc2626' : '#2563eb'}; color: #fff; }
    .details { font-size: 13px; line-height: 1.6; border-bottom: 1px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 14px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .label { color: #64748b; font-weight: 500; }
    .val { font-weight: 700; color: #0f172a; }
    .footer { text-align: center; font-size: 10px; color: #94a3b8; }
    @media print { body { background: none; padding: 0; } .slip { box-shadow: none; border-color: #000; } button { display: none !important; } }
  </style>
</head>
<body>
  <div class="slip">
    <div class="header">
      <div class="hospital">District Civil Hospital & Medical College</div>
      <div class="title">Smart OPD Intake Slip</div>
      <div class="sub">Ayushman Bharat Digital Mission (ABDM) • MediKiosk AI</div>
    </div>
    <div class="token-box">
      <div class="token-label">Queue Token Number</div>
      <div class="token-num">${tokenNumber}</div>
      <div class="badge">${isEmergency ? 'P1 - CODE RED EMERGENCY' : 'P3 - ROUTINE OPD'}</div>
    </div>
    <div class="details">
      <div class="row"><span class="label">Patient Name:</span><span class="val">${patient.fullName}</span></div>
      <div class="row"><span class="label">Age / Gender:</span><span class="val">${patient.age} Y / ${patient.gender}</span></div>
      <div class="row"><span class="label">ABHA ID:</span><span class="val">${patient.abhaNumber}</span></div>
      <div class="row"><span class="label">Date & Time:</span><span class="val">${issueDate}, ${issueTime}</span></div>
      <div class="row"><span class="label">Assigned Room:</span><span class="val" style="color: #1d4ed8;">${room}</span></div>
      <div class="row"><span class="label">Estimated Wait:</span><span class="val">${isEmergency ? '0 Mins (Priority)' : '10-15 Mins'}</span></div>
    </div>
    <div style="text-align: center; margin: 12px 0;">
      <div style="font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">Doctor's EMR Scan Code</div>
      <div style="display: inline-block; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc; font-family: monospace; font-size: 11px;">
        QR-EMR-SYNC-PASS-VERIFIED
      </div>
    </div>
    <div class="footer">
      Generated automatically via MediKiosk AI Clinical Terminal.<br>
      DPDP Act 2023 Digital Consent Enforced.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MediKiosk_Slip_${tokenNumber.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Printable HTML slip downloaded! You can open and save as PDF.');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // 3. Print physical slip
  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl text-center space-y-3 ${
        isEmergency 
          ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' 
          : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
      }`}>
        <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center text-3xl shadow-inner">
          {isEmergency ? '🚨' : '✅'}
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight">
          {isEmergency ? 'EMERGENCY FAST-TRACK PASS ISSUED' : 'OPD Registration & Case-Taking Completed!'}
        </h2>

        <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto">
          {isEmergency
            ? 'Critical red-flag symptoms detected. Your file is flagged P1 Emergency. Please report immediately to the Resuscitation / Emergency Room.'
            : 'Your comprehensive clinical history, previous prescriptions, and vitals have been synchronized with the doctor\'s EMR station.'}
        </p>
      </div>

      {/* Download Success Toast */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 animate-bounce shadow-md">
          <Check className="w-4 h-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Printable Slip Card with dedicated ID for print styling */}
      <div 
        id="printable-kiosk-slip"
        className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md relative overflow-hidden font-mono space-y-5"
      >
        {/* Top Ticket Header */}
        <div className="text-center border-b border-dashed border-slate-300 pb-4 space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 font-sans">
            District Civil Hospital / Smart OPD
          </div>
          <div className="text-base font-extrabold text-slate-900 font-sans">
            MediKiosk Clinical Intake Slip
          </div>
          <div className="text-[11px] text-slate-400">
            SIH 2026 • SIH26047 • ABDM ID: {patient.abhaNumber}
          </div>
        </div>

        {/* Token Big Number */}
        <div className="text-center py-2">
          <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">
            Your Queue Token Number
          </div>
          <div className={`text-4xl sm:text-5xl font-extrabold tracking-wider mt-1 ${
            isEmergency ? 'text-red-600' : 'text-blue-700'
          }`}>
            {tokenNumber}
          </div>
          {isEmergency ? (
            <div className="inline-block bg-red-100 text-red-800 font-bold text-xs px-3 py-1 rounded-full uppercase mt-2">
              Priority: P1 - CODE RED IMMEDIATE
            </div>
          ) : (
            <div className="inline-block bg-blue-100 text-blue-800 font-bold text-xs px-3 py-1 rounded-full uppercase mt-2">
              Priority: P3 - ROUTINE OPD
            </div>
          )}
        </div>

        {/* Patient Details Table */}
        <div className="border-t border-b border-dashed border-slate-300 py-3 text-xs space-y-1.5 text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Patient Name:</span>
            <span className="font-bold text-slate-900">{patient.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Age / Gender:</span>
            <span>{patient.age} Y / {patient.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date & Time:</span>
            <span>{issueDate}, {issueTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Assigned OPD Room:</span>
            <span className="font-bold text-blue-800">{room}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Wait:</span>
            <span className="font-bold text-slate-900">{isEmergency ? '0 Mins (Priority Bypass)' : '10 - 15 Mins'}</span>
          </div>
        </div>

        {/* QR Code for Doctor's Bedside / Consultation Station Scan */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1 font-sans">
            <div className="text-xs font-bold text-slate-800">
              Instant EMR Pull QR Code
            </div>
            <div className="text-[11px] text-slate-500 max-w-[240px]">
              The OPD doctor or triage nurse can scan this code to load pre-filled history in &lt;1 second.
            </div>
          </div>
          <div className="p-2 border border-slate-300 rounded-xl bg-slate-50">
            <QrCode className="w-14 h-14 text-slate-800" />
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-center text-slate-400 border-t border-dashed border-slate-300 pt-3 font-sans">
          Generated via MediKiosk AI Case-Taking Terminal • DPDP Act 2023 Compliant
        </div>
      </div>

      {/* Slip Operations: Print & Download Options */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-blue-100 shadow-sm space-y-3">
        <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Print & Download Slip Options (पर्ची प्रिंट और डाउनलोड करें)</span>
          </span>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
            Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. Print Physical Slip */}
          <button
            onClick={handlePrintSlip}
            className="py-3 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition shadow-xs"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Print Slip (प्रिंट करें)</span>
          </button>

          {/* 2. Download Text Slip */}
          <button
            onClick={handleDownloadTextSlip}
            className="py-3 px-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Download className="w-4 h-4 text-blue-700" />
            <span>Download Slip (.txt)</span>
          </button>

          {/* 3. Download HTML / PDF Printable */}
          <button
            onClick={handleDownloadHtmlSlip}
            className="py-3 px-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Save Slip (PDF / HTML)</span>
          </button>
        </div>
      </div>

      {/* Main Workflow Navigation Buttons */}
      <div className="space-y-3">
        <button
          onClick={onGoToDoctorView}
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Stethoscope className="w-5 h-5" />
          <span>Switch to Doctor Station & Review Synthesized EMR</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {onGoToPatientDashboard && (
          <button
            onClick={onGoToPatientDashboard}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>View My Patient Dashboard &amp; Full Medical History (मरीज़ रिकॉर्ड देखें)</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {onBackToSummary && (
            <button
              onClick={onBackToSummary}
              className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to Clinical Summary (संक्षेप पर वापस जाएं)</span>
            </button>
          )}

          <button
            onClick={onStartNewSession}
            className={`w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95 ${!onBackToSummary ? 'sm:col-span-2' : ''}`}
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Next Patient Session (नया सत्र)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
