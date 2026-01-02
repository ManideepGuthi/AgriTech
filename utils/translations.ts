
import { Language } from '../types';

export const translations = {
  en: {
    app: {
      title: 'AgriTech',
      subtitle: 'Smart Millet Farming',
      tagline: 'Trusted by 10,000+ Farmers',
      loading: 'Loading...'
    },
    nav: {
      dashboard: 'Dashboard',
      doctor: 'Crop Doctor',
      guide: 'Assistant',
      land: 'Land Check',
      maps: 'Maps',
      community: 'Community',
      market: 'Marketplace',
      profile: 'Profile'
    },
    community: {
      title: 'Farmer Community',
      share: 'Share your thoughts or ask a question...',
      post: 'Post',
      likes: 'Likes',
      comments: 'Comments',
      noPosts: 'No posts yet. Be the first to share!',
      postedBy: 'Posted by'
    },
    auth: {
      welcome: 'Welcome Back!',
      join: 'Join AgriTech',
      subtitle_in: 'Access your AI dashboard',
      subtitle_up: 'Start your smart farming journey',
      name: 'Full Name',
      phone: 'Phone Number',
      location: 'Location (Village, District)',
      farmSize: 'Farm Size (Acres)',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      login: 'Sign In',
      register: 'Register',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      error_pass_mismatch: 'Passwords do not match',
      error_phone: 'Please enter a valid 10-digit phone number',
      error_fill: 'Please fill in all fields correctly'
    },
    dashboard: {
      overview: 'Overview',
      weather: 'Field Conditions',
      market: 'Market Prices',
      myCrops: 'My Crops',
      addCrop: 'Add Crop',
      profitCalc: 'Profit Calculator',
      noCrops: 'No crops added yet. Add your millet crops to track them.',
      tasks: "Today's Tasks",
      yield: 'Yield',
      income: 'Est. Income',
      advisory: 'Agri-Advisory'
    },
    doctor: {
      title: 'Millet Crop Doctor',
      subtitle: 'Advanced AI diagnosis for diseases',
      scan: 'Tap to Scan Crop',
      analyzing: 'Analyzing...',
      diagnosis: 'Diagnosis',
      treatment: 'Treatment',
      prevention: 'Prevention',
      history: 'Past Scans',
      upload_error: 'Image too large',
      healthy: 'Healthy',
      ask_expert: 'Ask Expert about this'
    },
    land: {
      title: 'Land Suitability Check',
      soil: 'Soil Type',
      ph: 'pH Level',
      water: 'Water Source',
      analyze: 'Analyze Potential',
      history: 'Previous Reports',
      score: 'Suitability Score',
      crops: 'Recommended Millets'
    },
    maps: {
      title: 'Agricultural Maps',
      view: 'View Map',
      features: 'Farmer Features',
      markets: 'Nearby Markets',
      soil_centers: 'Soil Testing Centers',
      weather_stations: 'Weather Stations',
      storage: 'Cold Storage'
    },
    profile: {
      info: 'Farmer Information',
      settings: 'App Settings',
      language: 'App Language',
      save: 'Save Changes',
      edit: 'Edit Profile',
      logout: 'Sign Out',
      help: 'Help & Support'
    },
    market: {
      title: 'Marketplace',
      buy: 'Buy',
      sell: 'Sell Item',
      crops: 'Crops',
      equipment: 'Equipment',
      price: 'Price',
      contact: 'Contact Seller',
      location: 'Location',
      noItems: 'No items listed yet.',
      postItem: 'List an Item',
      itemName: 'Item Name',
      itemType: 'Item Type',
      description: 'Description',
      unit: 'Unit (e.g., kg, hour)'
    }
  },
  hi: {
    app: {
      title: 'एग्रीटेक',
      subtitle: 'स्मार्ट बाजरा खेती',
      tagline: '10,000+ किसानों का भरोसा',
      loading: 'लोड हो रहा है...'
    },
    nav: {
      dashboard: 'डैशबोर्ड',
      doctor: 'फसल डॉक्टर',
      guide: 'सहायक',
      land: 'भूमि जाँच',
      maps: 'नक्शे',
      community: 'किसान मंच',
      market: 'बाज़ार',
      profile: 'प्रोफाइल'
    },
    community: {
      title: 'किसान मंच',
      share: 'अपने विचार साझा करें या प्रश्न पूछें...',
      post: 'पोस्ट करें',
      likes: 'पसंद',
      comments: 'टिप्पणियाँ',
      noPosts: 'अभी तक कोई पोस्ट नहीं। सबसे पहले साझा करें!',
      postedBy: 'द्वारा पोस्ट किया गया'
    },
    auth: {
      welcome: 'स्वागत है!',
      join: 'एग्रीटेक से जुड़ें',
      subtitle_in: 'अपने डैशबोर्ड तक पहुँचें',
      subtitle_up: 'अपनी स्मार्ट खेती की यात्रा शुरू करें',
      name: 'पूरा नाम',
      phone: 'फ़ोन नंबर',
      location: 'स्थान (गाँव, जिला)',
      farmSize: 'खेत का आकार (एकड़)',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      login: 'लॉग इन करें',
      register: 'रजिस्टर करें',
      noAccount: 'खाता नहीं है?',
      hasAccount: 'पहले से खाता है?',
      error_pass_mismatch: 'पासवर्ड मेल नहीं खाते',
      error_phone: 'कृपया मान्य 10-अंकीय फ़ोन नंबर दर्ज करें',
      error_fill: 'कृपया सभी फ़ील्ड सही ढंग से भरें'
    },
    dashboard: {
      overview: 'अवलोकन',
      weather: 'मौसम की स्थिति',
      market: 'मंडी भाव',
      myCrops: 'मेरी फसलें',
      addCrop: 'फसल जोड़ें',
      profitCalc: 'लाभ कैलकुलेटर',
      noCrops: 'कोई फसल नहीं जोड़ी गई। ट्रैक करने के लिए जोड़ें।',
      tasks: 'आज के कार्य',
      yield: 'उपज',
      income: 'अनुमानित आय',
      advisory: 'कृषि सलाह'
    },
    doctor: {
      title: 'फसल डॉक्टर',
      subtitle: 'रोगों के लिए एआई निदान',
      scan: 'फसल स्कैन करें',
      analyzing: 'विश्लेषण हो रहा है...',
      diagnosis: 'निदान',
      treatment: 'उपचार',
      prevention: 'रोकथाम',
      history: 'पिछले स्कैन',
      upload_error: 'छवि बहुत बड़ी है',
      healthy: 'स्वस्थ',
      ask_expert: 'विशेषज्ञ से पूछें'
    },
    land: {
      title: 'भूमि उपयुक्तता जाँच',
      soil: 'मिट्टी का प्रकार',
      ph: 'pH स्तर',
      water: 'जल स्रोत',
      analyze: 'विश्लेषण करें',
      history: 'पिछली रिपोर्ट',
      score: 'उपयुक्तता स्कोर',
      crops: 'अनुशंसित फसलें'
    },
    maps: {
      title: 'कृषि मानचित्र',
      view: 'नक्शा देखें',
      features: 'किसान सुविधाएँ',
      markets: 'निकटतम मंडी',
      soil_centers: 'मिट्टी परीक्षण केंद्र',
      weather_stations: 'मौसम केंद्र',
      storage: 'शीत भंडार'
    },
    profile: {
      info: 'किसान की जानकारी',
      settings: 'ऐप सेटिंग्स',
      language: 'ऐप की भाषा',
      save: 'परिवर्तन सहेजें',
      edit: 'प्रोफाइल संपादित करें',
      logout: 'साइन आउट करें',
      help: 'सहायता'
    },
    market: {
      title: 'बाज़ार',
      buy: 'खरीदें',
      sell: 'बेचें',
      crops: 'फसलें',
      equipment: 'उपकरण',
      price: 'कीमत',
      contact: 'विक्रेता से संपर्क करें',
      location: 'स्थान',
      noItems: 'कोई आइटम उपलब्ध नहीं है',
      postItem: 'आइटम सूची बनाएं',
      itemName: 'आइटम का नाम',
      itemType: 'आइटम प्रकार',
      description: 'विवरण',
      unit: 'इकाई'
    }
  },
  kn: {
    app: {
      title: 'ಅಗ್ರಿಟೆಕ್',
      subtitle: 'ಸ್ಮಾರ್ಟ್ ಸಿರಿಧಾನ್ಯ ಕೃಷಿ',
      tagline: '10,000+ ರೈತರ ನಂಬಿಕೆ',
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...'
    },
    nav: {
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      doctor: 'ಬೆಳೆ ವೈದ್ಯ',
      guide: 'ಸಹಾಯಕ',
      land: 'ಭೂಮಿ ಪರೀಕ್ಷೆ',
      maps: 'ನಕ್ಷೆಗಳು',
      community: 'ರೈತ ಸಮುದಾಯ',
      market: 'ಮಾರುಕಟ್ಟೆ',
      profile: 'ಪ್ರೊಫೈಲ್'
    },
    community: {
      title: 'ರೈತ ವೇದಿಕೆ',
      share: 'ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...',
      post: 'ಪೋಸ್ಟ್ ಮಾಡಿ',
      likes: 'ಇಷ್ಟಗಳು',
      comments: 'ಕಾಮೆಂಟ್‌ಗಳು',
      noPosts: 'ಇನ್ನೂ ಯಾವುದೇ ಪೋಸ್ಟ್‌ಗಳಿಲ್ಲ.',
      postedBy: 'ಪೋಸ್ಟ್ ಮಾಡಿದವರು'
    },
    auth: {
      welcome: 'ಸ್ವಾಗತ!',
      join: 'ಅಗ್ರಿಟೆಕ್ ಸೇರಿ',
      subtitle_in: 'ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಿ',
      subtitle_up: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿಯನ್ನು ಪ್ರಾರಂಭಿಸಿ',
      name: 'ಪೂರ್ಣ ಹೆಸರು',
      phone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
      location: 'ಸ್ಥಳ (ಗ್ರಾಮ, ಜಿಲ್ಲೆ)',
      farmSize: 'ಜಮೀನು ಗಾತ್ರ (ಎಕರೆ)',
      password: 'ಪಾಸ್‌ವರ್ಡ್',
      confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
      login: 'ಲಾಗಿನ್ ಮಾಡಿ',
      register: 'ನೋಂದಾಯಿಸಿ',
      noAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
      hasAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
      error_pass_mismatch: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ',
      error_phone: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
      error_fill: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಸರಿಯಾಗಿ ಭರ್ತಿ ಮಾಡಿ'
    },
    dashboard: {
      overview: 'ಅವಲೋಕನ',
      weather: 'ಹವಾಮಾನ',
      market: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
      myCrops: 'ನನ್ನ ಬೆಳೆಗಳು',
      addCrop: 'ಬೆಳೆ ಸೇರಿಸಿ',
      profitCalc: 'ಲಾಭ ಲೆಕ್ಕಾಚಾರ',
      noCrops: 'ಯಾವುದೇ ಬೆಳೆಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ.',
      tasks: 'ಇಂದಿನ ಕೆಲಸಗಳು',
      yield: 'ಇಳುವರಿ',
      income: 'ಅಂದಾಜು ಆದಾಯ',
      advisory: 'ಕೃಷಿ ಸಲಹೆ'
    },
    doctor: {
      title: 'ಬೆಳೆ ವೈದ್ಯ',
      subtitle: 'ರೋಗಗಳಿಗೆ AI ರೋಗನಿರ್ಣಯ',
      scan: 'ಬೆಳೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
      analyzing: 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      diagnosis: 'ರೋಗನಿರ್ಣಯ',
      treatment: 'ಚಿಕಿತ್ಸೆ',
      prevention: 'ತಡೆಗಟ್ಟುವಿಕೆ',
      history: 'ಹಿಂದಿನ ಸ್ಕ್ಯಾನ್‌ಗಳು',
      upload_error: 'ಚಿತ್ರ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ',
      healthy: 'ಆರೋಗ್ಯಕರ',
      ask_expert: 'ತಜ್ಞರನ್ನು ಕೇಳಿ'
    },
    land: {
      title: 'ಭೂಮಿ ಸೂಕ್ತತೆ ಪರೀಕ್ಷೆ',
      soil: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ',
      ph: 'pH ಮಟ್ಟ',
      water: 'ನೀರಿನ ಮೂಲ',
      analyze: 'ವಿಶ್ಲೇಷಿಸಿ',
      history: 'ಹಿಂದಿನ ವರದಿಗಳು',
      score: 'ಸೂಕ್ತತೆ ಅಂಕ',
      crops: 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು'
    },
    profile: {
      info: 'ರೈತರ ಮಾಹಿತಿ',
      settings: 'ಅಪ್ಲಿಕೇಶನ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
      language: 'ಭಾಷೆ',
      save: 'ಉಳಿಸಿ',
      edit: 'ಪ್ರೊಫೈಲ್ ತಿದ್ದು',
      logout: 'ಹೊರಬನ್ನಿ',
      help: 'ಸಹಾಯ'
    },
    market: {
      title: 'Marketplace',
      buy: 'Buy',
      sell: 'Sell Item',
      crops: 'Crops',
      equipment: 'Equipment',
      price: 'Price',
      contact: 'Contact Seller',
      location: 'Location',
      noItems: 'No items listed yet.',
      postItem: 'List an Item',
      itemName: 'Item Name',
      itemType: 'Item Type',
      description: 'Description',
      unit: 'Unit (e.g., kg, hour)'
    }
  },
  te: {
    app: {
      title: 'అగ్రిటెక్',
      subtitle: 'స్మార్ట్ మిల్లెట్ ఫార్మింగ్',
      tagline: '10,000+ రైతుల నమ్మకం',
      loading: 'లోడ్ అవుతోంది...'
    },
    nav: {
      dashboard: 'డ్యాష్‌బోర్డ్',
      doctor: 'పంట డాక్టర్',
      guide: 'సహాయకుడు',
      land: 'భూమి పరీక్ష',
      maps: 'మ్యాప్స్',
      community: 'రైతు వేదిక',
      market: 'మార్కెట్',
      profile: 'ప్రొఫైల్'
    },
    community: {
      title: 'రైతు వేదిక',
      share: 'మీ ఆలోచనలను పంచుకోండి...',
      post: 'పోస్ట్ చేయండి',
      likes: 'ఇష్టాలు',
      comments: 'వ్యాఖ్యలు',
      noPosts: 'ఇంకా పోస్ట్‌లు లేవు.',
      postedBy: 'పోస్ట్ చేసినవారు'
    },
    auth: {
      welcome: 'స్వాగతం!',
      join: 'అగ్రిటెక్ లో చేరండి',
      subtitle_in: 'మీ డ్యాష్‌బోర్డ్‌ను యాక్సెస్ చేయండి',
      subtitle_up: 'మీ స్మార్ట్ వ్యవసాయ ప్రయాణాన్ని ప్రారంభించండి',
      name: 'పూర్తి పేరు',
      phone: 'ఫోన్ నంబర్',
      location: 'ప్రాంతం (గ్రామం, జిల్లా)',
      farmSize: 'పొలం విస్తీర్ణం (ఎకరాలు)',
      password: 'పాస్‌వర్డ్',
      confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
      login: 'లాగిన్ చేయండి',
      register: 'నమోదు చేయండి',
      noAccount: 'ఖాతా లేదా?',
      hasAccount: 'ఇప్పటికే ఖాతా ఉందా?',
      error_pass_mismatch: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు',
      error_phone: 'దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్‌ను నమోదు చేయండి',
      error_fill: 'దయచేసి అన్ని వివరాలను సరిగ్గా నింపండి'
    },
    dashboard: {
      overview: 'అవలోకనం',
      weather: 'వాతావరణం',
      market: 'మార్కెట్ ధరలు',
      myCrops: 'నా పంటలు',
      addCrop: 'పంటను జోడించండి',
      profitCalc: 'లాభాల కాలిక్యులేటర్',
      noCrops: 'ఇంకా ఏ పంటలు జోడించలేదు.',
      tasks: 'ఈనాటి పనులు',
      yield: 'దిగుబడి',
      income: 'అంచనా ఆదాయం',
      advisory: 'వ్యవసాయ సలహా'
    },
    doctor: {
      title: 'పంట డాక్టర్',
      subtitle: 'తెగుళ్ళ కోసం AI నిర్ధారణ',
      scan: 'పంటను స్కాన్ చేయండి',
      analyzing: 'విశ్లేషిస్తోంది...',
      diagnosis: 'నిర్ధారణ',
      treatment: 'చికిత్స',
      prevention: 'నివారణ',
      history: 'గత స్కాన్‌లు',
      upload_error: 'చిత్రం చాలా పెద్దది',
      healthy: 'ఆరోగ్యకరమైన',
      ask_expert: 'నిపుణుడిని అడగండి'
    },
    land: {
      title: 'భూమి అనుకూలత పరీక్ష',
      soil: 'మట్టి రకం',
      ph: 'pH స్థాయి',
      water: 'నీటి వనరు',
      analyze: 'విశ్లేషించండి',
      history: 'గత నివేదికలు',
      score: 'అనుకూలత స్కోర్',
      crops: 'సిఫార్సు చేసిన పంటలు'
    },
    profile: {
      info: 'రైతు సమాచారం',
      settings: 'యాప్ సెట్టింగ్‌లు',
      language: 'భాష',
      save: 'సేవ్ చేయండి',
      edit: 'ప్రొఫైల్ సవరించండి',
      logout: 'సైన్ అవుట్',
      help: 'సహాయం'
    },
    market: {
      title: 'Marketplace',
      buy: 'Buy',
      sell: 'Sell Item',
      crops: 'Crops',
      equipment: 'Equipment',
      price: 'Price',
      contact: 'Contact Seller',
      location: 'Location',
      noItems: 'No items listed yet.',
      postItem: 'List an Item',
      itemName: 'Item Name',
      itemType: 'Item Type',
      description: 'Description',
      unit: 'Unit (e.g., kg, hour)'
    }
  }
};
