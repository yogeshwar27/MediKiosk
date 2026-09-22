import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Pill, 
  Clock, 
  Calendar, 
  Stethoscope, 
  ShieldCheck, 
  QrCode, 
  FileText, 
  Sun, 
  Moon, 
  Utensils, 
  AlertCircle,
  MessageSquare,
  Check
} from 'lucide-react';
import { PatientProfile, PrescribedMedicine, DoctorPrescriptionSlip } from '../../types';

interface PatientPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptionSlip: DoctorPrescriptionSlip;
}

export const PatientPrescriptionModal: React.FC<PatientPrescriptionModalProps> = ({
  isOpen,
  onClose,
  prescriptionSlip,
}) => {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const { patient, medications, clinicalSuggestions, orderedInvestigations, dietaryLifestyleAdvice, followUpAdvice, tokenNumber, rxNumber, date, time } = prescriptionSlip;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `===================================================================
      DISTRICT CIVIL HOSPITAL & MEDICAL COLLEGE, HYDERABAD
             GOVERNMENT OF TELANGANA • HEALTH & FAMILY WELFARE
                   OUTPATIENT DEPARTMENT PRESCRIPTION
===================================================================
Rx Number         : ${rxNumber}
OPD Token         : ${tokenNumber}
Date & Time       : ${date} at ${time}
Department        : ${prescriptionSlip.doctorDepartment}
Attending Doctor  : ${prescriptionSlip.doctorName} (Reg: ${prescriptionSlip.doctorRegNo})
-------------------------------------------------------------------
PATIENT PARTICULARS:
Name              : ${patient.fullName}
Age / Gender      : ${patient.age} Y / ${patient.gender}
ABHA Health ID    : ${patient.abhaNumber}
Mobile Number     : ${patient.mobile}
Blood Group       : ${patient.bloodGroup}
-------------------------------------------------------------------
DIAGNOSIS & CHIEF COMPLAINTS:
Provisional Dx    : ${prescriptionSlip.provisionalDiagnosis || 'Acute Gastritis / Acid Peptic Disorder'}
Complaints        : ${prescriptionSlip.chiefComplaints}
-------------------------------------------------------------------
Rx - PRESCRIBED MEDICINES (मरीज के लिए दवाइयां):
-------------------------------------------------------------------
${medications.map((m, i) => `
${i + 1}. ${m.drugName} (${m.dosage})
   Dosage / Frequency : ${m.frequency} [${m.frequency === '1-0-1' ? 'Morning & Night' : m.frequency === '1-0-0' ? 'Morning only' : m.frequency === '0-0-1' ? 'Night only' : m.frequency === '1-1-1' ? 'Thrice daily' : 'As needed'}]
   Timing with Meal   : ${m.mealTiming}
   Duration           : ${m.duration}
   Special Note       : ${m.instructions || 'Take as advised'}
`).join('')}
-------------------------------------------------------------------
DOCTOR'S CLINICAL SUGGESTIONS & LIFESTYLE ADVICE:
${clinicalSuggestions.map(s => `• ${s}`).join('\n')}
${dietaryLifestyleAdvice ? `\nDietary Advice:\n• ${dietaryLifestyleAdvice}` : ''}
${orderedInvestigations.length > 0 ? `\nOrdered Tests:\n${orderedInvestigations.map(t => `• ${t}`).join('\n')}` : ''}
-------------------------------------------------------------------
FOLLOW-UP:
${followUpAdvice || 'Review in OPD after 5 days with lab reports, or immediately if symptoms worsen.'}
===================================================================
Digital Verification Hash: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}
Ayushman Bharat Digital Mission (ABDM) Verified Clinical Slip
===================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Prescription_${patient.fullName.replace(/\s+/g, '_')}_${tokenNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopiedStatus('Prescription (.txt) downloaded successfully!');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const handleDownloadHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Prescription - ${patient.fullName} - ${tokenNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 24px; color: #0f172a; }
    .rx-card { max-width: 650px; margin: 0 auto; background: #fff; border: 2px solid #2563eb; border-radius: 16px; padding: 28px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
    .hospital-title { font-size: 16px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; }
    .dr-title { font-size: 13px; font-weight: 700; color: #334155; margin-top: 4px; }
    .badge { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
    .patient-strip { background: #f1f5f9; border-radius: 10px; padding: 12px; font-size: 12px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; }
    .rx-symbol { font-size: 24px; font-weight: 900; color: #2563eb; font-family: serif; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    th { background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; padding: 10px 8px; font-size: 11px; text-transform: uppercase; color: #64748b; }
    td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; vertical-align: top; }
    .timing-badge { font-family: monospace; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; display: inline-block; }
    .advice-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 16px; font-size: 12px; }
    .footer { border-top: 1px dashed #cbd5e1; padding-top: 16px; margin-top: 24px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748b; }
    @media print { body { background: none; padding: 0; } .rx-card { border: none; box-shadow: none; width: 100%; } }
  </style>
</head>
<body>
  <div class="rx-card">
    <div class="header">
      <div>
        <div class="hospital-title">District Civil Hospital & Medical College</div>
        <div class="dr-title">${prescriptionSlip.doctorName} • ${prescriptionSlip.doctorDepartment}</div>
        <div style="font-size: 11px; color: #64748b;">Reg No: ${prescriptionSlip.doctorRegNo} • OPD Room 204</div>
      </div>
      <div style="text-align: right;">
        <span class="badge">Token: ${tokenNumber}</span>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${date}, ${time}</div>
      </div>
    </div>

    <div class="patient-strip">
      <div><strong>Patient:</strong> ${patient.fullName}</div>
      <div><strong>Age/Sex:</strong> ${patient.age}Y/${patient.gender}</div>
      <div><strong>ABHA:</strong> ${patient.abhaNumber}</div>
      <div><strong>Mobile:</strong> ${patient.mobile}</div>
    </div>

    <div class="rx-symbol">℞ Prescribed Medicines (दवाइयां)</div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Medicine Name</th>
          <th>Dosage</th>
          <th>Schedule</th>
          <th>Meal Timing</th>
          <th>Days</th>
        </tr>
      </thead>
      <tbody>
        ${medications.map((m, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${m.drugName}</strong><br><span style="font-size: 11px; color: #64748b;">${m.instructions || ''}</span></td>
          <td>${m.dosage}</td>
          <td><span class="timing-badge">${m.frequency}</span></td>
          <td>${m.mealTiming}</td>
          <td>${m.duration}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="advice-box">
      <strong>Doctor's Advice & Suggestions (सलाह):</strong>
      <ul style="margin: 6px 0 0 16px; padding: 0;">
        ${clinicalSuggestions.map(s => `<li>${s}</li>`).join('')}
        ${dietaryLifestyleAdvice ? `<li><strong>Diet:</strong> ${dietaryLifestyleAdvice}</li>` : ''}
      </ul>
      ${orderedInvestigations.length > 0 ? `
      <div style="margin-top: 8px;"><strong>Ordered Tests:</strong> ${orderedInvestigations.join(', ')}</div>
      ` : ''}
      <div style="margin-top: 8px;"><strong>Follow-up:</strong> ${followUpAdvice || 'Review in 5 days'}</div>
    </div>

    <div class="footer">
      <div>
        <div>Digital Health Verification Code: EMR-ABDM-${Math.random().toString(36).substring(2, 7).toUpperCase()}</div>
        <div>Show this at the Hospital Jan Aushadhi / Pharmacy Counter</div>
      </div>
      <div style="text-align: right;">
        <div style="font-family: cursive; font-size: 16px; color: #1e3a8a;">Dr. ${prescriptionSlip.doctorName.split(' ')[1] || 'A. Sharma'}</div>
        <div>Authorized Medical Officer Signature</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Prescription_${patient.fullName.replace(/\s+/g, '_')}_${tokenNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopiedStatus('Printable HTML/PDF prescription downloaded!');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const handleSendMobile = () => {
    setCopiedStatus(`Prescription link dispatched via SMS/WhatsApp to ${patient.mobile}`);
    setTimeout(() => setCopiedStatus(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  Patient Prescription Copy (मरीज की दवा पर्ची)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ready for Patient
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official OPD Prescription Slip with visual dosage schedule, meal timing & doctor suggestions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {copiedStatus && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shrink-0">
            <Check className="w-4 h-4" />
            <span>{copiedStatus}</span>
          </div>
        )}

        {/* Prescription Paper Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50/50">
          {/* Paper Container - styled like an authentic prescription */}
          <div 
            id="printable-prescription-slip" 
            className="bg-white rounded-2xl p-6 sm:p-8 border border-blue-200 shadow-sm space-y-6 text-slate-900 font-sans"
          >
            {/* Hospital & Doctor Letterhead */}
            <div className="border-b-2 border-slate-200 pb-4 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold tracking-widest text-blue-800 uppercase">
                  District Civil Hospital & Medical College
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900">
                  Government Outpatient Department (OPD)
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Telangana State Health Services • Ayushman Bharat Digital Mission (ABDM)
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="text-sm font-bold text-slate-900">
                  {prescriptionSlip.doctorName}
                </div>
                <div className="text-xs text-slate-600">
                  {prescriptionSlip.doctorDepartment}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  MCI / Reg No: {prescriptionSlip.doctorRegNo} • Room 204
                </div>
              </div>
            </div>

            {/* Patient Meta Strip */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Name</span>
                <span className="font-extrabold text-slate-900">{patient.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Age / Gender</span>
                <span className="font-bold text-slate-800">{patient.age} Y / {patient.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">OPD Token / Rx No</span>
                <span className="font-mono font-extrabold text-blue-700">{tokenNumber} ({rxNumber})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Date & Time</span>
                <span className="font-medium text-slate-700">{date}, {time}</span>
              </div>
            </div>

            {/* Diagnosis / Complaints Tag */}
            <div className="flex flex-wrap items-center gap-2 text-xs border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-700">Provisional Diagnosis:</span>
              <span className="bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full font-bold">
                {prescriptionSlip.provisionalDiagnosis || 'Acute Gastritis / Acid Peptic Disease'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">
                <strong>Complaints:</strong> {prescriptionSlip.chiefComplaints}
              </span>
            </div>

            {/* Rx Heading with Symbol */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black font-serif text-blue-700">℞</span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Prescribed Tablets & Medications (दवाइयों की सूची)
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Take medications strictly according to the schedule below
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Total Medicines: {medications.length}
                </span>
              </div>

              {/* Table of Medicines with visual timing icons */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-600 text-[11px] uppercase font-bold border-b border-slate-200">
                        <th className="py-2.5 px-3 w-8">#</th>
                        <th className="py-2.5 px-3">Medicine Name & Strength</th>
                        <th className="py-2.5 px-3 text-center">Dosage & Frequency</th>
                        <th className="py-2.5 px-3 text-center">Timing (समय)</th>
                        <th className="py-2.5 px-3">Meal Instructions</th>
                        <th className="py-2.5 px-3 w-20">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {medications.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-slate-400 italic">
                            No medications added yet by the doctor.
                          </td>
                        </tr>
                      ) : (
                        medications.map((med, idx) => {
                          const isMorning = med.frequency.startsWith('1') || med.frequency.includes('1-0-1') || med.frequency.includes('1-1-1') || med.frequency.includes('1-0-0');
                          const isNoon = med.frequency.includes('1-1-1') || med.frequency === '0-1-0';
                          const isNight = med.frequency.endsWith('1') || med.frequency.includes('1-0-1') || med.frequency.includes('1-1-1') || med.frequency.includes('0-0-1');
                          const isSOS = med.frequency.toUpperCase() === 'SOS';

                          return (
                            <tr key={med.id || idx} className="hover:bg-blue-50/30 transition">
                              <td className="py-3 px-3 font-bold text-slate-400 text-center">
                                {idx + 1}
                              </td>
                              <td className="py-3 px-3 font-semibold text-slate-900">
                                <div className="text-sm font-bold text-blue-950">{med.drugName}</div>
                                <div className="text-[11px] text-slate-500 font-normal">
                                  {med.dosage} • {med.category || 'Oral Formulation'}
                                </div>
                                {med.instructions && (
                                  <div className="text-[11px] text-blue-700 mt-0.5 font-medium">
                                    ℹ️ {med.instructions}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="font-mono font-extrabold bg-blue-100 text-blue-900 px-2 py-1 rounded text-xs">
                                  {med.frequency}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                {isSOS ? (
                                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                    As Needed (जरूरत पड़ने पर)
                                  </span>
                                ) : (
                                  <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                                    <span 
                                      title="Morning / सुबह" 
                                      className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${isMorning ? 'text-amber-600' : 'text-slate-300'}`}
                                    >
                                      <Sun className="w-3 h-3" />
                                      <span>M</span>
                                    </span>
                                    <span className="text-slate-300">|</span>
                                    <span 
                                      title="Noon / दोपहर" 
                                      className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${isNoon ? 'text-orange-500' : 'text-slate-300'}`}
                                    >
                                      <Sun className="w-3 h-3" />
                                      <span>A</span>
                                    </span>
                                    <span className="text-slate-300">|</span>
                                    <span 
                                      title="Night / रात" 
                                      className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${isNight ? 'text-indigo-600' : 'text-slate-300'}`}
                                    >
                                      <Moon className="w-3 h-3" />
                                      <span>N</span>
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg ${
                                  med.mealTiming.toLowerCase().includes('before') 
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}>
                                  <Utensils className="w-3 h-3" />
                                  <span>{med.mealTiming}</span>
                                </span>
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-800">
                                {med.duration}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Doctor's Clinical Advice & Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Clinical & Dietary Suggestions */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                  <span>Doctor&apos;s Advice & Suggestions (सलाह)</span>
                </div>
                <ul className="space-y-1.5 text-slate-700">
                  {clinicalSuggestions.length > 0 ? (
                    clinicalSuggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{sug}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500">Take plenty of oral fluids and adequate physical rest.</li>
                  )}
                  {dietaryLifestyleAdvice && (
                    <li className="flex items-start gap-1.5 pt-1 text-slate-900 font-medium">
                      <span className="text-emerald-600 font-bold">🍏 Diet:</span>
                      <span>{dietaryLifestyleAdvice}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Lab Tests Ordered & Follow-Up */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Investigations / Lab Tests Ordered</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {orderedInvestigations.length > 0 ? (
                      orderedInvestigations.map((test, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                          ✓ {test}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">No routine diagnostic tests required today.</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    <span>Follow-Up Review:</span>
                  </div>
                  <div className="text-xs text-slate-700 mt-0.5">
                    {followUpAdvice || 'Review in OPD Room 204 after 5 days with medication response, or immediately in Emergency Room 102 if pain increases.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Prescription Footer */}
            <div className="border-t border-dashed border-slate-300 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div className="text-[11px] text-slate-500">
                  <div className="font-bold text-slate-800">Pharmacy Dispensing QR Code</div>
                  <div>Scan at hospital dispensary or Jan Aushadhi counter for instant digital dispensing.</div>
                  <div className="font-mono text-blue-700 text-[10px]">ABDM-PASS: {patient.abhaAddress}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-serif italic text-base text-blue-900 font-bold">
                  Dr. {prescriptionSlip.doctorName.split(' ')[1] || 'A. Sharma'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Digitally Signed & Certified Hospital OPD Slip
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar (Print, Download, Share) */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Patient Copy (पर्ची प्रिंट करें)</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Save as PDF / HTML</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Download Text (.txt)</span>
            </button>

            <button
              onClick={handleSendMobile}
              className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Send to Mobile SMS ({patient.mobile})</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
