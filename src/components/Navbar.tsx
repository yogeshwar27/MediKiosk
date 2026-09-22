import React from 'react';
import { 
  Monitor, 
  Stethoscope, 
  Users, 
  Activity, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  AlertTriangle,
  HeartPulse,
  Accessibility
} from 'lucide-react';
import { AppMode, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../services/languageService';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  assistedMode: boolean;
  onToggleAssistedMode: () => void;
  onTriggerEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  language,
  onSelectLanguage,
  speechEnabled,
  onToggleSpeech,
  assistedMode,
  onToggleAssistedMode,
  onTriggerEmergency,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Professional Hospital Header Strip */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-900 to-slate-900 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="bg-teal-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide uppercase">
            Hospital OPD
          </span>
          <span className="font-semibold text-emerald-200">
            AI-Powered Clinical History Taking & Triage Platform
          </span>
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden lg:inline-block bg-teal-800/80 text-teal-200 px-2 py-0.5 rounded text-[10px]">
            Hospital OPD Emergency & Case-Taking Network
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAssistedMode}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded font-medium transition text-[11px] ${
              assistedMode 
                ? 'bg-amber-400 text-slate-950 shadow-sm font-semibold' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Enlarges touch targets and enables assisted voice guidance"
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>{assistedMode ? 'Assisted Mode: ON' : 'Assisted / Elderly Mode'}</span>
          </button>

          <button
            onClick={onToggleSpeech}
            className="flex items-center gap-1 text-teal-200 hover:text-white transition px-2 py-0.5 rounded bg-white/5"
            title={speechEnabled ? 'Bhashini Voice Prompt: Active' : 'Voice Prompt: Muted'}
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span className="text-[11px]">{speechEnabled ? 'Voice ON' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectMode('kiosk')}>
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5 font-display">
                  MediKiosk
                  <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full border border-teal-200">
                    AI Clinical Engine
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                AI-Powered Clinical History & Triage Kiosk for Indian OPDs
              </p>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <nav className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => onSelectMode('kiosk')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
                currentMode === 'kiosk'
                  ? 'bg-white text-teal-800 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-4 h-4 text-teal-600" />
              <span>Patient Kiosk</span>
            </button>

            <button
              onClick={() => onSelectMode('doctor')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
                currentMode === 'doctor'
                  ? 'bg-white text-teal-800 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>Doctor Consultation (EMR)</span>
            </button>

            <button
              onClick={() => onSelectMode('triage')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
                currentMode === 'triage'
                  ? 'bg-white text-teal-800 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-amber-600" />
              <span>OPD Triage & Flow</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => onSelectLanguage(e.target.value as SupportedLanguage)}
                className="bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer"
                title="Select Indian Language (Bhashini AI Speech Supported)"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeLabel} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency SOS Button */}
            <button
              onClick={onTriggerEmergency}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-red-600/20 transition active:scale-95"
              title="Trigger Emergency Red Flag Alarm Simulation"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">RED FLAG SOS</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
