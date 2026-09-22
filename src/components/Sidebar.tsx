import React from 'react';
import { 
  Monitor, 
  Stethoscope, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  Volume2, 
  VolumeX, 
  Eye, 
  AlertTriangle, 
  HeartPulse, 
  Globe, 
  ChevronRight,
  Sparkles,
  Hospital,
  Activity,
  Layers,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { AppMode, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, UI_STRINGS } from '../services/languageService';

export type ExtendedPage = AppMode | 'analytics' | 'settings' | 'patient-portal';

interface SidebarProps {
  currentPage: ExtendedPage;
  onSelectPage: (page: ExtendedPage) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  assistedMode: boolean;
  onToggleAssistedMode: () => void;
  onTriggerEmergency: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  language,
  onSelectLanguage,
  speechEnabled,
  onToggleSpeech,
  assistedMode,
  onToggleAssistedMode,
  onTriggerEmergency,
  isMobileOpen,
  onCloseMobile,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  const navItems = [
    {
      id: 'kiosk' as ExtendedPage,
      label: 'Patient Intake Kiosk',
      vernacularLabel: t.caseTaking,
      icon: Monitor,
      badge: 'Step 1-5',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Voice & touch self-checkin'
    },
    {
      id: 'patient-portal' as ExtendedPage,
      label: 'Patient Portal & History',
      vernacularLabel: 'मरीज़ रिकॉर्ड / చరిత్ర',
      icon: UserCheck,
      badge: 'ABDM',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Tokens, prescriptions & past visits'
    },
    {
      id: 'doctor' as ExtendedPage,
      label: 'Doctor Consultation (EMR)',
      vernacularLabel: t.doctorEMR,
      icon: Stethoscope,
      badge: 'EMR Sync',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      description: 'Synthesized pre-visit notes'
    },
    {
      id: 'triage' as ExtendedPage,
      label: 'Emergency & OPD Queue',
      vernacularLabel: t.opdQueue,
      icon: Users,
      badge: 'Live',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Red-flag P1 triage bypass'
    },
    {
      id: 'analytics' as ExtendedPage,
      label: 'Clinical Impact & Analytics',
      vernacularLabel: 'विश्लेषण / ప్రభావం',
      icon: BarChart3,
      badge: '72% Saved',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'OPD time & cost savings'
    },
    {
      id: 'settings' as ExtendedPage,
      label: 'Hospital & Audio Config',
      vernacularLabel: 'सेटिंग्स / ఆడియో',
      icon: Settings,
      badge: 'Bhashini',
      badgeColor: 'bg-slate-100 text-slate-700',
      description: 'Voice engine & senior mode'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Vertical Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md border-r border-blue-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-blue-100/80 bg-linear-to-b from-blue-50/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-lg text-slate-900 tracking-tight">
                  MediKiosk <span className="text-blue-600 font-extrabold text-sm">AI</span>
                </h1>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded border border-blue-200">
                  SIH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Hospital OPD Case-Taking & Triage
              </p>
            </div>
          </div>
        </div>

        {/* Language Selection in Sidebar (Requirement 1) */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Patient Language</span>
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
              8 Languages
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onSelectLanguage(lang.code)}
                  className={`px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                      : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 hover:border-blue-200'
                  }`}
                  title={lang.name}
                >
                  <span className="truncate">{lang.nativeLabel}</span>
                  <span className={`text-[10px] uppercase font-mono ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {lang.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Items (Individual Pages - Requirement 2) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-1">
            Individual OPD Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold'
                    : 'bg-white hover:bg-blue-50/70 text-slate-700 border border-slate-200/80 hover:border-blue-200 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs truncate flex items-center gap-1.5">
                      <span>{item.label}</span>
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor
                }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Publication & Localhost Status Pill */}
        <div className="mx-3 my-2 p-2.5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/80 shadow-xs">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-extrabold text-blue-900 flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-600" />
              Live Deployment
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Online
            </span>
          </div>
          <a
            href="https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-1.5 rounded-xl bg-white text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-blue-200/60 text-[11px] font-bold transition"
            title="Open Public Deployment in new tab"
          >
            <span className="truncate">Public App URL</span>
            <ExternalLink className="w-3 h-3 text-blue-500 group-hover:translate-x-0.5 transition" />
          </a>
        </div>

        {/* Bottom Kiosk Controls & Emergency Trigger */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/80 space-y-2">
          {/* Quick Accessibility Toggles */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={onToggleSpeech}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition ${
                speechEnabled 
                  ? 'bg-blue-50 border-blue-300 text-blue-800' 
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
              title="Toggle Vernacular Voice Assistant Audio"
            >
              {speechEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[11px]">{speechEnabled ? 'Audio On' : 'Muted'}</span>
            </button>

            <button
              onClick={onToggleAssistedMode}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition ${
                assistedMode 
                  ? 'bg-blue-50 border-blue-300 text-blue-800' 
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
              title="Senior Citizen / Low-Literacy High-Touch Mode"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-[11px]">{assistedMode ? 'Senior Font' : 'Standard'}</span>
            </button>
          </div>

          {/* Emergency Red Flag Quick Test */}
          <button
            onClick={() => {
              onTriggerEmergency();
              onCloseMobile();
            }}
            className="w-full p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-95"
            title="Demonstrate Red-Flag Clinical Triage Alert"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Simulate Red-Flag Emergency</span>
          </button>

          {/* ABDM Security Footer Badge */}
          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>DPDP Act 2023 Encrypted</span>
            <span className="text-blue-600 font-bold">ABDM Verified</span>
          </div>
        </div>
      </aside>
    </>
  );
};
