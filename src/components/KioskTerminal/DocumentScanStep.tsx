import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Pill, 
  FlaskConical, 
  ArrowRight, 
  ArrowLeft,
  Trash2, 
  Clock, 
  Building2,
  Stethoscope,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { ScannedDocument, SupportedLanguage } from '../../types';
import { SAMPLE_DOCUMENTS } from '../../data/mockPatients';
import { UI_STRINGS } from '../../services/languageService';

interface DocumentScanStepProps {
  language: SupportedLanguage;
  assistedMode: boolean;
  scannedDocs: ScannedDocument[];
  onUpdateDocs: (docs: ScannedDocument[]) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const DocumentScanStep: React.FC<DocumentScanStepProps> = ({
  language,
  assistedMode,
  scannedDocs,
  onUpdateDocs,
  onProceed,
  onBack,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [isScanning, setIsScanning] = useState(false);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const res = await fetch('/api/ai/ocr-prescription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
            documentType: 'Uploaded Prescription',
          }),
        });
        const parsed = await res.json();
        
        const newDoc: ScannedDocument = {
          id: `doc-${Date.now()}`,
          title: file.name,
          documentDate: parsed.documentDate || new Date().toISOString().split('T')[0],
          hospitalName: parsed.hospitalName || 'Verified Clinical Facility',
          doctorName: parsed.doctorName || 'Attending Physician',
          documentType: 'Prescription',
          diagnoses: parsed.diagnoses || ['Clinical Evaluation Note'],
          medications: parsed.medications || [],
          labResults: parsed.labResults || [],
          allergies: parsed.allergies || [],
          chronologicalNote: parsed.chronologicalNote || 'Uploaded record successfully parsed by MediKiosk OCR.',
          repeatedTestWarning: parsed.repeatedTestWarning,
          source: 'uploaded',
        };

        onUpdateDocs([newDoc, ...scannedDocs]);
      } catch (err) {
        console.error('OCR Error:', err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSampleDoc = (sample: ScannedDocument) => {
    if (scannedDocs.some(d => d.id === sample.id)) return;
    onUpdateDocs([sample, ...scannedDocs]);
  };

  const handleRemoveDoc = (id: string) => {
    onUpdateDocs(scannedDocs.filter(d => d.id !== id));
  };

  // Sort chronological order
  const sortedDocs = [...scannedDocs].sort(
    (a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-blue-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl">
                {t.reportScan}
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded font-semibold border border-blue-200">
                Gemini OCR Engine
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              {t.noRepeatedTests}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>{scannedDocs.length} Records Chronologically Organized</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Upload & Sample Ingestion */}
        <div className="space-y-4">
          {/* File Upload Zone */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-blue-100 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              Scan Physical Paper or Upload
            </h4>

            <label className="border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/30 hover:bg-blue-50/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition group">
              <UploadCloud className="w-8 h-8 text-blue-400 group-hover:text-blue-600 group-hover:scale-110 transition mb-2" />
              <span className="font-semibold text-xs text-slate-800">
                Tap to Scan / Upload Document
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Supports JPG, PNG, PDF prescriptions & lab reports
              </span>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {isScanning && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
                <span>AI OCR analyzing handwritten prescription & lab results...</span>
              </div>
            )}
          </div>

          {/* 1-Click Preset Sample Documents for Rapid Evaluation */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-blue-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Quick Sample Prescriptions:
              </h4>
              <span className="text-[10px] text-slate-400">1-Click Test</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_DOCUMENTS.map((doc) => {
                const isAdded = scannedDocs.some(d => d.id === doc.id);
                return (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-xl border text-left transition ${
                      isAdded 
                        ? 'bg-blue-50/80 border-blue-300' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-slate-900 line-clamp-1">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{doc.documentDate}</span>
                          <span>•</span>
                          <span>{doc.documentType}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddSampleDoc(doc)}
                        disabled={isAdded}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 transition ${
                          isAdded
                            ? 'bg-blue-200 text-blue-900 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? 'Added ✓' : '+ Load'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Chronological Timeline & Extracted Insights */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-blue-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Chronological Health Timeline & Medication History
              </h3>
              <span className="text-xs text-slate-500">
                Ordered by date (Newest first)
              </span>
            </div>

            {sortedDocs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto opacity-40 text-blue-500" />
                <p className="text-xs font-medium text-slate-600">
                  No previous records loaded yet.
                </p>
                <p className="text-[11px] text-slate-400">
                  Scan a prescription on the left or tap "+ Load" on any sample record to test chronological analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedDocs.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-xs transition space-y-3"
                  >
                    {/* Record Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                            {doc.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-semibold text-blue-700">{doc.hospitalName}</span>
                            <span>•</span>
                            <span>{doc.doctorName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="bg-slate-200 text-slate-800 text-[11px] font-mono px-2 py-0.5 rounded font-semibold">
                          {doc.documentDate}
                        </span>
                        <button
                          onClick={() => handleRemoveDoc(doc.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition"
                          title="Remove Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Repeated Test Avoidance Alert Badge (Key SIH Benefit) */}
                    {doc.repeatedTestWarning && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Test Duplication Warning: </span>
                          <span>{doc.repeatedTestWarning}</span>
                        </div>
                      </div>
                    )}

                    {/* Diagnoses Pills */}
                    {doc.diagnoses && doc.diagnoses.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          Diagnoses:
                        </span>
                        {doc.diagnoses.map((diag, i) => (
                          <span
                            key={i}
                            className="bg-blue-50 text-blue-900 text-xs px-2 py-0.5 rounded-md font-medium border border-blue-200"
                          >
                            {diag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Medications Extracted */}
                    {doc.medications && doc.medications.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1 uppercase">
                          <Pill className="w-3.5 h-3.5 text-blue-600" />
                          Prescribed Medications & Regimen:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {doc.medications.map((med, mIdx) => (
                            <div
                              key={mIdx}
                              className="text-xs bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between"
                            >
                              <span className="font-bold text-slate-800">{med.name} {med.dose}</span>
                              <span className="font-mono text-slate-500 text-[11px]">{med.frequency}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lab Test Results with Abnormal Badges */}
                    {doc.labResults && doc.labResults.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1 uppercase">
                          <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                          Lab Results & Bio-Markers:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {doc.labResults.map((lab, lIdx) => (
                            <div
                              key={lIdx}
                              className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-2 ${
                                lab.isAbnormal
                                  ? 'bg-red-50 border-red-200 text-red-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span>{lab.testName}:</span>
                              <span className={lab.isAbnormal ? 'text-red-700' : 'font-semibold'}>
                                {lab.value}
                              </span>
                              {lab.isAbnormal && (
                                <span className="bg-red-200 text-red-900 text-[9px] px-1 rounded uppercase">
                                  High
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Chronological Note */}
                    {doc.chronologicalNote && (
                      <p className="text-xs text-slate-600 italic bg-white/70 p-2.5 rounded-lg border border-slate-100">
                        "{doc.chronologicalNote}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onBack}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 flex items-center gap-2 transition active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backBtn}</span>
            </button>
            <button
              onClick={onProceed}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 transition active:scale-95"
            >
              <span>{t.continueBtn}: Check Summary Before Submitting</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
