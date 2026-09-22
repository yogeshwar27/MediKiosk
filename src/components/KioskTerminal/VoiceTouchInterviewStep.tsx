import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  AlertTriangle, 
  HeartPulse, 
  Volume2, 
  Sparkles, 
  Flame, 
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { PatientProfile, ChatMessage, SupportedLanguage } from '../../types';
import { 
  UI_STRINGS, 
  SUPPORTED_LANGUAGES,
  MULTILINGUAL_SYMPTOMS, 
  INITIAL_GREETINGS, 
  QUICK_CHIPS_BY_LANG, 
  speakText, 
  stopSpeaking 
} from '../../services/languageService';

interface VoiceTouchInterviewStepProps {
  patient: PatientProfile;
  language: SupportedLanguage;
  assistedMode: boolean;
  speechEnabled: boolean;
  onCompleteInterview: (messages: ChatMessage[], emergencyFlag: boolean, emergencyReason?: string) => void;
  onBack?: () => void;
}

export const VoiceTouchInterviewStep: React.FC<VoiceTouchInterviewStepProps> = ({
  patient,
  language,
  assistedMode,
  speechEnabled,
  onCompleteInterview,
  onBack,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const getInitialMessage = (lang: SupportedLanguage): ChatMessage => {
    const greetingGenerator = INITIAL_GREETINGS[lang] || INITIAL_GREETINGS.en;
    const initialText = greetingGenerator(patient.fullName);
    const chips = QUICK_CHIPS_BY_LANG[lang] || QUICK_CHIPS_BY_LANG.en;
    return {
      id: 'msg-1',
      sender: 'assistant',
      text: initialText,
      vernacularText: lang !== 'en' ? initialText : undefined,
      timestamp: 'Just now',
      quickChips: chips,
    };
  };

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage(language)]);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [painLevel, setPainLevel] = useState<number>(5);
  const [emergencyAlert, setEmergencyAlert] = useState<{ active: boolean; reason: string; action: string } | null>(null);
  const [audioWave, setAudioWave] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // When language changes, update the initial message if user hasn't started deep chat
  useEffect(() => {
    if (messages.length <= 1) {
      const newInitial = getInitialMessage(language);
      setMessages([newInitial]);
      if (speechEnabled) {
        speakText(newInitial.text, currentLangInfo.speechCode);
      }
    }
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  // Initial greeting speech
  useEffect(() => {
    if (speechEnabled && messages.length === 1) {
      speakText(messages[0].text, currentLangInfo.speechCode);
    }
    return () => {
      stopSpeaking();
    };
  }, []);

  // Web Speech API Initialization with current language speech code
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLangInfo.speechCode;

      recognition.onstart = () => {
        setIsListening(true);
        setAudioWave(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputVal(transcript);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition warning:', err);
        setIsListening(false);
        setAudioWave(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setAudioWave(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [language, currentLangInfo.speechCode]);

  const toggleVoiceRecording = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setAudioWave(false);
      if (inputVal.trim()) {
        handleSendMessage(inputVal);
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = currentLangInfo.speechCode;
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Speech start issue, falling back to simulation', e);
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setAudioWave(true);
    // Provide a sample voice phrase matching the selected symptom
    const sampleItem = MULTILINGUAL_SYMPTOMS[0];
    const picked = sampleItem.sampleInput[language] || sampleItem.sampleInput.en;
    setTimeout(() => {
      setInputVal(picked);
      setIsListening(false);
      setAudioWave(false);
    }, 1500);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputVal('');
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/ai/adaptive-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedHistory,
          currentInput: text,
          patientContext: {
            age: patient.age,
            gender: patient.gender,
            abhaNumber: patient.abhaNumber,
          },
          language: currentLangInfo.name,
        }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.nextQuestion || 'Please describe any other discomfort.',
        vernacularText: data.vernacularAudioText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        quickChips: data.quickTouchOptions || (QUICK_CHIPS_BY_LANG[language] || QUICK_CHIPS_BY_LANG.en),
        isEmergencyAlert: data.isEmergency,
        emergencyDetails: data.isEmergency ? {
          severity: data.emergencySeverity || 'CRITICAL',
          reason: data.emergencyReason || 'Immediate Medical Triage Needed',
          action: data.immediateAction || 'Transfer to Emergency Bay'
        } : undefined
      };

      setMessages((prev) => [...prev, botMsg]);

      // If voice enabled, speak the bot response in the target language
      if (speechEnabled) {
        const textToSpeak = botMsg.vernacularText || botMsg.text;
        speakText(textToSpeak, currentLangInfo.speechCode);
      }

      // Check Red-Flag
      if (data.isEmergency) {
        setEmergencyAlert({
          active: true,
          reason: data.emergencyReason || 'Critical red-flag symptom detected',
          action: data.immediateAction || 'Proceed to Room 102 Emergency Resuscitation'
        });
      }
    } catch (err) {
      console.error('Interview API error:', err);
      // Turn-aware client fallback to prevent repeating questions
      const userTurn = updatedHistory.filter(m => m.sender === 'user').length;
      
      const turnQuestions: Record<SupportedLanguage, string[]> = {
        en: [
          'Understood. How would you describe the discomfort — is it sharp, burning, cramping, or heavy pressure?',
          'Noted. Are you experiencing any other symptoms, such as fever, vomiting, dizziness, or shortness of breath?',
          'Got it. Have you taken any medications or painkillers for this, or does anything make it better or worse?',
          'I have recorded all your main symptoms. Would you like to scan your previous prescriptions or review your summary now?'
        ],
        hi: [
          'समझ गया। यह दर्द या तकलीफ किस तरह की है — जलन, चुभन, ऐंठन या भारीपन जैसा?',
          'ठीक है। क्या इसके साथ उल्टी, चक्कर, बुखार या सांस फूलने जैसी कोई अन्य समस्या भी है?',
          'नोट कर लिया गया है। क्या इसके लिए आपने पहले कोई दवा ली है? क्या खाने या आराम करने से कुछ फर्क पड़ता है?',
          'आपकी सभी मुख्य शिकायतें दर्ज कर ली गई हैं। क्या आपके पास पुरानी पर्ची या रिपोर्ट है?'
        ],
        te: [
          'అర్థమైంది. ఈ నొప్పి ఎలా ఉంది — మంటగా, పొడుస్తున్నట్లు, పట్టేసినట్లు లేదా బరువుగా ఉందా?',
          'సరే. దీనితో పాటు వాంతులు, తలతిరగడం, జ్వరం లేదా ఆయాసం లాంటి లక్షణాలు ఏమైనా ఉన్నాయా?',
          'నమోదు చేశాను. దీని కోసం మీరు ఏదైనా మందులు వేసుకున్నారా? విశ్రాంతి తీసుకుంటే తగ్గుతుందా?',
          'మీ పూర్తి వివరాలు నమోదయ్యాయి. మీ వద్ద పాత ప్రిస్క్రిప్షన్ లేదా ల్యాబ్ రిపోర్టులు ఉన్నాయా?'
        ],
        ta: [
          'புரிந்தது. இந்த வலி எந்த மாதிரியானது — எரிச்சல், குத்துவது, பிடிப்பு அல்லது பாரமாக உள்ளதா?',
          'சரி. இதனுடன் வாந்தி, தலைசுற்றல், காய்ச்சல் அல்லது மூச்சுத்திணறல் ஏதேனும் உள்ளதா?',
          'குறித்துக் கொண்டேன். இதற்காக முன்னதாக ஏதேனும் மாத்திரை சாப்பிட்டீர்களா?',
          'அனைத்து விவரங்களும் பதிவாகின. முந்தைய மருந்துச் சீட்டு அல்லது பரிசோதனை அறிக்கைகள் உள்ளதா?'
        ],
        bn: [
          'বুঝতে পেরেছি। ব্যথাটি কেমন ধরনের — জ্বালা, তীব্র খোঁচা, নাকি ভারী ভাব লাগছে?',
          'ঠিক আছে। এর সাথে কি বমি, মাথা ঘোरा, জ্বর বা শ্বাসকষ্টের মতো কোনো উপসর্গ আছে?',
          'নথিভুক্ত করা হয়েছে। এর জন্য আগে কোনো ওষুধ বা অ্যান্টাসিড খেয়েছেন কি?',
          'আপনার সব উপসর্গ লিপিবদ্ধ করা হয়েছে। আপনার কাছে কি পুরনো প্রেসক্রিপশন আছে?'
        ],
        mr: [
          'समजले. हा त्रास नेमका कसा वाटतो — जळजळ, टोचल्यासारखे, कळा येणे की जडपणा जाणवतो?',
          'ठीक आहे. यासोबत उलट्या, चक्कर, ताप किंवा श्वास घेण्यास त्रास होत आहे का?',
          'नोंद घेतली आहे. यासाठी आधी काही औषध किंवा गोळी घेतली आहे का?',
          'आपली संपूर्ण माहिती नोंदवली आहे. आपल्याकडे जुने प्रिस्क्रिप्शन किंवा रिपोर्ट आहेत का?'
        ],
        gu: [
          'સમજાયું. દુખાવો કેવો થાય છે — બળતરા થાય છે, ચૂંક આવે છે કે છાતીમાં ભારેપણું લાગે છે?',
          'ઠીક છે. સાથે ઉલ્ટી, ચક્કર, તાવ કે શ્વાસ લેવામાં તકલીફ જેવું કંઈ થાય છે?',
          'નોંધ કરી લીધી છે. આના માટે કોઈ દવા કે પેઈનકિલર લીધી છે?',
          'તમારી વિગતો નોંધી લેવાઈ છે. શું તમારી પાસે જૂની ફાઈલ કે દવાના કાગળો છે?'
        ],
        kn: [
          'ಅರ್ಥವಾಯಿತು. ನೋವು ಯಾವ ರೀತಿಯಲ್ಲಿದೆ — ಉರಿ, ಚುಚ್ಚುವಿಕೆ, ಸೆಳೆತ ಅಥವಾ ಎದೆಯಲ್ಲಿ ಭಾರವೆನಿಸುತ್ತಿದೆಯೇ?',
          'ಸರಿ. ಇದರೊಂದಿಗೆ ವಾಂತಿ, ತಲೆಸುತ್ತು, ಜ್ವರ ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಇದೆಯೇ?',
          'ದಾಖಲಿಸಲಾಗಿದೆ. ಇದಕ್ಕಾಗಿ ನೀವು ಯಾವುದಾದರೂ ಮಾತ್ರೆ ಅಥವಾ ಔಷಧ ತೆಗೆದುಕೊಂಡಿದ್ದೀರಾ?',
          'ನಿಮ್ಮ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ. ಹಿಂದಿನ ವೈದ್ಯರ ಚೀಟಿ ಅಥವಾ ಲ್ಯಾಬ್ ವರದಿಗಳು ಇವೆಯೇ?'
        ]
      };

      const langQuestions = turnQuestions[language] || turnQuestions.en;
      const questionIndex = Math.min(Math.max(0, userTurn - 1), langQuestions.length - 1);
      const nextQ = langQuestions[questionIndex];

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: nextQ,
        timestamp: 'Just now',
        quickChips: QUICK_CHIPS_BY_LANG[language] || QUICK_CHIPS_BY_LANG.en,
      };
      setMessages((prev) => [...prev, botMsg]);
      if (speechEnabled) {
        speakText(nextQ, currentLangInfo.speechCode);
      }
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleQuickSymptomTap = (symptomItem: typeof MULTILINGUAL_SYMPTOMS[0]) => {
    const text = symptomItem.sampleInput[language] || symptomItem.labels[language] || symptomItem.labels.en;
    handleSendMessage(text);
  };

  const handleFinishAndProceed = () => {
    stopSpeaking();
    const hasEmergency = messages.some(m => m.isEmergencyAlert) || emergencyAlert?.active;
    onCompleteInterview(
      messages, 
      !!hasEmergency, 
      emergencyAlert?.reason || (hasEmergency ? 'Emergency symptom flagged during interview' : undefined)
    );
  };

  return (
    <div className="space-y-6">
      {/* Emergency Red Flag High-Priority Banner */}
      {emergencyAlert && emergencyAlert.active && (
        <div className="p-4 bg-red-600 text-white rounded-2xl shadow-lg border-2 border-red-400 animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white text-red-600 rounded-xl font-bold">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <div className="font-extrabold text-lg flex items-center gap-2">
                <span>{t.emergencyNotice}</span>
                <span className="bg-white text-red-700 text-xs px-2.5 py-0.5 rounded-full font-black">
                  PRIORITY P1
                </span>
              </div>
              <p className="text-sm text-red-100 font-medium">
                {emergencyAlert.reason}
              </p>
              <p className="text-xs text-amber-200 mt-0.5 font-bold">
                ➔ Action: {emergencyAlert.action}
              </p>
            </div>
          </div>
          <button
            onClick={handleFinishAndProceed}
            className="bg-white hover:bg-slate-100 text-red-700 font-extrabold px-5 py-3 rounded-xl shadow-md text-sm whitespace-nowrap active:scale-95 transition"
          >
            Issue Emergency Bypass Token ➔
          </button>
        </div>
      )}

      {/* Main Kiosk Dual Voice + Touch Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive AI Clinical Interview Chat */}
        <div className="lg:col-span-2 bg-white/95 backdrop-blur-md rounded-2xl border border-blue-100 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Interview Header */}
          <div className="p-4 border-b border-blue-100 bg-blue-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>{t.caseTaking}</span>
                  <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                    {currentLangInfo.nativeLabel} ({currentLangInfo.name})
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {patient.fullName} • {patient.age}Y, {patient.gender} • ABHA: {patient.abhaNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  onClick={() => {
                    stopSpeaking();
                    onBack();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                  title="Back to Step 1 (ABHA Login)"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.backBtn}</span>
                </button>
              )}
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-100/80 text-blue-900 border border-blue-200">
                {t.touchVoiceNote}
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-xs relative group ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : m.isEmergencyAlert
                      ? 'bg-red-50 border-2 border-red-300 text-slate-900 rounded-bl-xs'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                  } ${assistedMode ? 'text-lg p-5' : 'text-sm'}`}
                >
                  {m.isEmergencyAlert && (
                    <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase mb-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Critical Triage Red-Flag</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <p className="leading-relaxed font-medium">
                      {m.text}
                    </p>
                    {/* Speak Button for accessibility */}
                    {m.sender === 'assistant' && (
                      <button
                        onClick={() => speakText(m.vernacularText || m.text, currentLangInfo.speechCode)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-md bg-blue-50 shrink-0"
                        title={t.audioListenBtn}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {m.vernacularText && m.vernacularText !== m.text && (
                    <p className="text-xs text-blue-900 bg-blue-50/90 p-2.5 rounded-lg mt-2 border border-blue-100 font-medium">
                      🗣️ {m.vernacularText}
                    </p>
                  )}

                  <div
                    className={`text-[10px] mt-1.5 ${
                      m.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {/* Quick Touch Response Pills in selected language */}
                {m.quickChips && m.quickChips.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[85%]">
                    {m.quickChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition active:scale-95 flex items-center gap-1 ${
                          assistedMode 
                            ? 'text-sm px-4 py-2 bg-white hover:bg-blue-50 border-blue-300 text-blue-900 shadow-xs' 
                            : 'bg-white hover:bg-blue-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-900'
                        }`}
                      >
                        <span>👆</span>
                        <span>{chip}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-slate-600 text-xs bg-white p-3 rounded-xl border border-blue-100 w-fit shadow-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>MediKiosk clinical engine analyzing in {currentLangInfo.name}...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Bottom Dual Input Bar (Voice Button + Text/Touch) */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2">
            {/* Real-time Voice Recording Indicator */}
            {isListening && (
              <div className="flex items-center justify-between bg-blue-50 text-blue-800 px-3.5 py-2.5 rounded-xl border border-blue-200 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                  <span>{t.listening} ({currentLangInfo.nativeLabel} / {currentLangInfo.name})</span>
                </div>
                <div className="flex items-center gap-1">
                  {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-600 rounded-full animate-bounce"
                      style={{ height: `${h * 0.22}px`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Big Voice Mic Button */}
              <button
                onClick={toggleVoiceRecording}
                className={`p-4 rounded-xl flex items-center justify-center font-bold transition shadow-sm active:scale-95 shrink-0 ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                }`}
                title={isListening ? t.stopSpeaking : t.tapToSpeak}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* Text / Touch Input field */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    isListening
                      ? `${t.speakNow} (${currentLangInfo.name})`
                      : `${t.speakNow} / Type your symptoms...`
                  }
                  className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium ${
                    assistedMode ? 'text-lg' : 'text-sm'
                  }`}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputVal.trim()}
                className="p-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Big Touch Symptom Grid & Pain Level Slider */}
        <div className="space-y-5">
          {/* Quick Touch Symptom Grid in selected language */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-blue-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.orTapOptions}</span>
              </h4>
              <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                1-Tap Intake
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Select your chief complaint directly:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {MULTILINGUAL_SYMPTOMS.map((tile) => {
                const label = tile.labels[language] || tile.labels.en;
                return (
                  <button
                    key={tile.id}
                    onClick={() => handleQuickSymptomTap(tile)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1 group active:scale-95 ${
                      tile.isCritical
                        ? 'border-red-200 bg-red-50/60 hover:bg-red-100/70 hover:border-red-400'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-blue-50 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl group-hover:scale-110 transition">{tile.icon}</span>
                      {tile.isCritical && (
                        <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                          Red-Flag
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">
                      {label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Wong-Baker Pain Rating Scale (1 to 10) */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-blue-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.painScaleLabel}</span>
              </h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                painLevel >= 8 ? 'bg-red-100 text-red-800' : painLevel >= 5 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {painLevel} / 10
              </span>
            </div>

            <div className="flex items-center justify-between text-2xl py-1">
              <span title="No Pain (0-2)" className={painLevel <= 2 ? 'scale-125 transition' : 'opacity-40'}>😊</span>
              <span title="Mild (3-4)" className={painLevel >= 3 && painLevel <= 4 ? 'scale-125 transition' : 'opacity-40'}>🙂</span>
              <span title="Moderate (5-6)" className={painLevel >= 5 && painLevel <= 6 ? 'scale-125 transition' : 'opacity-40'}>😐</span>
              <span title="Severe (7-8)" className={painLevel >= 7 && painLevel <= 8 ? 'scale-125 transition' : 'opacity-40'}>😣</span>
              <span title="Critical / Worst (9-10)" className={painLevel >= 9 ? 'scale-125 transition' : 'opacity-40'}>😭</span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />

            <button
              onClick={() => {
                const painText = language === 'hi' 
                  ? `मेरे दर्द का स्तर 10 में से ${painLevel} है।`
                  : language === 'te'
                  ? `నా నొప్పి తీవ్రత 10 కి ${painLevel} గా ఉంది.`
                  : `My pain severity score is ${painLevel} out of 10.`;
                handleSendMessage(painText);
              }}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl transition border border-blue-200"
            >
              Record Pain Score: {painLevel}/10
            </button>
          </div>

          {/* Finish & Move to Document / Prescription OCR step */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
            <div className="text-xs text-blue-900 font-semibold flex items-center justify-between">
              <span>Step 2 of 5 Completed</span>
              <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-[11px]">
                {messages.filter(m => m.sender === 'user').length} answers
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  onClick={() => {
                    stopSpeaking();
                    onBack();
                  }}
                  className="py-3.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.backBtn}</span>
                </button>
              )}
              <button
                onClick={handleFinishAndProceed}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm active:scale-95 transition"
              >
                <span>{t.continueBtn}: {t.reportScan}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
