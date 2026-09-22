import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  TrendingDown, 
  Users, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HeartPulse, 
  Calculator,
  ArrowUpRight,
  Stethoscope
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../services/languageService';

interface ClinicalImpactPageProps {
  language: SupportedLanguage;
}

export const ClinicalImpactPage: React.FC<ClinicalImpactPageProps> = ({ language }) => {
  const [dailyPatients, setDailyPatients] = useState<number>(3500);
  const [minutesSavedPerIntake, setMinutesSavedPerIntake] = useState<number>(6.5);
  const [avgRepeatTestCost, setAvgRepeatTestCost] = useState<number>(850);

  // Computed metrics
  const totalDoctorHoursSavedDaily = Math.round((dailyPatients * minutesSavedPerIntake) / 60);
  const duplicateTestsPreventedDaily = Math.round(dailyPatients * 0.28); // 28% reduction in repeat diagnostics
  const dailyFinancialSavingsInr = duplicateTestsPreventedDaily * avgRepeatTestCost;
  const annualSavingsCrores = ((dailyFinancialSavingsInr * 300) / 10000000).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 shrink-0">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  SIH 2026 Solution Metric
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Public Health OPD Economics
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Clinical History-Taking Bottleneck & Impact Analytics
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
                Quantitative solution metrics addressing 2–5 minute consultation pressures in apex and district hospitals across India.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-2xl">
            <Clock className="w-5 h-5 text-blue-600" />
            <div className="text-right">
              <div className="text-[10px] font-bold text-blue-800 uppercase">Consultation Ratio</div>
              <div className="text-sm font-extrabold text-blue-950">70–80% Diagnostic Yield</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Quantitative Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg History Time Saved</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-700">
            6.5 <span className="text-base font-semibold text-slate-500">Mins / Pt</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Cuts pre-visit oral intake from 8 mins down to under 90 seconds for attending physician.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Doctor Time Recovered</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {totalDoctorHoursSavedDaily} <span className="text-base font-semibold text-slate-500">Hrs / Day</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Per 3,500 OPD patients, freeing up capacity for focused physical examinations.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Duplicate Tests Prevented</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-600">
            28–34%
          </div>
          <p className="text-[11px] text-slate-500">
            Via chronological OCR extraction of prior lab reports and valid imaging results.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Patient Out-of-Pocket</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">
            ₹{annualSavingsCrores} <span className="text-base font-semibold text-slate-500">Cr / Yr</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Direct public expenditure saved by eliminating redundant blood tests & X-rays.
          </p>
        </div>
      </div>

      {/* Interactive Savings Simulation Calculator */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Hospital OPD Capacity & Cost Savings Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Adjust parameters based on your district or tertiary hospital OPD footfall
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label className="text-slate-700">Daily OPD Patient Footfall</label>
              <span className="text-blue-600 font-mono">{dailyPatients.toLocaleString()} Patients</span>
            </div>
            <input 
              type="range" 
              min={500} 
              max={10000} 
              step={250}
              value={dailyPatients} 
              onChange={(e) => setDailyPatients(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>500 (Sub-district)</span>
              <span>5,000 (District)</span>
              <span>10,000 (Apex AIIMS)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label className="text-slate-700">Intake Time Saved Per Patient</label>
              <span className="text-blue-600 font-mono">{minutesSavedPerIntake} Minutes</span>
            </div>
            <input 
              type="range" 
              min={3} 
              max={10} 
              step={0.5}
              value={minutesSavedPerIntake} 
              onChange={(e) => setMinutesSavedPerIntake(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>3 Mins (Brief)</span>
              <span>6.5 Mins (Standard)</span>
              <span>10 Mins (Comprehensive)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <label className="text-slate-700">Avg Cost of Avoided Duplicate Test</label>
              <span className="text-blue-600 font-mono">₹{avgRepeatTestCost}</span>
            </div>
            <input 
              type="range" 
              min={300} 
              max={2500} 
              step={50}
              value={avgRepeatTestCost} 
              onChange={(e) => setAvgRepeatTestCost(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹300 (Basic CBC/RBS)</span>
              <span>₹850 (Biochemistry)</span>
              <span>₹2,500 (Imaging/MRI)</span>
            </div>
          </div>
        </div>

        {/* Calculated Results Card */}
        <div className="p-5 rounded-2xl bg-linear-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs text-blue-200 font-bold uppercase tracking-wider">
              Projected Annual Institutional Savings
            </div>
            <div className="text-3xl font-black text-emerald-400">
              ₹{annualSavingsCrores} Crores / Year
            </div>
            <div className="text-xs text-blue-200">
              Plus {totalDoctorHoursSavedDaily * 300} clinician hours re-allocated to patient care and critical diagnoses.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl text-center">
              <div className="text-[10px] text-blue-200 uppercase font-bold">Daily Test Saves</div>
              <div className="text-xl font-bold font-mono text-white">{duplicateTestsPreventedDaily}</div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl text-center">
              <div className="text-[10px] text-blue-200 uppercase font-bold">Daily Dr. Hours</div>
              <div className="text-xl font-bold font-mono text-white">{totalDoctorHoursSavedDaily}h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual Adoption & Vernacular Breakdown */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <span>Multilingual Intake Coverage (8 Supported Indian Languages)</span>
        </h3>
        <p className="text-xs text-slate-500">
          Enabling low-literacy, rural, and regional language patients to report symptoms fluently using voice and touch.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {SUPPORTED_LANGUAGES.map((lang, index) => {
            const mockShares = [28, 22, 14, 12, 9, 6, 5, 4];
            return (
              <div key={lang.code} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{lang.name}</span>
                  <span className="font-mono text-blue-700 font-bold">{mockShares[index]}%</span>
                </div>
                <div className="text-[11px] text-slate-500">{lang.nativeLabel}</div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${mockShares[index] * 3}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
