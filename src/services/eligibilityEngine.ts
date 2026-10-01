import { CollectedData, EligibilityResult, LanguageKey } from '../types';
import { LANGUAGES } from '../constants/languages';

export function calculateEligibility(
  data: CollectedData,
  langKey: LanguageKey
): EligibilityResult {
  const langConfig = LANGUAGES[langKey] || LANGUAGES.english;
  const reasons: string[] = [];

  // Check for missing data
  if (data.age === null || data.state === null || data.income === null) {
    if (data.age === null) reasons.push(langKey === 'tamil' ? 'வயது தேவை' : langKey === 'hindi' ? 'उम्र आवश्यक है' : langKey === 'telugu' ? 'వయస్సు అవసరం' : 'Age needed');
    if (data.state === null) reasons.push(langKey === 'tamil' ? 'மாநிலம் தேவை' : langKey === 'hindi' ? 'राज्य आवश्यक है' : langKey === 'telugu' ? 'రాష్ట్రం అవసరం' : 'State needed');
    if (data.income === null) reasons.push(langKey === 'tamil' ? 'வருமானம் தேவை' : langKey === 'hindi' ? 'आय आवश्यक है' : langKey === 'telugu' ? 'ఆదాయం అవసరం' : 'Income needed');

    return {
      status: 'incomplete',
      schemeName: 'Demo Women Support Scheme',
      schemeDescription: 'Demo data created for hackathon demonstration.',
      statusTitle: langConfig.incompleteTitle,
      benefit: langConfig.demoBenefitText,
      requiredDocuments: langConfig.documentsList,
      nextSteps: langConfig.nextStepsList,
      disclaimer: langConfig.demoNotice,
      reasons,
    };
  }

  const isAgeValid = data.age >= 18 && data.age <= 60;
  const isStateValid = /tamil\s*nadu|தமிழ்நாடு|तमिलनाडु|తమిళనాడు/i.test(data.state);
  const isIncomeValid = data.income <= 300000;

  if (!isAgeValid) {
    reasons.push(
      langKey === 'tamil'
        ? `வயது 18 முதல் 60க்குள் இருக்க வேண்டும் (உங்கள் வயது: ${data.age})`
        : langKey === 'hindi'
        ? `उम्र 18 से 60 के बीच होनी चाहिए (आपकी उम्र: ${data.age})`
        : langKey === 'telugu'
        ? `వయస్సు 18 నుండి 60 మధ్య ఉండాలి (మీ వయస్సు: ${data.age})`
        : `Age must be between 18 and 60 (provided: ${data.age})`
    );
  }

  if (!isStateValid) {
    reasons.push(
      langKey === 'tamil'
        ? `மாநிலம் தமிழ்நாடு ஆக இருக்க வேண்டும் (வழங்கப்பட்டது: ${data.state})`
        : langKey === 'hindi'
        ? `राज्य तमिलनाडु होना चाहिए (दिया गया: ${data.state})`
        : langKey === 'telugu'
        ? `రాష్ట్రం తమిళనాడు అయి ఉండాలి (ఇచ్చినది: ${data.state})`
        : `State must be Tamil Nadu (provided: ${data.state})`
    );
  }

  if (!isIncomeValid) {
    reasons.push(
      langKey === 'tamil'
        ? `ஆண்டு வருமானம் ₹3,00,000க்கு குறைவாக இருக்க வேண்டும் (வழங்கப்பட்டது: ₹${data.income.toLocaleString('en-IN')})`
        : langKey === 'hindi'
        ? `वार्षिक आय ₹3,00,000 से कम होनी चाहिए (दी गई: ₹${data.income.toLocaleString('en-IN')})`
        : langKey === 'telugu'
        ? `వార్షిక ఆదాయం ₹3,00,000 లోపు ఉండాలి (ఇచ్చినది: ₹${data.income.toLocaleString('en-IN')})`
        : `Annual income must be under ₹3,00,000 (provided: ₹${data.income.toLocaleString('en-IN')})`
    );
  }

  const isEligible = isAgeValid && isStateValid && isIncomeValid;

  return {
    status: isEligible ? 'eligible' : 'not_eligible',
    schemeName: 'Demo Women Support Scheme',
    schemeDescription: 'Demo data created for hackathon demonstration.',
    statusTitle: isEligible ? langConfig.eligibleTitle : langConfig.notEligibleTitle,
    benefit: langConfig.demoBenefitText,
    requiredDocuments: langConfig.documentsList,
    nextSteps: langConfig.nextStepsList,
    disclaimer: langConfig.demoNotice,
    reasons,
  };
}
