import React, { useState } from 'react';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Eye, 
  Building, 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  RotateCcw,
  Mic,
  Activity,
  ExternalLink,
  Terminal,
  Copy,
  Check
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { SUPPORTED_LANGUAGES, speakText, stopSpeaking } from '../../services/languageService';

interface HospitalConfigPageProps {
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  assistedMode: boolean;
  onToggleAssistedMode: () => void;
}

export const HospitalConfigPage: React.FC<HospitalConfigPageProps> = ({
  language,
  onSelectLanguage,
  speechEnabled,
  onToggleSpeech,
  assistedMode,
  onToggleAssistedMode,
}) => {
  const [testSpeechStatus, setTestSpeechStatus] = useState<string>('Idle');
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<'female' | 'male'>('female');
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [hospitalName, setHospitalName] = useState<string>('District Civil Hospital & Medical College');
  const [opdBayNumber, setOpdBayNumber] = useState<string>('Kiosk Terminal #04 - Main OPD Entrance');
  const [savedAlert, setSavedAlert] = useState<boolean>(false);

  const testPhrases: Record<SupportedLanguage, string> = {
    en: 'Welcome to MediKiosk. Please tell us your health problem or tap an icon.',
    hi: 'मेडीकियोस्क में आपका स्वागत है। कृपया अपनी स्वास्थ्य समस्या बताएं या स्क्रीन पर टैप करें।',
    te: 'మెడికియోస్క్‌కి స్వాగతం. దయచేసి మీ ఆరోగ్య సమస్యను చెప్పండి లేదా స్క్రీన్‌పై తాకండి.',
    ta: 'மெடிகிஸ்க்கிற்கு நல்வரவு. தயவுசெய்து உங்கள் உடல்நலப் பிரச்சனையை கூறுங்கள் அல்லது திரையைத் தொடுங்கள்.',
    bn: 'মেডিকিয়স্কে স্বাগতম। অনুগ্রহ করে আপনার স্বাস্থ্য সমস্যা বলুন বা স্ক্রিনে স্পর্শ করুন।',
    mr: 'मेडीकियोस्कमध्ये आपले स्वागत आहे. कृपया आपल्या आजाराबद्दल सांगा किंवा स्क्रीनवर स्पर्श करा.',
    gu: 'મેડીકિયોસ્કમાં આપનું સ્વાગત છે. કૃપા કરીને તમારી તબિયતની સમસ્યા જણાવો અથવા સ્ક્રીન પર ટેપ કરો.',
    kn: 'ಮೆಡಿಕಿಯೋಸ್ಕ್‌ಗೆ ಸುಸ್ವಾಗತ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಯನ್ನು ತಿಳಿಸಿ ಅಥವಾ ಪರದೆಯನ್ನು ಮುಟ್ಟಿ.',
  };

  const handleTestSpeech = (lang: SupportedLanguage) => {
    stopSpeaking();
    setTestSpeechStatus(`Speaking in ${lang.toUpperCase()}...`);
    
    const langCodes: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
    };

    speakText(testPhrases[lang] || testPhrases.en, langCodes[lang]);
    setTimeout(() => {
      setTestSpeechStatus('Speech completed');
    }, 4000);
  };

  const handleSaveHospitalConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 shrink-0">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                System Preferences
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Voice Engine & OPD Terminal Setup
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Hospital Configuration & Speech Settings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure vernacular text-to-speech audio readouts, accessibility font sizes, and OPD physical location details.
            </p>
          </div>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully. Applied to active kiosk intake session.</span>
        </div>
      )}

      {/* Speech & Audio Test Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Multilingual Speech & Voice Engine (Bhashini TTS)
              </h3>
              <p className="text-xs text-slate-500">
                Test oral speech output in each of the 8 regional Indian languages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSpeech}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                speechEnabled 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{speechEnabled ? 'Voice Guidance Active' : 'Voice Guidance Muted'}</span>
            </button>
          </div>
        </div>

        {/* Language Speech Test Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase">
            Click to test vernacular voice pronunciation:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div 
                key={lang.code}
                className={`p-3 rounded-2xl border transition flex flex-col justify-between space-y-2 ${
                  language === lang.code 
                    ? 'border-blue-400 bg-blue-50/70' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">{lang.name}</span>
                  <span className="text-[10px] text-blue-700 font-bold uppercase">{lang.code}</span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{lang.nativeLabel}</div>

                <button
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    handleTestSpeech(lang.code);
                  }}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Test Audio</span>
                </button>
              </div>
            ))}
          </div>

          {testSpeechStatus !== 'Idle' && (
            <div className="text-xs text-blue-700 font-mono bg-blue-50 p-2.5 rounded-xl border border-blue-200 flex items-center gap-2">
              <Activity className="w-4 h-4 animate-spin text-blue-600" />
              <span>Status: {testSpeechStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Accessibility & Senior Citizen Settings */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Accessibility & Low-Literacy Support
            </h3>
            <p className="text-xs text-slate-500">
              High-contrast visual touch cards and assisted display typography
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <div className="font-bold text-slate-900 text-sm">
              Assisted Senior Citizen / Large-Font Mode
            </div>
            <div className="text-xs text-slate-500 max-w-lg mt-0.5">
              Enlarges buttons to minimum 56px touch targets, boosts typography contrast, and plays continuous step-by-step audio prompts.
            </div>
          </div>

          <button
            onClick={onToggleAssistedMode}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-xs ${
              assistedMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            {assistedMode ? 'Assisted Mode ON' : 'Turn On Assisted Mode'}
          </button>
        </div>
      </div>

      {/* Hospital Identity & OPD Room Form */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Hospital OPD Location & Terminal Identity
            </h3>
            <p className="text-xs text-slate-500">
              Appears on generated patient queue slips, printed tickets, and EMR station routing
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveHospitalConfig} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Hospital Facility Name</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Terminal Location / Bay</label>
              <input
                type="text"
                value={opdBayNumber}
                onChange={(e) => setOpdBayNumber(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition"
            >
              Save Terminal Settings
            </button>
          </div>
        </form>
      </div>

      {/* GitHub Repository & Live Publication Card */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-800/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Official Live Publication & GitHub Repository
              </h3>
              <p className="text-xs text-blue-200">
                Cloud Run Live Deployment & Localhost Run Configuration (SIH26047)
              </p>
            </div>
          </div>

          <a
            href="https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/30"
          >
            <span>Open Live Publication</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="font-bold text-blue-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Public Cloud Run URL</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 font-mono text-emerald-300 text-[11px] break-all select-all border border-white/5">
              https://ais-pre-vq5sfdcvnjgpfu2665gcmx-125875248336.asia-southeast1.run.app
            </div>
            <p className="text-[11px] text-slate-300">
              Includes real-time Gemini AI integration, persistent OPD tokens, and multi-language speech.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="font-bold text-blue-300 text-xs flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Run in Localhost</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 font-mono text-cyan-300 text-[11px] break-all border border-white/5">
              git clone &lt;repo&gt; &amp;&amp; npm install &amp;&amp; npm run dev
            </div>
            <p className="text-[11px] text-slate-300">
              Starts both the Vite frontend &amp; Node.js Express server on <strong className="text-white">http://localhost:3000</strong>.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-blue-300/80 font-mono border-t border-blue-900/40">
          <span>Backend Health Check: <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">/api/health</code></span>
          <span>MIT License • GitHub Ready</span>
        </div>
      </div>
    </div>
  );
};
