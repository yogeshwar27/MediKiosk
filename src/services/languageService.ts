import { LanguageInfo, SupportedLanguage, ChatMessage } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeLabel: 'English',
    greeting: 'Welcome to MediKiosk. Please tap your option or speak into the microphone to begin.',
    speechCode: 'en-IN',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeLabel: 'हिन्दी',
    greeting: 'मेडीकियोस्क में आपका स्वागत है। अपनी परेशानी बोलें या स्क्रीन पर विकल्पों को छुएं।',
    speechCode: 'hi-IN',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeLabel: 'తెలుగు',
    greeting: 'మెడికియోస్క్‌కు స్వాగతం. మీ సమస్యను మైక్రోఫోన్‌లో మాట్లాడండి లేదా స్క్రీన్‌పై తాకండి.',
    speechCode: 'te-IN',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeLabel: 'தமிழ்',
    greeting: 'மெடிகியோஸ்க்கிற்கு வரவேற்கிறோம். பேசவும் அல்லது திரையில் உள்ள தேர்வுகளைத் தொடவும்.',
    speechCode: 'ta-IN',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeLabel: 'বাংলা',
    greeting: 'মেডিকিয়স্কে স্বাগতম। আপনার সমস্যা মুখে বলুন অথবা স্ক্রিনে স্পর্শ করুন।',
    speechCode: 'bn-IN',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeLabel: 'मराठी',
    greeting: 'मेडीकियोस्कमध्ये आपले स्वागत आहे. बोला किंवा स्क्रीनवरील पर्यायांवर स्पर्श करा.',
    speechCode: 'mr-IN',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeLabel: 'ગુજરાતી',
    greeting: 'મેડિકિયોસ્કમાં સ્વાગત છે. તમારી તકલીફ બોલો અથવા સ્ક્રીન પર સ્પર્શ કરો.',
    speechCode: 'gu-IN',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    greeting: 'ಮೆಡಿಕಿಯೊಸ್ಕ್‌ಗೆ ಸುಸ್ವಾಗತ. ಮಾತನಾಡಿ ಅಥವಾ ಪರದೆಯ ಮೇಲಿನ ಆಯ್ಕೆಗಳನ್ನು ಸ್ಪರ್ಶಿಸಿ.',
    speechCode: 'kn-IN',
  },
];

export interface LocalizedSymptom {
  id: string;
  labels: Record<SupportedLanguage, string>;
  icon: string;
  isCritical: boolean;
  sampleInput: Record<SupportedLanguage, string>;
}

export const MULTILINGUAL_SYMPTOMS: LocalizedSymptom[] = [
  {
    id: 'chest-pain',
    icon: '🫀',
    isCritical: true,
    labels: {
      en: 'Chest Pain / Tightness',
      hi: 'सीने में दर्द / भारीपन',
      te: 'ఛాతీలో నొప్పి / బరువు',
      ta: 'மார்பு வலி / இறுக்கம்',
      bn: 'বুকে ব্যথা / অস্বস্তি',
      mr: 'छातीत दुखणे / जडपणा',
      gu: 'છાતીમાં દુખાવો / ભીંસ',
      kn: 'ಎದೆಯಲ್ಲಿ ನೋವು / ಬಿಗಿತ',
    },
    sampleInput: {
      en: 'I have severe chest pain and pressure radiating to my left arm.',
      hi: 'मुझे सीने में तेज दर्द और भारीपन हो रहा है जो बाएं हाथ तक जा रहा है।',
      te: 'నాకు ఛాతీలో తీవ్రమైన నొప్పి మరియు ఎడమ చేతికి వ్యాపించే బరువుగా ఉంది.',
      ta: 'எனக்கு கடுமையான மார்பு வலி மற்றும் இடது கையில் அழுத்தம் உள்ளது.',
      bn: 'আমার বুকে তীব্র ব্যথা এবং বাঁ হাতে চাপ অনুভূত হচ্ছে।',
      mr: 'मला छातीत तीव्र कळ आणि डाव्या हातात वेदना जाणवत आहेत.',
      gu: 'મને છાતીમાં ખૂબ દુખાવો થાય છે અને ડાબા હાથમાં ખેંચાણ થાય છે.',
      kn: 'ನನಗೆ ಎದೆಯಲ್ಲಿ ತೀವ್ರ ನೋವು ಮತ್ತು ಎಡಗೈಗೆ ಹರಡುವ ಬಿಗಿತವಿದೆ.',
    }
  },
  {
    id: 'breathless',
    icon: '🫁',
    isCritical: true,
    labels: {
      en: 'Shortness of Breath',
      hi: 'सांस लेने में तकलीफ',
      te: 'శ్వాస తీసుకోవడంలో ఇబ్బంది',
      ta: 'மூச்சுத் திணறல்',
      bn: 'শ্বাসকষ্ট / হাঁপ ধরা',
      mr: 'श्वास घेण्यास त्रास',
      gu: 'શ્વાસ લેવામાં તકલીફ',
      kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ',
    },
    sampleInput: {
      en: 'I feel breathless even when sitting and resting.',
      hi: 'मुझे बैठे रहने पर भी सांस फूलने की समस्या हो रही है।',
      te: 'కూర్చున్నప్పుడు కూడా నాకు శ్వాస తీసుకోవడం కష్టంగా ఉంది.',
      ta: 'அமர்ந்திருக்கும் போதும் எனக்கு மூச்சுத் திணறல் ஏற்படுகிறது.',
      bn: 'বসে থাকলেও আমার শ্বাস নিতে খুব কষ্ট হচ্ছে।',
      mr: 'बसलेले असतानाही मला धाप लागत आहे आणि दम लागतोय.',
      gu: 'બેઠા હોવા છતાં મને શ્વાસ ચઢી જાય છે.',
      kn: 'ಕುಳಿತಿರುವಾಗಲೂ ನನಗೆ ಉಸಿರಾಟ ಕಷ್ಟವಾಗುತ್ತಿದೆ.',
    }
  },
  {
    id: 'fever',
    icon: '🌡️',
    isCritical: false,
    labels: {
      en: 'High Fever & Chills',
      hi: 'तेज बुखार और कंपकंपी',
      te: 'తీవ్ర జ్వరం & చలి',
      ta: 'கடுமையான காய்ச்சல் & நடுக்கம்',
      bn: 'তীব্র জ্বর ও কাঁপুনি',
      mr: 'ताप आणि थंडी वाजणे',
      gu: 'તીવ્ર તાવ અને ધ્રુજારી',
      kn: 'ತೀವ್ರ ಜ್ವರ ಮತ್ತು ಚಳಿ',
    },
    sampleInput: {
      en: 'I have high fever with shivering since yesterday evening.',
      hi: 'मुझे कल शाम से कंपकंपी के साथ तेज बुखार है।',
      te: 'నిన్న సాయంత్రం నుండి నాకు చలితో కూడిన తీవ్ర జ్వరం ఉంది.',
      ta: 'நேற்று மாலை முதல் நடுக்கத்துடன் கூடிய அதிக காய்ச்சல் உள்ளது.',
      bn: 'গতকাল সন্ধ্যা থেকে কাঁপুনি দিয়ে তেজ জ্বর এসেছে।',
      mr: 'काल संध्याकाळपासून मला थंडी वाजून जोरात ताप येत आहे.',
      gu: 'ગઈકાલ સાંજથી મને ધ્રુજારી સાથે સખત તાવ આવે છે.',
      kn: 'ನಿನ್ನೆ ಸಂಜೆಯಿಂದ ನನಗೆ ಚಳಿಯೊಂದಿಗೆ ತೀವ್ರ ಜ್ವರವಿದೆ.',
    }
  },
  {
    id: 'headache',
    icon: '🤕',
    isCritical: false,
    labels: {
      en: 'Severe Headache / Dizziness',
      hi: 'सिरदर्द / चक्कर आना',
      te: 'తీవ్ర తలనొప్పి / తలతిరగడం',
      ta: 'கடும் தலைவலி / தலைசுற்றல்',
      bn: 'মারাত্মক মাথা ব্যথা / মাথা ঘোরা',
      mr: 'तीव्र डोकेदुखी / चक्कर',
      gu: 'સખત માથાનો દુખાવો / ચક્કર',
      kn: 'ತೀವ್ರ ತಲೆನೋವು / ತಲೆತಿರುಗುವಿಕೆ',
    },
    sampleInput: {
      en: 'Throbbing headache and dizziness when standing up.',
      hi: 'खड़े होने पर तेज सिरदर्द और चक्कर आ रहे हैं।',
      te: 'నిలబడినప్పుడు విపరీతమైన తలనొప్పి మరియు తలతిరుగుతోంది.',
      ta: 'எழுந்து நிற்கும் போது கடுமையான தலைவலியும் மயக்கமும் ஏற்படுகிறது.',
      bn: 'উঠে দাঁড়ালে মাথা ঘুরছে এবং তীব্র মাথা যন্ত্রণা করছে।',
      mr: 'उभे राहिल्यावर खूप डोके दुखते आणि चक्कर येते.',
      gu: 'ઊભા થતાં જ સખત માથું દુખે છે અને ચક્કર આવે છે.',
      kn: 'ಎದ್ದು ನಿಂತಾಗ ತೀವ್ರ ತಲೆನೋವು ಮತ್ತು ತಲೆತಿರುಗುವಿಕೆ ಉಂಟಾಗುತ್ತದೆ.',
    }
  },
  {
    id: 'stomach',
    icon: '🤢',
    isCritical: false,
    labels: {
      en: 'Stomach Pain / Acidity',
      hi: 'पेट दर्द / जलन व गैस',
      te: 'కడుపు నొప్పి / గ్యాస్ & ఎసిడిటీ',
      ta: 'வயிற்று வலி / நெஞ்செரிச்சல்',
      bn: 'পেটে ব্যথা / অম্লতা ও গ্যাস',
      mr: 'पोटदुखी / पित्त व जळजळ',
      gu: 'પેટમાં દુખાવો / એસિડિટી',
      kn: 'ಹೊಟ್ಟೆ ನೋವು / ಅಸಿಡಿಟಿ',
    },
    sampleInput: {
      en: 'Severe upper abdominal burning pain after eating.',
      hi: 'खाना खाने के बाद पेट के ऊपरी हिस्से में तेज जलन और दर्द होता है।',
      te: 'ఆహారం తిన్న తర్వాత పై కడుపులో తీవ్రమైన మంట మరియు నొప్పి వస్తోంది.',
      ta: 'சாப்பிட்ட பிறகு மேல் வயிற்றில் கடுமையான எரிச்சலும் வலியும் உள்ளது.',
      bn: 'খাওয়ার পর পেটের ওপরের অংশে প্রচণ্ড জ্বালা ও ব্যথা হচ্ছে।',
      mr: 'जेवणानंतर पोटाच्या वरच्या भागात तीव्र जळजळ व दुखणे होते.',
      gu: 'જમ્યા પછી પેટમાં ઉપરના ભાગે ભારે બળતરા અને દુખાવો થાય છે.',
      kn: 'ಊಟದ ನಂತರ ಮೇಲ್ಹೊಟ್ಟೆಯಲ್ಲಿ ತೀವ್ರ ಉರಿ ಮತ್ತು ನೋವು ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ.',
    }
  },
  {
    id: 'cough',
    icon: '🤧',
    isCritical: false,
    labels: {
      en: 'Persistent Cough & Cold',
      hi: 'लगातार खांसी और जुकाम',
      te: 'ఎడతెగని దగ్గు & జలుబు',
      ta: 'தொடர் இருமல் & சளி',
      bn: 'ক্রমাগত কাশি ও সর্দি',
      mr: 'सतत खोकला आणि सर्दी',
      gu: 'સતત ખાંસી અને શરદી',
      kn: 'ನಿರಂತರ ಕೆಮ್ಮು ಮತ್ತು ಶೀತ',
    },
    sampleInput: {
      en: 'Dry hacking cough for more than two weeks.',
      hi: 'दो सप्ताह से ज्यादा समय से सूखी खांसी आ रही है।',
      te: 'రెండు వారాలకు పైగా పొడి దగ్గు వేధిస్తోంది.',
      ta: 'இரண்டு வாரங்களுக்கும் மேலாக வறட்டு இருமல் உள்ளது.',
      bn: 'দুই সপ্তাহেরও বেশি সময় ধরে খুসখুসে কাশি হচ্ছে।',
      mr: 'दोन आठवड्यांपेक्षा जास्त काळ कोरडा खोकला येत आहे.',
      gu: 'બે અઠવાડિયાથી વધુ સમયથી સૂકી ઉધરસ આવે છે.',
      kn: 'ಎರಡು ವಾರಗಳಿಂದ ಒಣ ಕೆಮ್ಮು ಕಾಡುತ್ತಿದೆ.',
    }
  },
  {
    id: 'joint',
    icon: '🦵',
    isCritical: false,
    labels: {
      en: 'Joint / Knee Pain',
      hi: 'जोड़ों / घुटने में दर्द',
      te: 'కీళ్ల / మోకాళ్ల నొప్పి',
      ta: 'மூட்டு / முழங்கால் வலி',
      bn: 'গাঁটে বা হাঁটুর ব্যথা',
      mr: 'सांधेदुखी / गुडघेदुखी',
      gu: 'સાંધા / ઘૂંટણનો દુખાવો',
      kn: 'ಕೀಲು / ಮೊಣಕಾಲು ನೋವು',
    },
    sampleInput: {
      en: 'Severe knee pain making it difficult to walk or climb stairs.',
      hi: 'घुटनों में बहुत दर्द है जिससे चलने और सीढ़ियां चढ़ने में परेशानी होती है।',
      te: 'మోకాళ్ల నొప్పితో నడవలేకపోతున్నాను, మెట్లు ఎక్కడం కష్టంగా ఉంది.',
      ta: 'முழங்கால் வலியால் நடக்கவோ படிக்கட்டுகளில் ஏறவோ முடியவில்லை.',
      bn: 'হাঁটুর ব্যথার কারণে হাঁটতে বা সিঁড়ি উঠতে দারুণ কষ্ট হচ্ছে।',
      mr: 'गुडघेदुखीमुळे चालणे आणि जिने चढणे कठीण झाले आहे.',
      gu: 'ઘૂંટણમાં ખૂબ દુખાવો થવાથી ચાલવામાં અને સીડી ચઢવામાં મુશ્કેલી પડે છે.',
      kn: 'ಮೊಣಕಾಲು ನೋವಿನಿಂದಾಗಿ ನಡೆಯಲು ಮತ್ತು ಮೆಟ್ಟಿಲು ಹತ್ತಲು ತೊಂದರೆಯಾಗಿದೆ.',
    }
  },
  {
    id: 'diabetes',
    icon: '🩸',
    isCritical: false,
    labels: {
      en: 'Diabetes & BP Routine Checkup',
      hi: 'शुगर और बीपी की नियमित जांच',
      te: 'షుగర్ మరియు బీపీ సాధారణ పరీక్ష',
      ta: 'நீரிழிவு & ரத்த அழுத்த வழக்கமான பரிசோதனை',
      bn: 'ডায়াবেটিস ও রক্তচাপের রুটিন পরীক্ষা',
      mr: 'मधुमेह आणि रक्तदाब नियमित तपासणी',
      gu: 'ડાયાબિટીસ અને બીપી નિયમિત તપાસ',
      kn: 'ಮಧುಮೇಹ ಮತ್ತು ರಕ್ತದೊತ್ತಡ ನಿಯಮಿತ ತಪಾಸಣೆ',
    },
    sampleInput: {
      en: 'Routine follow-up for diabetes and high blood pressure refill.',
      hi: 'डायबिटीज और हाई बीपी की नियमित जांच और दवा का पर्चा रिन्यू कराना है।',
      te: 'షుగర్ మరియు హై బీపీ నియమిత తనిఖీ మరియు మందుల పునరుద్ధరణ కోసం వచ్చాను.',
      ta: 'சர்க்கரை நோய் மற்றும் ரத்த அழுத்த மாத்திரை பரிசோதனைக்காக வந்துள்ளேன்.',
      bn: 'ডায়াবেটিস ও উচ্চ রক্তচাপের নিয়মিত চেকআপ এবং ওষুধ পুনর্নবীকরণের জন্য এসেছি।',
      mr: 'मधुमेह आणि रक्तदाबाची नियमित तपासणी आणि औषधे घेण्यासाठी आलो आहे.',
      gu: 'ડાયાબિટીસ અને હાઈ બ્લડ પ્રેશરની નિયમિત તપાસ માટે આવ્યા છીએ.',
      kn: 'ಮಧುಮೇಹ ಮತ್ತು ರಕ್ತದೊತ್ತಡದ ನಿಯಮಿತ ತಪಾಸಣೆಗಾಗಿ ಬಂದಿದ್ದೇನೆ.',
    }
  },
];

export const UI_STRINGS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    hospitalOpd: 'Smart Hospital OPD System',
    kioskMode: 'Patient Kiosk Terminal',
    doctorMode: 'Doctor Clinical Brief (EMR)',
    triageMode: 'OPD Flow & Triage',
    abdmMode: 'ABDM Health Records',
    touchVoiceNote: 'Respond via Voice or Touch Screen',
    speakNow: 'Speak now into microphone...',
    listening: 'Listening to your voice...',
    tapToSpeak: 'Tap to Speak (Voice)',
    stopSpeaking: 'Stop & Submit Voice',
    orTapOptions: 'Or tap an option below:',
    emergencyNotice: 'Emergency Alert: High Priority Medical Case Detected',
    fastTrackGranted: 'P1 Red-Flag Fast Track Pass Issued',
    proceedToDoc: 'Please proceed directly to Emergency Counter / Room 102',
    abhaLogin: 'Step 1: ABHA / Aadhaar Verification',
    caseTaking: 'Step 2: Adaptive Voice & Touch Intake',
    reportScan: 'Step 3: Document & Prescription OCR',
    summaryTitle: 'Step 4: Intake & Records Summary',
    tokenSlip: 'Step 5: OPD Consultation Pass',
    scanPrescriptionTitle: 'Upload or Scan Past Prescriptions / Reports',
    noRepeatedTests: 'Chronological timeline prevents repeat diagnostic tests',
    doctorSummaryReady: 'Doctor receives structured clinical notes before consultation',
    continueBtn: 'Continue to Next Step',
    backBtn: 'Back',
    confirmAndToken: 'Confirm & Generate OPD Token',
    audioListenBtn: 'Listen in Selected Language',
    painScaleLabel: 'Select Your Pain / Discomfort Severity:',
    painMild: 'Mild (1-3)',
    painModerate: 'Moderate (4-6)',
    painSevere: 'Severe (7-9)',
    painEmergency: 'Unbearable / Critical (10)',
    abhaInputLabel: 'Enter 14-digit ABHA Number or Mobile',
    consentCheckbox: 'I give consent to share health history for OPD consultation (DPDP Act compliant)',
    verifyOtp: 'Verify OTP & Link Records',
    sampleProfiles: 'Quick Demo Profiles:',
    timelineTitle: 'Chronological Clinical Records',
    verifiedChiefComplaints: 'Verified Chief Complaints',
    activeMedsTitle: 'Active Prescribed Medications',
    allergiesTitle: 'Known Allergies & Warnings',
    printPass: 'Print OPD Slip',
    nextPatient: 'Start Next Patient Intake',
  },
  hi: {
    hospitalOpd: 'स्मार्ट अस्पताल ओपीडी प्रणाली',
    kioskMode: 'रोगी कियोस्क टर्मिनल',
    doctorMode: 'डॉक्टर क्लिनिकल सारांश (EMR)',
    triageMode: 'ओपीडी प्रवाह और ट्राइएज',
    abdmMode: 'आभा स्वास्थ्य रिकॉर्ड',
    touchVoiceNote: 'आवाज़ द्वारा बोलें या टच स्क्रीन पर छुएं',
    speakNow: 'अब माइक में बोलें...',
    listening: 'आपकी आवाज़ सुनी जा रही है...',
    tapToSpeak: 'बोलने के लिए दबाएं (आवाज़ इनपुट)',
    stopSpeaking: 'रोकें और सबमिट करें',
    orTapOptions: 'या नीचे दिए विकल्पों को छुएं:',
    emergencyNotice: 'आपातकालीन सूचना: गंभीर स्वास्थ्य जोखिम पहचाना गया',
    fastTrackGranted: 'P1 रेड-फ्लैग फास्ट-ट्रैक पास जारी',
    proceedToDoc: 'कृपया तुरंत आपातकालीन काउंटर / कक्ष 102 पर जाएं',
    abhaLogin: 'चरण 1: आभा / आधार सत्यापन',
    caseTaking: 'चरण 2: आवाज़ और टच द्वारा समस्या विवरण',
    reportScan: 'चरण 3: पुराने पर्चे और रिपोर्ट स्कैन',
    summaryTitle: 'चरण 4: जांच व पुराने रिकॉर्ड का सारांश',
    tokenSlip: 'चरण 5: ओपीडी परामर्श टोकन व पर्ची',
    scanPrescriptionTitle: 'पुराने पर्चे या लैब रिपोर्ट स्कैन करें',
    noRepeatedTests: 'पुराना रिकॉर्ड होने से दोबारा जांच कराने का खर्च और समय बचता है',
    doctorSummaryReady: 'डॉक्टर के पास मरीज के पहुंचने से पहले तैयार सारांश उपलब्ध',
    continueBtn: 'अगले चरण पर जाएं',
    backBtn: 'पीछे जाएं',
    confirmAndToken: 'पुष्टि करें और ओपीडी टोकन प्राप्त करें',
    audioListenBtn: 'चुनी गई भाषा में सुनें',
    painScaleLabel: 'अपनी परेशानी या दर्द का स्तर चुनें:',
    painMild: 'हल्का (1-3)',
    painModerate: 'मध्यम (4-6)',
    painSevere: 'तेज दर्द (7-9)',
    painEmergency: 'असहनीय / गंभीर (10)',
    abhaInputLabel: '14 अंकों का आभा नंबर या मोबाइल दर्ज करें',
    consentCheckbox: 'मैं ओपीडी परामर्श हेतु स्वास्थ्य इतिहास साझा करने की सहमति देता/देती हूँ',
    verifyOtp: 'ओटीपी सत्यापित करें',
    sampleProfiles: 'त्वरित डेमो प्रोफाइल:',
    timelineTitle: 'पिछला स्वास्थ्य रिकॉर्ड (समय अनुसार)',
    verifiedChiefComplaints: 'सत्यापित मुख्य लक्षण',
    activeMedsTitle: 'वर्तमान में चल रही दवाइयाँ',
    allergiesTitle: 'एलर्जी और चेतावनियाँ',
    printPass: 'ओपीडी पर्ची प्रिंट करें',
    nextPatient: 'अगले मरीज का पंजीकरण शुरू करें',
  },
  te: {
    hospitalOpd: 'స్మార్ట్ హాస్పిటల్ ఓపీడీ వ్యవస్థ',
    kioskMode: 'పేషెంట్ కియోస్క్ టెర్మినల్',
    doctorMode: 'డాక్టర్ క్లినికల్ సారాంశం (EMR)',
    triageMode: 'ఓపీడీ ప్రవాహం & ట్రయాజ్',
    abdmMode: 'ఆభా హెల్త్ రికార్డ్స్',
    touchVoiceNote: 'వాయిస్ ద్వారా మాట్లాడండి లేదా స్క్రీన్‌పై తాకండి',
    speakNow: 'ఇప్పుడు మైక్రోఫోన్‌లో మాట్లాడండి...',
    listening: 'మీ వాయిస్ వింటున్నాము...',
    tapToSpeak: 'మాట్లాడటానికి నొక్కండి (వాయిస్)',
    stopSpeaking: 'ఆపి సబ్మిట్ చేయండి',
    orTapOptions: 'లేదా కింద ఉన్న ఎంపికలను తాకండి:',
    emergencyNotice: 'అత్యవసర హెచ్చరిక: తీవ్రమైన ఆరోగ్య సమస్య గుర్తించబడింది',
    fastTrackGranted: 'P1 రెడ్ ఫ్లాగ్ ఫాస్ట్ ట్రాక్ పాస్ జారీ చేయబడింది',
    proceedToDoc: 'దయచేసి నేరుగా ఎమర్జెన్సీ కౌంటర్ / గది 102 కి వెళ్లండి',
    abhaLogin: 'దశ 1: ఆభా / ఆధార్ ధృవీకరణ',
    caseTaking: 'దశ 2: వాయిస్ మరియు టచ్ కేస్ టేకింగ్',
    reportScan: 'దశ 3: పాత ప్రిస్క్రిప్షన్ & రిపోర్ట్ ఓసీఆర్',
    summaryTitle: 'దశ 4: ఇన్టేక్ & రికార్డుల సారాంశం',
    tokenSlip: 'దశ 5: ఓపీడీ కన్సల్టేషన్ టోకెన్ పాస్',
    scanPrescriptionTitle: 'పాత ప్రిస్క్రిప్షన్లు లేదా రిపోర్టులను స్కాన్ చేయండి',
    noRepeatedTests: 'పాత రికార్డుల వల్ల అనవసరమైన రీ-టెస్టులు తప్పుతాయి',
    doctorSummaryReady: 'కన్సల్టేషన్‌కు ముందే డాక్టర్‌కు పూర్తి సారాంశం సిద్ధంగా ఉంటుంది',
    continueBtn: 'తదుపరి దశకు వెళ్లండి',
    backBtn: 'వెనుకకు',
    confirmAndToken: 'నిర్ధారించి ఓపీడీ టోకెన్ పొందండి',
    audioListenBtn: 'ఎంచుకున్న భాషలో వినండి',
    painScaleLabel: 'మీ నొప్పి లేదా అసౌకర్య తీవ్రతను ఎంచుకోండి:',
    painMild: 'తేలికపాటి (1-3)',
    painModerate: 'మధ్యస్థం (4-6)',
    painSevere: 'తీవ్రమైనది (7-9)',
    painEmergency: 'భరించలేనిది / అత్యవసరం (10)',
    abhaInputLabel: '14 అంకెల ఆభా సంఖ్య లేదా మొబైల్ నమోదు చేయండి',
    consentCheckbox: 'ఓపీడీ సంప్రదింపుల కోసం ఆరోగ్య సమాచారాన్ని పంచుకోవడానికి అంగీకరిస్తున్నాను',
    verifyOtp: 'ఓటీపీ ధృవీకరించండి',
    sampleProfiles: 'డెమో ప్రొఫైల్స్:',
    timelineTitle: 'గత ఆరోగ్య రికార్డుల చరిత్ర',
    verifiedChiefComplaints: 'ధృవీకరించబడిన ప్రధాన లక్షణాలు',
    activeMedsTitle: 'ప్రస్తుతం వాడుతున్న మందులు',
    allergiesTitle: 'అలెర్జీలు & హెచ్చరికలు',
    printPass: 'ఓపీడీ స్లిప్ ప్రింట్ చేయండి',
    nextPatient: 'తదుపరి రోగి ప్రారంభించండి',
  },
  ta: {
    hospitalOpd: 'ஸ்மார்ட் மருத்துவமனை ஓபிடி அமைப்பு',
    kioskMode: 'நோயாளி கியோஸ்க் முனையம்',
    doctorMode: 'மருத்துவர் மருத்துவ சுருக்கம் (EMR)',
    triageMode: 'ஓபிடி வரிசை & ட்ரையேஜ்',
    abdmMode: 'ஆபா மருத்துவ ஆவணங்கள்',
    touchVoiceNote: 'குரல் வழியாக பேசவும் அல்லது திரையைத் தொடவும்',
    speakNow: 'இப்போது மைக்ரோஃபோனில் பேசவும்...',
    listening: 'உங்கள் குரலைக் கேட்கிறது...',
    tapToSpeak: 'பேச தட்டவும் (குரல் உள்ளீடு)',
    stopSpeaking: 'நிறுத்தி சமர்ப்பிக்கவும்',
    orTapOptions: 'அல்லது கீழே உள்ள தேர்வுகளைத் தொடவும்:',
    emergencyNotice: 'அவசர எச்சரிக்கை: தீவிர மருத்துவ நிலை கண்டறியப்பட்டது',
    fastTrackGranted: 'P1 அவசர சிகிச்சை பாஸ் வழங்கப்பட்டது',
    proceedToDoc: 'தயவுசெய்து அவசர சிகிச்சை அறை 102 க்கு உடனடியாக செல்லவும்',
    abhaLogin: 'படி 1: ஆபா / ஆதார் சரிபார்ப்பு',
    caseTaking: 'படி 2: குரல் & தொடு மருத்துவ விசாரணை',
    reportScan: 'படி 3: பழைய மருந்து சீட்டு ஸ்கேன்',
    summaryTitle: 'படி 4: விசாரணை மற்றும் ஆவண சுருக்கம்',
    tokenSlip: 'படி 5: ஓபிடி டோக்கன் சீட்டு',
    scanPrescriptionTitle: 'பழைய மருத்துவ சீட்டுகளை ஸ்கேன் செய்க',
    noRepeatedTests: 'முந்தைய அறிக்கைகள் இருப்பதால் மீண்டும் பரிசோதனை செய்வதை தவிர்க்கலாம்',
    doctorSummaryReady: 'மருத்துவரிடம் செல்லும் முன்னரே முழு சுருக்கம் தயார்',
    continueBtn: 'அடுத்த படிக்கு செல்லவும்',
    backBtn: 'பின்னால்',
    confirmAndToken: 'உறுதிசெய்து டோக்கன் பெறவும்',
    audioListenBtn: 'தேர்ந்தெடுத்த மொழியில் கேட்கவும்',
    painScaleLabel: 'உங்கள் வலி அல்லது அசௌகரிய அளவைத் தேர்ந்தெடுக்கவும்:',
    painMild: 'லேசானது (1-3)',
    painModerate: 'மிதமானது (4-6)',
    painSevere: 'கடுமையானது (7-9)',
    painEmergency: 'தாங்க முடியாதது (10)',
    abhaInputLabel: '14 இலக்க ஆபா எண் அல்லது மொபைல் எண்ணை உள்ளிடவும்',
    consentCheckbox: 'மருத்துவ ஆலோசனைக்காக எனது மருத்துவ விவரங்களை பகிர ஒப்புக்கொள்கிறேன்',
    verifyOtp: 'OTP சரிபார்க்கவும்',
    sampleProfiles: 'மாதிரி சுயவிவரங்கள்:',
    timelineTitle: 'முந்தைய மருத்துவ வரலாறு',
    verifiedChiefComplaints: 'சரிபார்க்கப்பட்ட அறிகுறிகள்',
    activeMedsTitle: 'தற்போது உட்கொள்ளும் மருந்துகள்',
    allergiesTitle: 'ஒவ்வாமை மற்றும் எச்சரிக்கைகள்',
    printPass: 'டோக்கன் அச்சிடுக',
    nextPatient: 'அடுத்த நோயாளிக்கான பதிவு',
  },
  bn: {
    hospitalOpd: 'স্মার্ট হাসপাতাল ওপিডি সিস্টেম',
    kioskMode: 'রোগী কিয়স্ক টার্মিনাল',
    doctorMode: 'ডাক্তারের ক্লিনিক্যাল সামারি (ইএমআর)',
    triageMode: 'ওপিডি ট্রায়াজ ও প্রবাহ',
    abdmMode: 'আভা স্বাস্থ্য রেকর্ড',
    touchVoiceNote: 'কন্ঠস্বরে বলুন বা স্পর্শ পর্দায় চাপুন',
    speakNow: 'এখন মাইক্রোফোনে কথা বলুন...',
    listening: 'আপনার কথা শোনা হচ্ছে...',
    tapToSpeak: 'কথা বলতে ট্যাপ করুন (ভয়েস)',
    stopSpeaking: 'থামুন ও জমা দিন',
    orTapOptions: 'অথবা নিচের বিকল্পগুলোতে স্পর্শ করুন:',
    emergencyNotice: 'জরুরি সতর্কতা: গুরুতর স্বাস্থ্য ঝুঁকি সনাক্ত হয়েছে',
    fastTrackGranted: 'পি১ রেড-ফ্ল্যাগ ফাস্ট ট্র্যাক পাস প্রদান করা হয়েছে',
    proceedToDoc: 'অনুগ্রহ করে সরাসরি জরুরি কাউন্টার / রুম ১০২ এ যান',
    abhaLogin: 'ধাপ ১: আভা / আধার যাচাইকরণ',
    caseTaking: 'ধাপ ২: ভয়েস এবং টাচ কেস গ্রহণ',
    reportScan: 'ধাপ ৩: পুরনো প্রেসক্রিপশন ও রিপোর্ট স্ক্যান',
    summaryTitle: 'ধাপ ৪: লক্ষণ ও রিপোর্টের সারসংক্ষেপ',
    tokenSlip: 'ধাপ ৫: ওপিডি পরামর্শ টোকেন স্লিপ',
    scanPrescriptionTitle: 'পুরনো প্রেসক্রিপশন ও টেস্ট রিপোর্ট স্ক্যান করুন',
    noRepeatedTests: 'ইতিহাস রক্ষায় অপ্রয়োজনীয় পুনরাবৃত্ত পরীক্ষা কমে',
    doctorSummaryReady: 'পরামর্শের আগেই ডাক্তারের কাছে সম্পূর্ণ সামারি পৌঁছে যায়',
    continueBtn: 'পরবর্তী ধাপে যান',
    backBtn: 'পেছনে যান',
    confirmAndToken: 'নিশ্চিত করুন এবং টোকেন পান',
    audioListenBtn: 'নির্বাচিত ভাষায় শুনুন',
    painScaleLabel: 'আপনার ব্যথার মাত্রা নির্বাচন করুন:',
    painMild: 'মৃদু (১-৩)',
    painModerate: 'মাঝারি (৪-৬)',
    painSevere: 'তীব্র (৭-৯)',
    painEmergency: 'অসহনীয় / জরুরি (১০)',
    abhaInputLabel: '১৪ সংখ্যার আভা নম্বর বা মোবাইল লিখুন',
    consentCheckbox: 'ওপিডি পরামর্শের জন্য স্বাস্থ্য তথ্য শেয়ার করতে সম্মতি দিচ্ছি',
    verifyOtp: 'ওটিপি যাচাই করুন',
    sampleProfiles: 'নমুনা প্রোফাইল:',
    timelineTitle: 'পূর্ববর্তী স্বাস্থ্য ইতিহাস',
    verifiedChiefComplaints: 'যাচাইকৃত প্রধান লক্ষণসমূহ',
    activeMedsTitle: 'বর্তমান চলমান ওষুধসমূহ',
    allergiesTitle: 'অ্যালার্জি এবং সতর্কতা',
    printPass: 'স্লিপ প্রিন্ট করুন',
    nextPatient: 'পরবর্তী রোগী শুরু করুন',
  },
  mr: {
    hospitalOpd: 'स्मार्ट रुग्णालय ओपीडी प्रणाली',
    kioskMode: 'रुग्ण कियोस्क टर्मिनल',
    doctorMode: 'डॉक्टर क्लिनिकल सारांश (EMR)',
    triageMode: 'ओपीडी प्रवाह व ट्रायज',
    abdmMode: 'आभा आरोग्य रेकॉर्ड',
    touchVoiceNote: 'आवाजाद्वारे बोला किंवा स्क्रीनवर स्पर्श करा',
    speakNow: 'आता मायक्रोफोनमध्ये बोला...',
    listening: 'आपला आवाज ऐकत आहे...',
    tapToSpeak: 'बोलण्यासाठी दाबा (आवाज)',
    stopSpeaking: 'थांबवा आणि सबमिट करा',
    orTapOptions: 'किंवा खालील पर्यायांवर स्पर्श करा:',
    emergencyNotice: 'आपत्कालीन सूचना: गंभीर वैद्यकीय लक्षणे आढळली',
    fastTrackGranted: 'P1 रेड फ्लॅग तात्काळ पास देण्यात आला',
    proceedToDoc: 'कृपया तात्काळ आपत्कालीन कक्ष 102 मध्ये जा',
    abhaLogin: 'पायरी १: आभा / आधार पडताळणी',
    caseTaking: 'पायरी २: आवाज आणि टच द्वारे केस नोंदणी',
    reportScan: 'पायरी ३: जुने प्रिस्क्रिप्शन व रिपोर्ट स्कॅन',
    summaryTitle: 'पायरी ४: लक्षणे आणि अहवाल सारांश',
    tokenSlip: 'पायरी ५: ओपीडी सल्लामसलत टोकन पावती',
    scanPrescriptionTitle: 'जुने वैद्यकीय कागदपत्रे स्कॅन करा',
    noRepeatedTests: 'पुन्हा चाचण्या न करता वेळेची व पैशांची बचत',
    doctorSummaryReady: 'रुग्ण भेटण्यापूर्वीच डॉक्टरांकडे संपूर्ण माहिती तयार',
    continueBtn: 'पुढील पायरीवर जा',
    backBtn: 'मागे',
    confirmAndToken: 'पुष्टी करा आणि टोकन मिळवा',
    audioListenBtn: 'निवडलेल्या भाषेत ऐका',
    painScaleLabel: 'तुमच्या वेदनेची किंवा त्रासाची तीव्रता निवडा:',
    painMild: 'कमी (१-३)',
    painModerate: 'मध्यम (४-६)',
    painSevere: 'तीव्र (७-९)',
    painEmergency: 'असह्य / गंभीर (१०)',
    abhaInputLabel: '१४ अंकी आभा क्रमांक किंवा मोबाईल प्रविष्ट करा',
    consentCheckbox: 'मी ओपीडी सल्ल्यासाठी आरोग्य माहिती सामायिक करण्यास संमती देतो',
    verifyOtp: 'OTP पडताळा',
    sampleProfiles: 'नमुना प्रोफाइल:',
    timelineTitle: 'मागील आरोग्य नोंदी',
    verifiedChiefComplaints: 'तपासलेली मुख्य लक्षणे',
    activeMedsTitle: 'सध्या चालू असलेली औषधे',
    allergiesTitle: 'ॲलर्जी आणि धोके',
    printPass: 'पावती प्रिंट करा',
    nextPatient: 'पुढील रुग्णाची नोंदणी सुरू करा',
  },
  gu: {
    hospitalOpd: 'સ્માર્ટ હોસ્પિટલ ઓપીડી સિસ્ટમ',
    kioskMode: 'દર્દી કિઓસ્ક ટર્મિનલ',
    doctorMode: 'ડોક્ટર ક્લિનિકલ સારાંશ (EMR)',
    triageMode: 'ઓપીડી પ્રવાહ અને ટ્રાયેજ',
    abdmMode: 'આભા હેલ્થ રેકોર્ડ્સ',
    touchVoiceNote: 'અવાજ દ્વારા બોલો અથવા સ્ક્રીન પર સ્પર્શ કરો',
    speakNow: 'હવે માઇકમાં બોલો...',
    listening: 'તમારો અવાજ સાંભળી રહ્યા છીએ...',
    tapToSpeak: 'બોલવા માટે ટચ કરો (અવાજ)',
    stopSpeaking: 'અટકાવો અને સબમિટ કરો',
    orTapOptions: 'અથવા નીચેના વિકલ્પો પસંદ કરો:',
    emergencyNotice: 'ઇમરજન્સી એલર્ટ: ગંભીર લક્ષણો જણાયા છે',
    fastTrackGranted: 'P1 રેડ-ફ્લેગ ફાસ્ટ ટ્રેક પાસ જારી કરાયો',
    proceedToDoc: 'કૃપા કરીને તાત્કાલિક ઇમરજન્સી રૂમ 102 માં જાઓ',
    abhaLogin: 'પગલું ૧: આભા / આધાર ચકાસણી',
    caseTaking: 'પગલું ૨: અવાજ અને ટચ દ્વારા વિગતો',
    reportScan: 'પગલું ૩: જૂના પ્રિસ્ક્રિપ્શન અને રિપોર્ટ્સ સ્કેન',
    summaryTitle: 'પગલું ૪: લક્ષણો અને રિપોર્ટ સારાંશ',
    tokenSlip: 'પગલું ૫: ઓપીડી કન્સલ્ટેશન ટોકન સ્લિપ',
    scanPrescriptionTitle: 'જૂના પ્રિસ્ક્રિપ્શન સ્કેન કરો',
    noRepeatedTests: 'જૂનો રેકોર્ડ હોવાથી ફરી ટેસ્ટ કરાવવાની જરૂર નથી પડતી',
    doctorSummaryReady: 'દર્દી આવે તે પહેલાં જ ડોક્ટર પાસે તૈયાર સારાંશ',
    continueBtn: 'આગળના પગલા પર જાઓ',
    backBtn: 'પાછળ',
    confirmAndToken: 'ખાતરી કરો અને ટોકન મેળવો',
    audioListenBtn: 'પસંદ કરેલ ભાષામાં સાંભળો',
    painScaleLabel: 'તમારા દુખાવા કે તકલીફનું પ્રમાણ પસંદ કરો:',
    painMild: 'હળવો (૧-૩)',
    painModerate: 'મધ્યમ (૪-૬)',
    painSevere: 'તીવ્ર (૭-૯)',
    painEmergency: 'અસહ્ય / ઇમરજન્સી (૧૦)',
    abhaInputLabel: '૧૪ અંકનો આભા નંબર અથવા મોબાઈલ દાખલ કરો',
    consentCheckbox: 'હું ઓપીડી તપાસ માટે આરોગ્ય ઇતિહાસ શેર કરવા સંમતિ આપું છું',
    verifyOtp: 'OTP ચકાસો',
    sampleProfiles: 'સેમ્પલ પ્રોફાઇલ્સ:',
    timelineTitle: 'અગાઉનો આરોગ્ય રેકોર્ડ',
    verifiedChiefComplaints: 'તપાસાયેલ મુખ્ય લક્ષણો',
    activeMedsTitle: 'હાલમાં ચાલતી દવાઓ',
    allergiesTitle: 'એલર્જી અને ચેતવણીઓ',
    printPass: 'ટોકન સ્લિપ પ્રિન્ટ કરો',
    nextPatient: 'નવા દર્દીની નોંધણી શરૂ કરો',
  },
  kn: {
    hospitalOpd: 'ಸ್ಮಾರ್ಟ್ ಆಸ್ಪತ್ರೆ ಒಪಿಡಿ ವ್ಯವಸ್ಥೆ',
    kioskMode: 'ರೋಗಿ ಕಿಯೋಸ್ಕ್ ಟರ್ಮಿನಲ್',
    doctorMode: 'ವೈದ್ಯರ ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ (EMR)',
    triageMode: 'ಒಪಿಡಿ ಪ್ರವಾಹ ಮತ್ತು ಟ್ರಯಾಜ್',
    abdmMode: 'ಆಭಾ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು',
    touchVoiceNote: 'ಧ್ವನಿ ಮೂಲಕ ಮಾತನಾಡಿ ಅಥವಾ ಪರದೆಯ ಮೇಲೆ ಸ್ಪರ್ಶಿಸಿ',
    speakNow: 'ಈಗ ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ...',
    listening: 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    tapToSpeak: 'ಮಾತನಾಡಲು ಸ್ಪರ್ಶಿಸಿ (ಧ್ವನಿ)',
    stopSpeaking: 'ನಿಲ್ಲಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ',
    orTapOptions: 'ಅಥವಾ ಕೆಳಗಿನ ಆಯ್ಕೆಗಳನ್ನು ಸ್ಪರ್ಶಿಸಿ:',
    emergencyNotice: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ: ಗಂಭೀರ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಗುರುತಿಸಲಾಗಿದೆ',
    fastTrackGranted: 'P1 ರೆಡ್ ಫ್ಲ್ಯಾಗ್ ತುರ್ತು ಪಾಸ್ ನೀಡಲಾಗಿದೆ',
    proceedToDoc: 'ದಯವಿಟ್ಟು ನೇರವಾಗಿ ತುರ್ತು ಕೌಂಟರ್ / ಕೊಠಡಿ 102 ಕ್ಕೆ ತೆರಳಿ',
    abhaLogin: 'ಹಂತ ೧: ಆಭಾ / ಆಧಾರ್ ಪರಿಶೀಲನೆ',
    caseTaking: 'ಹಂತ ೨: ಧ್ವನಿ ಮತ್ತು ಸ್ಪರ್ಶ ಕೇಸ್ ದಾಖಲಾತಿ',
    reportScan: 'ಹಂತ ೩: ಹಳೆಯ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವರದಿ ಸ್ಕ್ಯಾನ್',
    summaryTitle: 'ಹಂತ ೪: ಸಮಸ್ಯೆಗಳು ಮತ್ತು ದಾಖಲೆಗಳ ಸಾರಾಂಶ',
    tokenSlip: 'ಹಂತ ೫: ಒಪಿಡಿ ಸಮಾಲೋಚನೆ ಟೋಕನ್ ರಸೀದಿ',
    scanPrescriptionTitle: 'ಹಳೆಯ ದಾಖಲೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    noRepeatedTests: 'ಹಳೆಯ ದಾಖಲೆಗಳು ಇರುವುದರಿಂದ ಪುನರಾವರ್ತಿತ ಪರೀಕ್ಷೆಗಳನ್ನು ತಪ್ಪಿಸಬಹುದು',
    doctorSummaryReady: 'ಸಮಾಲೋಚನೆಗೆ ಮುಂಚಿತವಾಗಿಯೇ ವೈದ್ಯರಿಗೆ ಸಿದ್ಧ ಸಾರಾಂಶ',
    continueBtn: 'ಮುಂದಿನ ಹಂತಕ್ಕೆ ಹೋಗಿ',
    backBtn: 'ಹಿಂದೆ',
    confirmAndToken: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಟೋಕನ್ ಪಡೆಯಿರಿ',
    audioListenBtn: 'ಆಯ್ಕೆಮಾಡಿದ ಭಾಷೆಯಲ್ಲಿ ಆಲಿಸಿ',
    painScaleLabel: 'ನಿಮ್ಮ ನೋವು ಅಥವಾ ತೊಂದರೆಯ ತೀವ್ರತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    painMild: 'ಕಡಿಮೆ (೧-೩)',
    painModerate: 'ಮಧ್ಯಮ (೪-೬)',
    painSevere: 'ತೀವ್ರ (೭-೯)',
    painEmergency: 'ತಡೆದುಕೊಳ್ಳಲಾಗದ / ತುರ್ತು (೧೦)',
    abhaInputLabel: '೧೪ ಅಂಕಿಗಳ ಆಭಾ ಸಂಖ್ಯೆ ಅಥವಾ ಮೊಬೈಲ್ ನಮೂದಿಸಿ',
    consentCheckbox: 'ಒಪಿಡಿ ಸಮಾಲೋಚನೆಗಾಗಿ ಆರೋಗ್ಯ ಇತಿಹಾಸವನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ನಾನು ಒಪ್ಪುತ್ತೇನೆ',
    verifyOtp: 'OTP ಪರಿಶೀಲಿಸಿ',
    sampleProfiles: 'ಮಾದರಿ ಪ್ರೊಫೈಲ್ಗಳು:',
    timelineTitle: 'ಹಿಂದಿನ ಆರೋಗ್ಯ ಇತಿಹಾಸ',
    verifiedChiefComplaints: 'ಪರಿಶೀಲಿಸಿದ ಮುಖ್ಯ ಲಕ್ಷಣಗಳು',
    activeMedsTitle: 'ಪ್ರಸ್ತುತ ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಔಷಧಿಗಳು',
    allergiesTitle: 'ಅಲರ್ಜಿಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು',
    printPass: 'ರಸೀದಿ ಮುದ್ರಿಸಿ',
    nextPatient: 'ಮುಂದಿನ ರೋಗಿ ಆರಂಭಿಸಿ',
  },
};

// Initial greetings in each supported language
export const INITIAL_GREETINGS: Record<SupportedLanguage, (patientName: string) => string> = {
  en: (name) => `Namaste ${name}. What primary problem or health discomfort brings you to the hospital today? You can speak into the microphone or tap the options below.`,
  hi: (name) => `नमस्ते ${name} जी। आज आपको क्या मुख्य परेशानी या स्वास्थ्य समस्या है? आप माइक में बोल सकते हैं या नीचे दिए विकल्पों को छू सकते हैं।`,
  te: (name) => `నమస్తే ${name} గారూ. ఈరోజు మీకు ఉన్న ప్రధాన ఆరోగ్య సమస్య ఏమిటి? మైక్రోఫోన్‌లో మాట్లాడండి లేదా కింద ఉన్న బటన్లను తాకండి.`,
  ta: (name) => `வணக்கம் ${name} அவர்களே. இன்று உங்களுக்கு உள்ள முக்கிய உடல்நலக் குறைபாடு என்ன? நீங்கள் மைக்கில் பேசலாம் அல்லது கீழே உள்ள தேர்வுகளைத் தொடலாம்.`,
  bn: (name) => `নমস্কার ${name}। আজ আপনার কী প্রধান স্বাস্থ্য সমস্যা বা কষ্ট হচ্ছে? আপনি মাইকে বলতে পারেন অথবা নিচের বিকল্পগুলোতে স্পর্শ করতে পারেন।`,
  mr: (name) => `नमस्ते ${name} जी। आज तुम्हाला काय मुख्य त्रास किंवा आरोग्य समस्या होत आहे? आपण माइकवर बोलू शकता किंवा खालील पर्यायांवर स्पर्श करू शकता.`,
  gu: (name) => `નમસ્તે ${name} જી. આજે તમને શું મુખ્ય તકલીફ અથવા સ્વાસ્થ્ય સમસ્યા છે? તમે માઇકમાં બોલી શકો છો અથવા નીચેના વિકલ્પો પર સ્પર્શ કરી શકો છો.`,
  kn: (name) => `ನಮಸ್ಕಾರ ${name} ಅವರೇ. ಇಂದು ನಿಮ್ಮ ಮುಖ್ಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಅಥವಾ ತೊಂದರೆ ಏನು? ನೀವು ಮೈಕ್‌ನಲ್ಲಿ ಮಾತನಾಡಬಹುದು ಅಥವಾ ಕೆಳಗಿನ ಆಯ್ಕೆಗಳನ್ನು ಸ್ಪರ್ಶಿಸಬಹುದು.`,
};

// Quick chips in each supported language
export const QUICK_CHIPS_BY_LANG: Record<SupportedLanguage, string[]> = {
  en: [
    'Chest pain radiating to left arm',
    'Severe upper stomach pain for 3 days',
    'High fever with chills since yesterday',
    'Routine diabetes & BP checkup'
  ],
  hi: [
    'सीने में तेज दर्द जो बाएं हाथ तक जा रहा है',
    '3 दिन से पेट के ऊपरी हिस्से में तेज दर्द',
    'कल शाम से कंपकंपी के साथ तेज बुखार',
    'शुगर और बीपी की नियमित जांच'
  ],
  te: [
    'ఎడమ చేతికి వ్యాపించే తీవ్రమైన ఛాతీ నొప్పి',
    '3 రోజులుగా పై కడుపులో విపరీతమైన నొప్పి',
    'నిన్నటి నుండి చలితో కూడిన తీవ్ర జ్వరం',
    'షుగర్ మరియు బీపీ సాధారణ పరీక్ష'
  ],
  ta: [
    'இடது கைக்கு பரவும் கடுமையான மார்பு வலி',
    '3 நாட்களாக கடுமையான மேல் வயிற்று வலி',
    'நேற்று முதல் நடுக்கத்துடன் கூடிய அதிக காய்ச்சல்',
    'நீரிழிவு மற்றும் ரத்த அழுத்த வழக்கமான சோதனை'
  ],
  bn: [
    'বাঁ হাতে ছড়িয়ে পড়া তীব্র বুকের ব্যথা',
    '৩ দিন ধরে পেটের উপরিভাগে প্রচণ্ড যন্ত্রণা',
    'গতকাল থেকে কাঁপুনি দিয়ে তেজ জ্বর',
    'ডায়াবেটিস ও রক্তচাপের নিয়মিত চেকআপ'
  ],
  mr: [
    'डाव्या हातात पसरणाऱ्या छातीत तीव्र वेदना',
    '३ दिवसांपासून पोटाच्या वरच्या भागात तीव्र कळ',
    'कालपासून थंडी वाजून जोरात ताप',
    'मधुमेह आणि रक्तदाबाची नियमित तपासणी'
  ],
  gu: [
    'ડાબા હાથમાં ફેલાતો સખત છાતીનો દુખાવો',
    '૩ દિવસથી પેટના ઉપરના ભાગે તીવ્ર દુખાવો',
    'ગઈકાલથી ધ્રુજારી સાથે સખત તાવ',
    'ડાયાબિટીસ અને બીપીની નિયમિત તપાસ'
  ],
  kn: [
    'ಎಡಗೈಗೆ ಹರಡುವ ತೀವ್ರವಾದ ಎದೆ ನೋವು',
    '೩ ದಿನಗಳಿಂದ ಮೇಲ್ಹೊಟ್ಟೆಯಲ್ಲಿ ವಿಪರೀತ ನೋವು',
    'ನಿನ್ನೆಯಿಂದ ಚಳಿಯೊಂದಿಗೆ ತೀವ್ರ ಜ್ವರ',
    'ಮಧುಮೇಹ ಮತ್ತು ರಕ್ತದೊತ್ತಡದ ನಿಯಮಿತ ತಪಾಸಣೆ'
  ],
};

// Speaker intro labels for natural conversation playback across all 8 Indian languages
export const SPEAKER_LABELS_BY_LANG: Record<SupportedLanguage, { assistant: string; user: string; you: string }> = {
  en: { assistant: 'MediKiosk Assistant', user: 'Patient', you: 'You said' },
  hi: { assistant: 'सहायक', user: 'मरीज', you: 'आपने कहा' },
  te: { assistant: 'సహాయకుడు', user: 'రోగి', you: 'మీరు చెప్పారు' },
  ta: { assistant: 'உதவியாளர்', user: 'நோயாளி', you: 'நீங்கள் கூறினீர்கள்' },
  bn: { assistant: 'সহায়ক', user: 'রোগী', you: 'আপনি বললেন' },
  mr: { assistant: 'सहाय्यक', user: 'रुग्ण', you: 'तुम्ही म्हणालात' },
  gu: { assistant: 'સહાયક', user: 'દર્દી', you: 'તમે કહ્યું' },
  kn: { assistant: 'ಸಹಾಯಕ', user: 'ರೋಗಿ', you: 'ನೀವು ಹೇಳಿದ್ದೀರಿ' },
};

// Internal voice cache and active references to prevent browser GC bugs
let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

// Fluent pronunciation formatter: converts medical abbreviations & formats natural pause cadence
export function formatTextForFluentSpeech(text: string, lang: SupportedLanguage | string = 'en'): string {
  let formatted = text
    .replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // strip emojis
    .replace(/[*#_`~>[\]]/g, ' ') // strip markdown characters
    .replace(/\s+/g, ' ')
    .trim();

  // Language-specific acronyms and fluent vernacular cadence
  const langKey = typeof lang === 'string' ? lang.slice(0, 2) : 'en';

  if (langKey === 'hi') {
    formatted = formatted
      .replace(/\bOPD\b/gi, 'ओ पी डी')
      .replace(/\bBP\b/gi, 'ब्लड प्रेशर')
      .replace(/\bECG\b/gi, 'ई सी जी')
      .replace(/\bDr\.\b/gi, 'डॉक्टर')
      .replace(/\bAIIMS\b/gi, 'एम्स')
      .replace(/\bTab\b/gi, 'गोली')
      .replace(/\bmg\b/gi, 'मिलीग्राम');
  } else if (langKey === 'te') {
    formatted = formatted
      .replace(/\bOPD\b/gi, 'ఓ పి డి')
      .replace(/\bBP\b/gi, 'బ్లడ్ ప్రెషర్')
      .replace(/\bECG\b/gi, 'ఈ సి జి')
      .replace(/\bDr\.\b/gi, 'డాక్టర్')
      .replace(/\bTab\b/gi, 'మాత్ర')
      .replace(/\bmg\b/gi, 'మిల్లీగ్రాములు');
  } else if (langKey === 'ta') {
    formatted = formatted
      .replace(/\bOPD\b/gi, 'ஓ பி டி')
      .replace(/\bBP\b/gi, 'ரத்த அழுத்தம்')
      .replace(/\bECG\b/gi, 'இ சி ஜி')
      .replace(/\bDr\.\b/gi, 'டாக்டர்')
      .replace(/\bTab\b/gi, 'மாத்திரை');
  } else if (langKey === 'bn') {
    formatted = formatted
      .replace(/\bOPD\b/gi, 'ও পি ডি')
      .replace(/\bBP\b/gi, 'রক্তচাপ')
      .replace(/\bECG\b/gi, 'ই সি জি')
      .replace(/\bDr\.\b/gi, 'ডাক্তার');
  } else if (langKey === 'mr') {
    formatted = formatted
      .replace(/\bOPD\b/gi, 'ओ पी डी')
      .replace(/\bBP\b/gi, 'रक्तदाब')
      .replace(/\bECG\b/gi, 'ई सी जी')
      .replace(/\bDr\.\b/gi, 'डॉक्टर');
  } else if (langKey === 'gu') {
    formatted = formatted
      .replace(/\bOPD\b/gi, 'ઓ પી ડી')
      .replace(/\bBP\b/gi, 'બીપી')
      .replace(/\bDr\.\b/gi, 'ડોક્ટર');
  } else if (langKey === 'kn') {
    formatted = formatted
      .replace(/\bOPD\b/gi, 'ಒ ಪಿ ಡಿ')
      .replace(/\bBP\b/gi, 'ರಕ್ತದೊತ್ತಡ')
      .replace(/\bDr\.\b/gi, 'ಡಾಕ್ಟರ್');
  } else {
    // English
    formatted = formatted
      .replace(/\bOPD\b/gi, 'O P D')
      .replace(/\bBP\b/gi, 'blood pressure')
      .replace(/\bECG\b/gi, 'E C G')
      .replace(/\bDr\.\b/gi, 'Doctor')
      .replace(/\bAIIMS\b/gi, 'AIMS');
  }

  // Ensure breathing pauses after question marks and colons
  formatted = formatted
    .replace(/([?!])\s*/g, '$1, ')
    .replace(/[:]\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  return formatted;
}

export function getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const normalized = langCode.toLowerCase().replace('_', '-');
  const prefix = normalized.slice(0, 2);

  // 1. First priority: High-fidelity natural / neural voices for the target language
  const naturalKeywords = ['natural', 'neural', 'google', 'online', 'enhanced', 'multilingual'];
  const languageVoices = voices.filter(v => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang === normalized || vLang.startsWith(prefix);
  });

  if (languageVoices.length > 0) {
    // Try to find a premium neural/google voice first
    const premiumVoice = languageVoices.find(v => 
      naturalKeywords.some(kw => v.name.toLowerCase().includes(kw))
    );
    if (premiumVoice) return premiumVoice;
    return languageVoices[0];
  }

  // 2. Keyword fallback for Indian languages
  const langNames: Record<string, string[]> = {
    hi: ['hindi', 'lekh', 'kalpana', 'neerja', 'madhur'],
    te: ['telugu', 'mohan', 'shruti'],
    ta: ['tamil', 'valluvar', 'pallavi'],
    bn: ['bengali', 'bangla', 'bashkar', 'tanishaa'],
    mr: ['marathi', 'aarohi'],
    gu: ['gujarati', 'dhwani', 'niranjan'],
    kn: ['kannada', 'gagan', 'sapna'],
    en: ['indian', 'india', 'rishi', 'sangeeta', 'heera', 'ravi', 'google uk english female'],
  };

  const keywords = langNames[prefix];
  if (keywords) {
    for (const kw of keywords) {
      const match = voices.find(v => v.name.toLowerCase().includes(kw));
      if (match) return match;
    }
  }

  return null;
}

let activeUtterances: SpeechSynthesisUtterance[] = [];
let queueAbortToken = { abort: false };
let isQueueActive = false;

// Audio synthesis helper with fallback and callbacks
export function speakText(
  text: string,
  langCode: string = 'en-IN',
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (e: any) => void;
    rate?: number;
    pitch?: number;
  }
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    
    // Clean text and format for natural fluent Indian pronunciation
    const prefix = langCode.slice(0, 2);
    const cleanText = formatTextForFluentSpeech(text, prefix);

    if (!cleanText) {
      options?.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    // Empathetic, fluent, conversational clinical tone (not rushed, smooth cadence)
    utterance.rate = options?.rate || (prefix === 'en' ? 0.92 : 0.88);
    utterance.pitch = options?.pitch || 1.04;

    const matchedVoice = getBestVoiceForLanguage(langCode);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      activeUtterances = activeUtterances.filter(u => u !== utterance);
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      activeUtterances = activeUtterances.filter(u => u !== utterance);
      options?.onError?.(e);
    };

    activeUtterances.push(utterance);
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    options?.onError?.(err);
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      activeUtterances = [];
    } catch (e) {
      console.warn('Cancel speech error:', e);
    }
  }
}

export interface ConversationQueueCallbacks {
  onStartMessage?: (messageId: string, index: number, total: number) => void;
  onEndMessage?: (messageId: string, index: number) => void;
  onComplete?: () => void;
  onStatusChange?: (isPlaying: boolean, activeIndex: number) => void;
}

// Sequential playback of entire conversation history in selected language
export function playConversationQueue(
  messages: ChatMessage[],
  lang: SupportedLanguage,
  callbacks?: ConversationQueueCallbacks
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !messages || messages.length === 0) {
    callbacks?.onComplete?.();
    return;
  }

  // Signal previous queue to cancel immediately
  queueAbortToken.abort = true;
  queueAbortToken = { abort: false };
  const currentToken = queueAbortToken;

  stopSpeaking();
  isQueueActive = true;
  callbacks?.onStatusChange?.(true, 0);

  const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  const langCode = langInfo.speechCode;
  const labels = SPEAKER_LABELS_BY_LANG[lang] || SPEAKER_LABELS_BY_LANG.en;

  let currentIndex = 0;

  function speakNext() {
    if (currentToken.abort || !isQueueActive || currentIndex >= messages.length) {
      isQueueActive = false;
      callbacks?.onStatusChange?.(false, currentIndex);
      callbacks?.onComplete?.();
      return;
    }

    const msg = messages[currentIndex];
    const isAssistant = msg.sender === 'assistant';
    const rawText = msg.vernacularText || msg.text;

    // Natural speaker prefix tag
    const speakerTag = isAssistant ? labels.assistant : labels.you;
    const spokenContent = `${speakerTag}: ${rawText}`;

    callbacks?.onStartMessage?.(msg.id, currentIndex, messages.length);
    callbacks?.onStatusChange?.(true, currentIndex);

    const cleanText = formatTextForFluentSpeech(spokenContent, lang);

    if (!cleanText) {
      currentIndex++;
      speakNext();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = lang === 'en' ? 0.92 : 0.88; // Natural, unhurried cadence
    utterance.pitch = isAssistant ? 1.04 : 1.0; // Empathetic clinical assistant tone

    const matchedVoice = getBestVoiceForLanguage(langCode);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    let hasEnded = false;
    const advance = () => {
      if (hasEnded) return;
      hasEnded = true;
      callbacks?.onEndMessage?.(msg.id, currentIndex);
      currentIndex++;

      if (!currentToken.abort && isQueueActive) {
        // Natural 350ms pause between patient and assistant turns
        setTimeout(() => {
          speakNext();
        }, 350);
      } else {
        isQueueActive = false;
        callbacks?.onStatusChange?.(false, currentIndex);
        callbacks?.onComplete?.();
      }
    };

    utterance.onend = advance;
    utterance.onerror = (e) => {
      console.warn('Queue utterance error:', e);
      advance();
    };

    // Safety timeout: Chrome can sometimes hang on speech synthesis without firing onend
    const words = cleanText.split(' ').length;
    const estimatedTimeoutMs = Math.max(3500, (words / 2.0) * 1000 + 2500);
    const timeoutHandle = setTimeout(() => {
      if (!hasEnded) {
        console.warn('Utterance speech timed out, advancing to next turn');
        advance();
      }
    }, estimatedTimeoutMs);

    const originalEnd = utterance.onend;
    utterance.onend = (ev) => {
      clearTimeout(timeoutHandle);
      originalEnd?.call(utterance, ev);
    };

    activeUtterances.push(utterance);
    window.speechSynthesis.speak(utterance);
  }

  // Brief initial delay so previous synthesis is completely canceled
  setTimeout(() => {
    speakNext();
  }, 120);
}

export function pauseConversationSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.pause();
    } catch (e) {
      console.warn('Pause error:', e);
    }
  }
}

export function resumeConversationSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
    } catch (e) {
      console.warn('Resume error:', e);
    }
  }
}

export function stopConversationQueue() {
  queueAbortToken.abort = true;
  isQueueActive = false;
  stopSpeaking();
}

// Clinical stage question templates across all 8 languages for fast client mapping
export const CLINICAL_STAGE_QUESTIONS: Record<SupportedLanguage, string[]> = {
  en: [
    'When did this symptom start? Is it constant or coming and going?',
    'How would you describe the discomfort? Is it sharp, burning, cramping, throbbing, or a dull ache?',
    'Are you experiencing any other symptoms, such as nausea, vomiting, fever, dizziness, or shortness of breath?',
    'Does anything make it better or worse (like eating or resting)? Have you taken any tablets for this?',
    'Do you have any previous prescriptions or recent lab reports with you? We can scan them next.'
  ],
  hi: [
    'यह परेशानी कब से शुरू हुई? क्या यह लगातार हो रहा है या रुक-रुक कर?',
    'यह दर्द या तकलीफ किस तरह की है? क्या यह जलन, चुभन, ऐंठन या भारीपन जैसा महसूस होता है?',
    'क्या इसके साथ उल्टी, चक्कर, बुखार या सांस फूलने जैसी कोई अन्य समस्या भी है?',
    'क्या इसके लिए आपने पहले कोई दवा या गोली ली है? क्या खाने या आराम करने से कुछ फर्क पड़ता है?',
    'क्या कोई पुरानी जांच रिपोर्ट या पिछली पर्ची आपके पास है? अब हम उन्हें स्कैन करेंगे।'
  ],
  te: [
    'ఈ సమస్య ఎప్పుడు ప్రారంభమైంది? ఇది నిరంతరంగా ఉందా లేదా వచ్చి పోతుందా?',
    'నొప్పి లేదా అసౌకర్యం ఎలా ఉంది? మంట, పొడుస్తున్నట్లు, పట్టేసినట్లు లేదా బరువుగా ఉందా?',
    'దీనితో పాటు వాంతులు, తలతిరగడం, జ్వరం లేదా ఆయాసం లాంటి లక్షణాలు ఏమైనా ఉన్నాయా?',
    'దీనికి ముందు ఏదైనా మందులు వేసుకున్నారా? ఆహారం తింటే లేదా విశ్రాంతి తీసుకుంటే మార్పు ఉందా?',
    'మీ దగ్గర పాత ప్రిస్క్రిప్షన్ లేదా ల్యాబ్ రిపోర్టులు ఉన్నాయా? వాటిని స్కాన్ చేద్దాం.'
  ],
  ta: [
    'இந்த பிரச்சனை எப்போது தொடங்கியது? தொடர்ந்து வலிக்கிறதா அல்லது விட்டு விட்டு வருகிறதா?',
    'வலி அல்லது அசௌகரியம் எப்படி உள்ளது? எரியும் உணர்வு, குத்துதல், பிடிப்பு அல்லது பாரமாக உள்ளதா?',
    'இதனுடன் வாந்தி, தலைசுற்றல், காய்ச்சல் அல்லது மூச்சுத்திணறல் ஏதேனும் உள்ளதா?',
    'இதற்காக முன்பு ஏதேனும் மாத்திரை சாப்பிட்டீர்களா? சாப்பிட்டால் அல்லது ஓய்வெடுத்தால் குணமாகிறதா?',
    'பழைய மருந்து சீட்டு அல்லது ரத்த பரிசோதனை அறிக்கைகள் உள்ளதா? அவற்றை ஸ்கேன் செய்யலாம்.'
  ],
  bn: [
    'এই কষ্ট বা যন্ত্রণা কখন থেকে শুরু হয়েছে? এটা কি একটানা হচ্ছে নাকি থেমে থেমে হচ্ছে?',
    'ব্যথাটা কেমন লাগছে? জ্বালাপোড়া, খোঁচা মারা, পেটে মোচড় দেওয়া নাকি বুকে ভারী ভাব?',
    'এর সাথে বমি, মাথা ঘোরা, জ্বর বা শ্বাসকষ্টের মতো অন্য কোনো সমস্যা আছে কি?',
    'এর জন্য আগে কোনো ওষুধ খেয়েছেন? খাওয়া বা বিশ্রামে কি কিছু উপশম হয়?',
    'আপনার কাছে কি কোনো পুরানো প্রেসক্রিপশন বা ল্যাব রিপোর্ট আছে? আমরা সেগুলি স্ক্যান করব।'
  ],
  mr: [
    'हा त्रास कधीपासून सुरू झाला? हे सतत दुखत आहे की थांबून थांबून येत आहे?',
    'हा त्रास कसा होतो? जळजळ, टोचल्यासारखे, कळा येणे की छातीत जड वाटत आहे?',
    'यासोबत उलट्या, चक्कर, ताप किंवा दम लागण्यासारखा काही त्रास होतोय का?',
    'यासाठी तुम्ही आधी काही औषध किंवा गोळी घेतली आहे का?',
    'तुमच्याकडे जुनी औषधपत्रिका किंवा रक्त तपासणीचे रिपोर्ट आहेत का? आपण ते स्कॅन करू.'
  ],
  gu: [
    'આ તકલીફ ક્યારથી શરૂ થઈ? સતત દુખાવો રહે છે કે આવીને જતો રહે છે?',
    'દુખાવો કેવો થાય છે? બળતરા થાય છે, ચૂંક આવે છે કે છાતીમાં ભારેપણું લાગે છે?',
    'સાથે ઉલ્ટી, ચક્કર, તાવ કે શ્વાસ લેવામાં તકલીફ જેવું કંઈ થાય છે?',
    'આના માટે કોઈ દવા કે પેઈનકિલર લીધી છે? જમ્યા પછી કે આરામ કરવાથી રાહત થાય છે?',
    'શું તમારી પાસે જૂની ફાઈલ કે દવાના કાગળો છે? આપણે તેને સ્કેન કરીએ.'
  ],
  kn: [
    'ಈ ಸಮಸ್ಯೆ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು? ನಿರಂತರವಾಗಿದೆಯೇ ಅಥವಾ ಬಿಟ್ಟು ಬಿಟ್ಟು ಬರುತ್ತಿದೆಯೇ?',
    'ನೋವು ಯಾವ ರೀತಿಯಲ್ಲಿದೆ? ಉರಿ, ಚುಚ್ಚುವಿಕೆ, ಸೆಳೆತ ಅಥವಾ ಎದೆಯಲ್ಲಿ ಭಾರವೆನಿಸುತ್ತಿದೆಯೇ?',
    'ಇದರೊಂದಿಗೆ ವಾಂತಿ, ತಲೆಸುತ್ತು, ಜ್ವರ ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಇದೆಯೇ?',
    'ಇದಕ್ಕಾಗಿ ನೀವು ಯಾವುದಾದರೂ ಮಾತ್ರೆ ಅಥವಾ ಔಷಧ ತೆಗೆದುಕೊಂಡಿದ್ದೀರಾ?',
    'ಹಿಂದಿನ ವೈದ್ಯರ ಚೀಟಿ ಅಥವಾ ಲ್ಯಾಬ್ ವರದಿಗಳು ಇವೆಯೇ? ಅವುಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡೋಣ.'
  ],
};

// Fast local translation mapping for conversation messages
export function translateConversationClient(
  messages: ChatMessage[],
  targetLang: SupportedLanguage,
  patientName: string
): ChatMessage[] {
  const greetingFn = INITIAL_GREETINGS[targetLang] || INITIAL_GREETINGS.en;
  const targetChips = QUICK_CHIPS_BY_LANG[targetLang] || QUICK_CHIPS_BY_LANG.en;
  const stageQuestions = CLINICAL_STAGE_QUESTIONS[targetLang] || CLINICAL_STAGE_QUESTIONS.en;

  let assistantCount = 0;

  return messages.map((msg, index) => {
    if (msg.sender === 'assistant') {
      assistantCount++;
      if (index === 0 || msg.id === 'msg-1') {
        const text = greetingFn(patientName);
        return {
          ...msg,
          text,
          vernacularText: targetLang !== 'en' ? text : undefined,
          quickChips: targetChips,
        };
      }

      // Map subsequent assistant questions to clinical stage questions
      const stageIdx = Math.min(assistantCount - 2, stageQuestions.length - 1);
      const stageText = stageQuestions[Math.max(0, stageIdx)] || msg.text;

      return {
        ...msg,
        text: stageText,
        vernacularText: targetLang !== 'en' ? stageText : undefined,
      };
    }

    if (msg.sender === 'user') {
      // Check if user answer matches any of the known symptoms or quick chips
      const lower = (msg.text || '').toLowerCase();
      let matchedTranslation: string | null = null;

      for (const symptom of MULTILINGUAL_SYMPTOMS) {
        // Check English label
        if (lower.includes(symptom.labels.en.toLowerCase()) || lower.includes(symptom.id)) {
          matchedTranslation = symptom.labels[targetLang] || symptom.sampleInput[targetLang];
          break;
        }
        // Check all language labels
        for (const [langKey, label] of Object.entries(symptom.labels)) {
          if (lower.includes(label.toLowerCase())) {
            matchedTranslation = symptom.labels[targetLang] || symptom.sampleInput[targetLang];
            break;
          }
        }
        if (matchedTranslation) break;
      }

      if (matchedTranslation) {
        return {
          ...msg,
          text: matchedTranslation,
          vernacularText: targetLang !== 'en' ? matchedTranslation : undefined,
        };
      }
    }

    return msg;
  });
}

// Full translation pipeline: applies fast local translation immediately, then refines via AI
export async function translateConversationFull(
  messages: ChatMessage[],
  targetLang: SupportedLanguage,
  patientName: string
): Promise<ChatMessage[]> {
  // 1. Immediate local translation
  const locallyTranslated = translateConversationClient(messages, targetLang, patientName);

  // If there's only 1 message or english, return immediately
  if (messages.length <= 1) {
    return locallyTranslated;
  }

  // 2. Call backend Gemini AI translation for deeper vernacular nuance
  try {
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_LANGUAGES[0];
    const res = await fetch('/api/ai/translate-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: locallyTranslated,
        targetLanguage: langInfo.name,
        targetLanguageCode: langInfo.code,
        patientName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.translatedMessages && Array.isArray(data.translatedMessages)) {
        return data.translatedMessages;
      }
    }
  } catch (err) {
    console.warn('AI translation fallback to local translation:', err);
  }

  return locallyTranslated;
}

