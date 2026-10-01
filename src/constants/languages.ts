import { LanguageKey, LanguageCode } from '../types';

export interface LanguageConfig {
  key: LanguageKey;
  name: string;
  nativeName: string;
  scriptDescription: string;
  speechCode: LanguageCode;
  welcomeGreeting: string;
  confirmationText: string;
  continueButton: string;
  changeLanguage: string;
  startAgain: string;
  demoModeBadge: string;
  tagline: string;
  orbStates: {
    idle: string;
    listening: string;
    processing: string;
    speaking: string;
    stopSpeaking: string;
  };
  inputPlaceholder: string;
  sendButton: string;
  quickPrompts: string[];
  switchQuestion: (detectedLangNative: string) => string;
  switchYes: string;
  switchNo: string;
  switchAck: string;
  resultTitle: string;
  eligibleTitle: string;
  notEligibleTitle: string;
  incompleteTitle: string;
  benefitLabel: string;
  demoBenefitText: string;
  documentsLabel: string;
  documentsList: string[];
  nextStepsLabel: string;
  nextStepsList: string[];
  demoNotice: string;
  askAnotherQuestion: string;
  privacyNotice: string;
  voiceUnsupportedWarning: string;
}

export const LANGUAGES: Record<LanguageKey, LanguageConfig> = {
  tamil: {
    key: 'tamil',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    scriptDescription: 'தமிழ்நாடு மற்றும் பிற பகுதிகள்',
    speechCode: 'ta-IN',
    welcomeGreeting:
      'வணக்கம்! நான் NilaAI. அரசு உதவி அல்லது திட்டத்தைப் பற்றி தெரிந்துகொள்ள உங்களுக்கு உதவுகிறேன். முதலில், உங்கள் வயது என்ன?',
    confirmationText: 'நீங்கள் தமிழைத் தேர்ந்தெடுத்துள்ளீர்கள்.',
    continueButton: 'தொடரலாம்',
    changeLanguage: 'மொழியை மாற்றவும்',
    startAgain: 'மீண்டும் தொடங்கவும்',
    demoModeBadge: 'மாதிரி முறை (DEMO)',
    tagline: 'உங்கள் குரல். உங்கள் மொழி. உங்கள் வழிகாட்டுதல்.',
    orbStates: {
      idle: 'பேச தொடவும்',
      listening: 'கேட்கிறது…',
      processing: 'புரிந்துகொள்கிறது…',
      speaking: 'NilaAI பேசுகிறது…',
      stopSpeaking: 'நிறுத்து',
    },
    inputPlaceholder: 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...',
    sendButton: 'அனுப்பு',
    quickPrompts: [
      'எனக்கு அரசு உதவி வேண்டும்',
      '28 வயது',
      'தமிழ்நாடு',
      '150000',
    ],
    switchQuestion: (langName) =>
      `நீங்கள் ${langName} மொழியில் பேசுகிறீர்கள். ${langName} மொழியில் தொடர விரும்புகிறீர்களா?`,
    switchYes: 'ஆம், மாற்றவும்',
    switchNo: 'வேண்டாம்',
    switchAck: 'சரி. இப்போது நாம் தமிழில் பேசுவோம்.',
    resultTitle: 'உங்கள் முடிவு',
    eligibleTitle: 'நீங்கள் தகுதி பெறக்கூடும்',
    notEligibleTitle: 'மாதிரி விதிகளின்படி தகுதி பெறவில்லை',
    incompleteTitle: 'கூடுதல் தகவல் தேவை',
    benefitLabel: 'திட்டத்தின் நன்மை',
    demoBenefitText:
      'மாதாந்திர திறன் உதவித்தொகை மற்றும் சுயதொழில் பயிற்சி நிதி உதவி (மாதிரி விவரம்).',
    documentsLabel: 'தேவையான ஆவணங்கள்',
    documentsList: [
      'ஆதார் அட்டை (Aadhaar)',
      'வங்கி கணக்கு விவரங்கள் (Bank Details)',
      'வருமானச் சான்றிதழ் (Income Certificate)',
    ],
    nextStepsLabel: 'அடுத்த கட்ட நடவடிக்கைகள்',
    nextStepsList: [
      'தேவையான ஆவணங்களை தயாராக வைத்திருக்கவும்.',
      'அதிகாரப்பூர்வ அரசு இணையதளத்தில் தற்போதைய விவரங்களை சரிபார்க்கவும்.',
    ],
    demoNotice:
      'மாதிரி தகவல் மட்டுமே — அதிகாரப்பூர்வ அரசு தளத்தில் உண்மை விவரங்களை சரிபார்க்கவும்.',
    askAnotherQuestion: 'NilaAI-யிடம் மற்றொரு கேள்வி கேட்கவும்',
    privacyNotice: 'உங்கள் உரையாடல் இந்த அமர்வில் உதவி வழங்க மட்டுமே பயன்படுத்தப்படுகிறது.',
    voiceUnsupportedWarning:
      'இந்த உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை. பதிலாக நீங்கள் உங்கள் கேள்வியை தட்டச்சு செய்யலாம்.',
  },
  hindi: {
    key: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    scriptDescription: 'उत्तर एवं मध्य भारत',
    speechCode: 'hi-IN',
    welcomeGreeting:
      'नमस्ते! मैं NilaAI हूँ। मैं आपको सरकारी सहायता या योजना के बारे में जानकारी पाने में मदद करूँगा। सबसे पहले, आपकी उम्र कितनी है?',
    confirmationText: 'आपने हिन्दी चुनी है।',
    continueButton: 'आगे बढ़ें',
    changeLanguage: 'भाषा बदलें',
    startAgain: 'पुनः आरंभ करें',
    demoModeBadge: 'डेमो मोड (DEMO)',
    tagline: 'आपकी आवाज़। आपकी भाषा। आपका मार्गदर्शन।',
    orbStates: {
      idle: 'बोलने के लिए दबाएं',
      listening: 'सुन रहा है…',
      processing: 'समझ रहा है…',
      speaking: 'NilaAI बोल रहा है…',
      stopSpeaking: 'रोकें',
    },
    inputPlaceholder: 'यहाँ अपना प्रश्न लिखें...',
    sendButton: 'भेजें',
    quickPrompts: [
      'मुझे सरकारी सहायता चाहिए',
      '28 वर्ष',
      'तमिलनाडु',
      '150000',
    ],
    switchQuestion: (langName) =>
      `आप ${langName} में बात कर रहे हैं। क्या आप ${langName} में जारी रखना चाहते हैं?`,
    switchYes: 'हाँ, बदलें',
    switchNo: 'नहीं',
    switchAck: 'ठीक है। अब हम हिन्दी में बात करेंगे।',
    resultTitle: 'आपका परिणाम',
    eligibleTitle: 'आप पात्र हो सकती हैं',
    notEligibleTitle: 'डेमो मानदंडों के अनुसार पात्र नहीं हैं',
    incompleteTitle: 'अधिक जानकारी की आवश्यकता है',
    benefitLabel: 'योजना का लाभ',
    demoBenefitText:
      'मासिक कौशल वजीफा और आजीविका प्रशिक्षण वित्तीय सहायता (डेमो विवरण)।',
    documentsLabel: 'आवश्यक दस्तावेज़',
    documentsList: [
      'आधार कार्ड (Aadhaar)',
      'बैंक खाता विवरण (Bank Account Details)',
      'आय प्रमाण पत्र (Income Certificate)',
    ],
    nextStepsLabel: 'अगले कदम',
    nextStepsList: [
      'आवश्यक दस्तावेज़ तैयार रखें।',
      'आधिकारिक सरकारी पोर्टल पर वर्तमान जानकारी सत्यापित करें।',
    ],
    demoNotice:
      'केवल डेमो जानकारी — आधिकारिक सरकारी पोर्टल पर विवरण सत्यापित करें।',
    askAnotherQuestion: 'NilaAI से दूसरा सवाल पूछें',
    privacyNotice: 'आपकी बातचीत केवल इस सत्र में सहायता प्रदान करने के लिए उपयोग की जाती है।',
    voiceUnsupportedWarning:
      'इस ब्राउज़र में वॉइस पहचान समर्थित नहीं है। आप इसके बजाय टाइप कर सकते हैं।',
  },
  telugu: {
    key: 'telugu',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    scriptDescription: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ',
    speechCode: 'te-IN',
    welcomeGreeting:
      'నమస్కారం! నేను NilaAI. ప్రభుత్వ సహాయం లేదా పథకం గురించి తెలుసుకోవడానికి మీకు సహాయం చేస్తాను. ముందుగా, మీ వయస్సు ఎంత?',
    confirmationText: 'మీరు తెలుగును ఎంచుకున్నారు.',
    continueButton: 'కొనసాగండి',
    changeLanguage: 'భాషను మార్చండి',
    startAgain: 'మళ్లీ ప్రారంభించండి',
    demoModeBadge: 'డెమో మోడ్ (DEMO)',
    tagline: 'మీ స్వరం. మీ భాష. మీ మార్గదర్శకం.',
    orbStates: {
      idle: 'మాట్లాడటానికి నొక్కండి',
      listening: 'వింటోంది…',
      processing: 'అర్థం చేసుకుంటోంది…',
      speaking: 'NilaAI మాట్లాడుతోంది…',
      stopSpeaking: 'ఆపండి',
    },
    inputPlaceholder: 'మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...',
    sendButton: 'పంపండి',
    quickPrompts: [
      'నాకు ప్రభుత్వ సహాయం కావాలి',
      '28 సంవత్సరాలు',
      'తమిళనాడు',
      '150000',
    ],
    switchQuestion: (langName) =>
      `మీరు ${langName}లో మాట్లాడుతున్నారు. మీరు ${langName}లో కొనసాగించాలనుకుంటున్నారా?`,
    switchYes: 'అవును, మార్చండి',
    switchNo: 'వద్దు',
    switchAck: 'సరే. ఇప్పుడు మనం తెలుగులో మాట్లాడదాం.',
    resultTitle: 'మీ ఫలితం',
    eligibleTitle: 'మీరు అర్హులు కావచ్చు',
    notEligibleTitle: 'డెమో నిబంధనల ప్రకారం అర్హులు కాదు',
    incompleteTitle: 'మరింత సమాచారం అవసరం',
    benefitLabel: 'పథకం ప్రయోజనం',
    demoBenefitText:
      'నైపుణ్య శిక్షణ స్టైపెండ్ మరియు స్వయం ఉపాధి ఆర్థిక సహాయం (డెమో సమాచారం).',
    documentsLabel: 'కావలసిన పత్రాలు',
    documentsList: [
      'ఆధార్ కార్డు (Aadhaar)',
      'బ్యాంకు ఖాతా వివరాలు (Bank Account)',
      'ఆదాయ ధృవీకరణ పత్రం (Income Certificate)',
    ],
    nextStepsLabel: 'తదుపరి దశలు',
    nextStepsList: [
      'అవసరమైన పత్రాలను సిద్ధంగా ఉంచుకోండి.',
      'అధికారిక ప్రభుత్వ పోర్టల్‌లో ప్రస్తుత వివరాలను సరిచూసుకోండి.',
    ],
    demoNotice:
      'డెమో సమాచారం మాత్రమే — అధికారిక ప్రభుత్వ పోర్టల్‌లో వివరాలను ధృవీకరించండి.',
    askAnotherQuestion: 'NilaAIని మరొక ప్రశ్న అడగండి',
    privacyNotice: 'మీ సంభాషణ ఈ సెషన్‌లో సహాయం అందించడానికి మాత్రమే ఉపయోగించబడుతుంది.',
    voiceUnsupportedWarning:
      'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. మీరు ప్రశ్నను టైప్ చేయవచ్చు.',
  },
  english: {
    key: 'english',
    name: 'English',
    nativeName: 'English',
    scriptDescription: 'Universal Language',
    speechCode: 'en-IN',
    welcomeGreeting:
      'Hello! I’m NilaAI. I can help you understand a government service or scheme. First, what is your age?',
    confirmationText: 'You selected English.',
    continueButton: 'Continue',
    changeLanguage: 'Change Language',
    startAgain: 'Start Again',
    demoModeBadge: 'DEMO MODE',
    tagline: 'Your voice. Your language. Your guidance.',
    orbStates: {
      idle: 'Tap to speak',
      listening: 'Listening…',
      processing: 'Understanding…',
      speaking: 'NilaAI is speaking…',
      stopSpeaking: 'Stop',
    },
    inputPlaceholder: 'Type your message or tap the mic to speak...',
    sendButton: 'Send',
    quickPrompts: [
      'I need government assistance.',
      '28',
      'Tamil Nadu',
      '150000',
    ],
    switchQuestion: (langName) =>
      `You are speaking in ${langName}. Would you like to switch to ${langName}?`,
    switchYes: 'Yes, switch',
    switchNo: 'No, keep English',
    switchAck: "Okay. Let's continue in English.",
    resultTitle: 'Your Result',
    eligibleTitle: 'You May Be Eligible',
    notEligibleTitle: 'Not Eligible Based on Demo Criteria',
    incompleteTitle: 'More Information Needed',
    benefitLabel: 'Scheme Benefit',
    demoBenefitText:
      'Monthly skill stipend & self-employment training support (Demo benefit information).',
    documentsLabel: 'Documents Needed',
    documentsList: [
      'Aadhaar card',
      'Bank account details',
      'Income certificate',
    ],
    nextStepsLabel: 'Next Steps',
    nextStepsList: [
      'Keep required documents ready.',
      'Verify current details on the official government portal.',
    ],
    demoNotice:
      'Demo information only — verify current details on the official government portal.',
    askAnotherQuestion: 'Ask NilaAI Another Question',
    privacyNotice:
      'Your conversation is used only to provide assistance in this session.',
    voiceUnsupportedWarning:
      'Voice recognition is not supported in this browser. You can type your question instead.',
  },
};
