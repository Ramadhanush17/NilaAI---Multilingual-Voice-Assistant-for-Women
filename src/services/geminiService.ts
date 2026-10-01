import { CollectedData, LanguageKey } from '../types';
import { LANGUAGES } from '../constants/languages';

interface GeminiChatResponse {
  reply: string;
  extracted?: {
    age?: number | null;
    state?: string | null;
    income?: number | null;
  };
  source?: string;
}

export async function sendChatMessage(
  message: string,
  language: LanguageKey,
  conversationHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
  collectedData: CollectedData
): Promise<GeminiChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
        conversationHistory,
        collectedData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data: GeminiChatResponse = await response.json();
    return data;
  } catch (error) {
    console.warn('Network or API error, using local fallback:', error);

    // Local deterministic fallback
    const langConfig = LANGUAGES[language] || LANGUAGES.english;
    const lower = message.toLowerCase();
    const updated: CollectedData = { ...collectedData };

    // Extract age
    const ageMatch = message.match(/(?:age|வயது|उम्र|వయస్సు)?\s*(\b[1-9][0-9]\b)/i);
    if (ageMatch && ageMatch[1]) {
      const num = parseInt(ageMatch[1], 10);
      if (num >= 15 && num <= 90) updated.age = num;
    }

    // Extract state
    if (/tamil\s*nadu|தமிழ்நாடு|तमिलनाडु|తమిళనాడు/i.test(message)) {
      updated.state = 'Tamil Nadu';
    } else if (/andhra|telangana|kerala|karnataka/i.test(lower)) {
      updated.state = 'Other State';
    }

    // Extract income
    const cleanNum = message.replace(/,/g, '');
    const incomeMatch = cleanNum.match(/(\d{4,8})/);
    if (incomeMatch) {
      updated.income = parseInt(incomeMatch[1], 10);
    }

    let reply = '';
    if (/tailor|sewing|தையல்|सिलाई|టైలరింగ్|skill|course|training/i.test(lower)) {
      reply =
        language === 'tamil'
          ? 'தையல் பயிற்சி, கணினி கல்வி, கைவினைப் பொருட்கள் தயாரிப்பு போன்ற இலவச பயிற்சிகளுக்கு அரசு உதவி வழங்குகிறது. உங்கள் வயது என்ன என்று சொன்னால் உங்களுக்கு ஏற்ற திட்டத்தை பார்க்கலாம்.'
          : language === 'hindi'
          ? 'सिलाई, कढ़ाई, हस्तशिल्प और कंप्यूटर प्रशिक्षण के लिए सरकार द्वारा कई निःशुल्क कार्यक्रम चलाए जा रहे हैं। कृपया अपनी उम्र बताएं ताकि हम उपयुक्त योजना चुन सकें।'
          : language === 'telugu'
          ? 'టైలరింగ్, హస్తకళలు మరియు కంప్యూటర్ నైపుణ్యాలలో మహిళలకు ఉచిత శిక్షణలు అందుబాటులో ఉన్నాయి. మీ వయస్సు వివరాలు చెబితే తగిన పథకాన్ని చూడవచ్చు.'
          : 'There are free training programs available in tailoring, handicrafts, digital literacy, and entrepreneurship. What is your age so I can recommend the right options?';
    } else if (/loan|money|credit|கடன்|ऋण|రుణం|mudra|bank/i.test(lower)) {
      reply =
        language === 'tamil'
          ? 'பெண்கள் சுய உதவி குழுக்கள் மற்றும் முத்ரா யோஜனா மூலம் குறைந்த வட்டியில் கடன்கள் கிடைக்கின்றன. உங்கள் வயது மற்றும் மாநிலத்தை சொன்னால் தகுதியான திட்டங்களை கூறுகிறேன்.'
          : language === 'hindi'
          ? 'महिला स्वयं सहायता समूह और मुद्रा योजना के तहत आसान ऋण उपलब्ध हैं। आपकी उम्र और राज्य जानकर मैं आपको सही जानकारी दे सकती हूँ।'
          : language === 'telugu'
          ? 'స్వయం సహాయక సంఘాలు మరియు ముద్ర పథకం ద్వారా మహిళలకు రాయితీతో కూడిన రుణాలు లభిస్తాయి. మీ వయస్సు మరియు రాష్ట్రం చెబితే పూర్తి వివరాలు అందిస్తాను.'
          : 'Women entrepreneurs can access low-interest loans through Self-Help Groups and the Mudra Scheme. What is your age and state so I can guide you further?';
    } else if (!updated.age) {
      reply =
        language === 'tamil'
          ? 'நிச்சயமாக! நான் உங்களுக்கு முழுமையாக உதவ இங்கே இருக்கிறேன். பெண்களுக்கு பல சிறந்த அரசு நலத்திட்டங்கள் மற்றும் திறன் பயிற்சிகள் உள்ளன. உங்களுக்குப் பொருத்தமான திட்டத்தைக் கண்டறிய, முதலில் உங்கள் வயது என்ன என்று சொல்லுங்கள்?'
          : language === 'hindi'
          ? 'बिल्कुल! मैं आपकी पूरी सहायता करने के लिए यहाँ हूँ। महिलाओं के लिए कई सरकारी कल्याणकारी योजनाएं और कौशल प्रशिक्षण उपलब्ध हैं। आपके लिए सही योजना जानने के लिए, पहले मुझे अपनी उम्र बताइए?'
          : language === 'telugu'
          ? 'ఖచ్చితంగా! మీకు పూర్తిగా సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. మహిళల కోసం ఎన్నో ప్రభుత్వ సంక్షేమ పథకాలు మరియు ఉపాధి శిక్షణలు ఉన్నాయి. మీకు తగిన పథకాన్ని తెలుసుకోవడానికి, ముందుగా మీ వయస్సు ఎంతో చెప్పండి?'
          : 'Of course! I am here to have a full conversation and guide you every step of the way. There are wonderful government support schemes and skill training programs for women. To find the right ones for you, could you please tell me your age?';
    } else if (!updated.state) {
      reply =
        language === 'tamil'
          ? 'நன்றி! உங்கள் வயதுக்கு பல நல்ல வாய்ப்புகள் உள்ளன. அடுத்ததாக, நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள் என்று சொல்லுங்கள்?'
          : language === 'hindi'
          ? 'धन्यवाद! आपकी उम्र के लिए कई बेहतरीन योजनाएं हैं। कृपया मुझे बताएं कि आप किस राज्य में रहती हैं?'
          : language === 'telugu'
          ? 'ధన్యవాదాలు! మీ వయస్సుకు ఎన్నో మంచి అవకాశాలు ఉన్నాయి. దయచేసి మీరు ఏ రాష్ట్రంలో నివసిస్తున్నారో చెప్పండి?'
          : 'Thank you! There are great opportunities available for your age group. Next, which state do you currently live in?';
    } else if (!updated.income) {
      reply =
        language === 'tamil'
          ? 'அருமை! தமிழ்நாட்டில் பெண்களுக்கு பல சிறப்பு ஆதரவு திட்டங்கள் உள்ளன. இறுதியாக, உங்கள் குடும்பத்தின் தோராயமான ஆண்டு வருமானம் என்ன என்று சொல்லுங்கள்?'
          : language === 'hindi'
          ? 'बहुत बढ़िया! महिलाओं के लिए विशेष सहायता योजनाएं हैं। अंत में, कृपया अपनी लगभग वार्षिक पारिवारिक आय बताएं?'
          : language === 'telugu'
          ? 'చాలా బాగుంది! మహిళల కోసం ప్రత్యేక సహాయ పథకాలు ఉన్నాయి. చివరిగా, మీ కుటుంబ సుమారు వార్షిక ఆదాయం ఎంతో చెప్పండి?'
          : 'Wonderful! There are focused support initiatives in that region. Finally, could you share your approximate annual family income?';
    } else {
      reply =
        language === 'tamil'
          ? 'மிக்க நன்றி! உங்கள் தகவல்கள் முழுமையாக பெறப்பட்டன. உங்களுக்கான மாதிரி திட்ட தகுதி மற்றும் தேவையான ஆவணங்களை இப்போது பார்க்கவும்.'
          : language === 'hindi'
          ? 'बहुत-बहुत धन्यवाद! आपकी सभी जानकारी प्राप्त हो गई है। आइए अब आपकी पात्रता और आवश्यक दस्तावेज़ देखते हैं।'
          : language === 'telugu'
          ? 'చాలా ధన్యవాదాలు! మీ వివరాలన్నీ పూర్తిగా లభించాయి. మీ అర్హత ఫలితం మరియు కావలసిన పత్రాలను ఇప్పుడు పరిశీలిద్దాం.'
          : 'Thank you so much! All your details have been received. Let us review your complete eligibility and required documents now.';
    }

    return {
      reply,
      extracted: updated,
      source: 'client-fallback',
    };
  }
}
