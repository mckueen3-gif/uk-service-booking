import { Dictionary } from '../dictionary';

export const hi: any = {
  nav: { browse: "सेवाएं देखें", join: "विशेषज्ञ बनें", login: "लॉगिन", register: "पंजीकरण", logout: "लॉगआउट", dashboard: "डैशबोर्ड", aiDiagnosis: "AI निदान", education: "शिक्षा", quickActions: "त्वरित कार्रवाई", exploreServices: "सेवाओं का पता लगाएं" },
  legal: { ui: { selectLanguage: "वैश्विक कनेक्टिविटी", close: "प्रोटोकॉल पूर्ण" } },
  landing_pages: {
    plumbing: {
      hero: {
        badge: "एलीट परिशुद्धता",
        title1: "बेहतरीन इंजीनियरिंग",
        title2: "प्लंबिंग और पावर",
        subtitle: "सटीक प्लंबिंग, इलेक्ट्रिकल और हार्डवेयर एकीकरण के लिए प्रमाणित यूके विशेषज्ञों से जुड़ें। गुणवत्ता आश्वासन के लिए AI-निगरानी में।",
        searchPlaceholder: "पाइप मरम्मत, बॉयलर सेवा, रीवायरिंग...",
        searchBtn: "नोड्स स्कैन करें"
      },
      sub_categories: {
        pipe: { title: "पाइप मरम्मत", desc: "आपातकालीन रिसाव का पता लगाना और सटीक हार्डवेयर प्रतिस्थापन।" },
        wiring: { title: "सिस्टम रीवायरिंग", desc: "पेशेवर इलेक्ट्रिकल अंशांकन और नोड एकीकरण।" },
        appliance: { title: "उपकरण एकीकरण", desc: "स्वच्छता और पाक हार्डवेयर की तैनाती और परीक्षण।" },
        boiler: { title: "बॉयलर ऑडिट", desc: "नियामक थर्मल रखरखाव और प्रदर्शन निदान।" },
        switch: { title: "स्विचगियर", desc: "उच्च अखंडता वाले इलेक्ट्रिकल घटक का प्रतिस्थापन।" },
        smart: { title: "स्मार्ट ऑटोमेशन", desc: "मेश नेटवर्क होम ऑटोमेशन और सेंसर की तैनाती।" }
      }
    },
    repairs: {
      hero: {
        badge: "संरचनात्मक अखंडता",
        title1: "अपने नोड को पुनर्स्थापित करें",
        title2: "एलीट रखरखाव",
        subtitle: "फर्नीचर असेंबली से लेकर संरचनात्मक सुधार तक। आपकी सेवा में यूके के शीर्ष 1% रखरखाव विशेषज्ञ।",
        searchPlaceholder: "फर्नीचर असेंबली, दीवार की मरम्मत...",
        searchBtn: "संपर्क खोज"
      },
      sub_categories: {
        furniture: { title: "फर्नीचर असेंबली", desc: "जटिल मॉड्यूलर हार्डवेयर की सटीक असेंबली।" },
        structural: { title: "संरचनात्मक फिक्स्चर", desc: "उच्च-लोड फिक्स्चर की माउंटिंग और अंशांकन।" },
        wall: { title: "दीवार सुधार", desc: "सतह की मरम्मत और संरचनात्मक कोटिंग बहाली।" },
        mounting: { title: "मॉड्यूलर माउंटिंग", desc: "डिजिटल और भौतिक दीवार इकाइयों की सुरक्षित तैनाती।" },
        coating: { title: "कोटिंग", desc: "सौंदर्यपूर्ण और सुरक्षात्मक सतह उपचार।" },
        tactics: { title: "सामान्य रणनीतियाँ", desc: "बहुउद्देशीय घरेलू रखरखाव प्रोटोकॉल।" }
      }
    },
    renovation: {
      hero: {
        badge: "वास्तुकला विकास",
        title1: "अपने रहने की जगह को",
        title2: "री-इंजीनियर करें",
        subtitle: "यूके के एलीट नवीनीकरण विशेषज्ञों के साथ अपनी संपत्ति को बदलें। पारदर्शी टेलीमेट्री और गुणवत्ता-गारंटीकृत परिणाम।",
        searchPlaceholder: "किचन विस्तार, लॉफ्ट रूपांतरण...",
        searchBtn: "प्रोजेक्ट शुरू करें"
      },
      sub_categories: {
        culinary: { title: "पाक और स्वच्छता", desc: "फुल-स्टैक किचन और बाथरूम री-इंजीनियरिंग।" },
        expansion: { title: "विस्तार इकाइयां", desc: "नोड आयतन बढ़ाने के लिए लॉफ्ट और मॉड्यूल विस्तार।" },
        layout: { title: "स्थानिक लेआउट", desc: "होलोग्राफिक डिजाइन और संरचनात्मक पुनर्संरचना।" },
        floor: { title: "फ्लोर मेशिंग", desc: "उच्च-स्थायित्व वाले फर्श की तैनाती और परिष्करण।" },
        landscape: { title: "लैंडस्केप डिजाइन", desc: "बाहरी संपत्ति पर्यावरण इंजीनियरिंग।" },
        design: { title: "डिजाइन संदर्भ", desc: "वास्तुकला ब्लूप्रिंट और सौंदर्य तर्क।" }
      }
    },
    accounting: {
      hero: {
        badge: "वित्तीय शासन",
        title1: "अपने कैपिटल लेजर",
        title2: "में महारत हासिल करें",
        subtitle: "एसएमई और पेशेवरों के लिए एलीट यूके अकाउंटेंट और वित्तीय रणनीतिकार। परिचालन अनुपालन और कर अनुकूलन सुनिश्चित करना।",
        searchPlaceholder: "टैक्स रिटर्न, वार्षिक खाते, पेरोल...",
        searchBtn: "ऑडिट विशेषज्ञ"
      },
      sub_categories: {
        income: { title: "आय ऑडिट", desc: "स्व-मूल्यांकन और व्यक्तिगत आयकर अंशांकन।" },
        accounts: { title: "वार्षिक खाते", desc: "कॉर्पोरेट वित्तीय रिपोर्टिंग और लेजर को अंतिम रूप देना।" },
        tax: { title: "टैक्स फाइलिंग", desc: "HMRC-तैयार टैक्स तैयारी और प्रसारण।" },
        payroll: { title: "पेरोल मेशिंग", desc: "कुशल मानव पूंजी भुगतान प्रणाली।" },
        xero: { title: "जीरो (Xero) अनुकूलन", desc: "क्लाउड अकाउंटिंग एकीकरण और प्रशिक्षण।" },
        fiscal: { title: "वित्तीय विश्लेषण", desc: "गहन व्यावसायिक प्रदर्शन टेलीमेट्री।" }
      }
    },
    legal: {
      hero: {
        badge: "पारिस्थितिकी तंत्र अनुपालन",
        title1: "विशेषज्ञ परामर्श और",
        title2: "कानूनी ढांचा",
        subtitle: "वीजा प्रोटोकॉल, अनुबंध मसौदा तैयार करने और विवाद समाधान सहायता के लिए यूके-प्रमाणित कानूनी विशेषज्ञों से जुड़ें।",
        searchPlaceholder: "वीजा सहायता, संपत्ति कानून, अनुबंध...",
        searchBtn: "संपर्क परामर्श"
      },
      sub_categories: {
        drafting: { title: "SLA ड्राफ्टिंग", desc: "उच्च-सटीक अनुबंध और समझौते का संश्लेषण।" },
        visa: { title: "वीजा अंशांकन", desc: "यूके वीजा और आव्रजन प्रोटोकॉल सहायता।" },
        property: { title: "संपत्ति ढांचा", desc: "कंवेयंसिंग और रियल एस्टेट कानूनी तर्क।" },
        arbitration: { title: "मध्यस्थता", desc: "तटस्थ विवाद समाधान और मध्यस्थता प्रोटोकॉल।" },
        law: { title: "मार्केटप्लेस कानून", desc: "कॉर्पोरेट और वाणिज्यिक शासन सहायता।" },
        notary: { title: "पब्लिक नोटरी", desc: "आधिकारिक दस्तावेज सत्यापन और प्रमाणीकरण।" }
      }
    },
    cleaning: {
      hero: {
        badge: "बायोसेक्युरिटी और स्वच्छता",
        title1: "अपने पर्यावरण को",
        title2: "साफ-सुथरा बनाएं",
        subtitle: "आवासीय और व्यावसायिक नोड्स के लिए एलीट सफाई प्रोटोकॉल। उच्च-अखंडता स्वच्छता और विस्तार पर सावधानीपूर्वक ध्यान।",
        searchPlaceholder: "गहरी सफाई, किराए की समाप्ति पर सफाई...",
        searchBtn: "विशेषज्ञों को तैनात करें"
      },
      sub_categories: {
        hygiene: { title: "आवर्ती स्वच्छता", desc: "मानकीकृत लगातार संपत्ति स्वच्छता।" },
        tenancy: { title: "किराए की समाप्ति", desc: "अधिभोग परिवर्तन के लिए गहन सफाई।" },
        textile: { title: "कपड़ा सफाई", desc: "पेशेवर कालीन और असबाब बहाली।" },
        aperture: { title: "ग्लास सफाई", desc: "ऊंची खिड़की और कांच की स्वच्छता प्रोटोकॉल।" },
        office: { title: "कार्यालय स्वच्छता", desc: "व्यावसायिक कार्य क्षेत्रों के लिए स्वच्छता प्रबंधन।" },
        bio: { title: "जैव सुरक्षा", desc: "विशरण और नैदानिक ग्रेड की सफाई।" }
      }
    },
    car: {
      hero: {
        badge: "हार्डवेयर रखरखाव",
        title1: "शुद्धता ऑटो",
        title2: "इंजीनियरिंग",
        subtitle: "मास्टर यूके मैकेनिक्स के साथ अपने मोबाइल हार्डवेयर का रखरखाव करें। आपकी सेवा में ऑन-साइट निदान और उच्च प्रदर्शन सर्विसिंग।",
        searchPlaceholder: "इंजन डायग्नोस्टिक्स, MOT की तैयारी, ब्रेक...",
        searchBtn: "मैकेनिक स्कैन करें"
      },
      sub_categories: {
        engine: { title: "इंजन डायग्नोस्टिक्स", desc: "उन्नत दोष-खोज और प्रदर्शन ट्यूनिंग।" },
        brakes: { title: "ब्रेक और क्लच", desc: "सुरक्षा-महत्वपूर्ण घर्षण प्रणाली अंशांकन।" },
        mot: { title: "MOT की तैयारी", desc: "नियामक निरीक्षण जांच और सुधार।" },
        ac: { title: "AC अंशांकन", desc: "क्लाइमेट कंट्रोल सिस्टम री-गैसिंग और स्वच्छता।" },
        bodywork: { title: "बॉडी बहाली", desc: "संरचनात्मक और सौंदर्यपूर्ण शेल सुधार।" },
        battery: { title: "पावर और टायर", desc: "बैटरी स्वास्थ्य और टायर प्रदर्शन प्रबंधन।" }
      }
    },
    commercial: {
      hero: {
        badge: "एंटरप्राइज इन्फ्रास्ट्रक्चर",
        title1: "अपने बिजनेस नोड",
        title2: "को ताकत दें",
        subtitle: "यूके व्यावसायिक स्थानों के लिए एंड-टू-एंड इन्फ्रास्ट्रक्चर सहायता। शॉप फिटिंग, कार्यालय माइग्रेशन और औद्योगिक रखरखाव।",
        searchPlaceholder: "शॉप फिटिंग, IT मेश, HVAC...",
        searchBtn: "प्रदाताओं का ऑडिट"
      },
      sub_categories: {
        fitting: { title: "यूनिट फिटिंग", desc: "खुदरा और व्यावसायिक स्थान इंटीरियर इंजीनियरिंग।" },
        relocation: { title: "नोड रिलोकेशन", desc: "निर्बाध कार्यालय और औद्योगिक माइग्रेशन प्रोटोकॉल।" },
        industrial: { title: "औद्योगिक पावर", desc: "उच्च वोल्टेज इलेक्ट्रिकल ग्रिड तैनाती।" },
        fire: { title: "अग्नि सुरक्षा", desc: "नियामक सुरक्षा और पहचान मेश सिस्टम।" },
        mesh: { title: "IT मेश", desc: "एंटरप्राइज नेटवर्किंग और डेटा केबलिंग।" },
        hvac: { title: "HVAC नियंत्रण", desc: "औद्योगिक पर्यावरण प्रबंधन प्रणाली।" }
      }
    }
  },
  common: { viewProfile: "प्रोफ़ाइल देखें", reviews: "समीक्षाएं", hr: "घंटा", copy: "कॉपी", copied: "कॉपी किया गया!", aiMatchingSub: "AI-कैलिब्रेटेड विशेषज्ञ जो आपके प्रोटोकॉल आवश्यकताओं से मेल खाते हैं।", exploreSub: "{category} क्षेत्र में विशेषीकृत प्रोटोकॉल का अन्वेषण करें।", escrow: { title: "ConciergeAI Escrow द्वारा सुरक्षित", subtitle: "{category} क्षेत्र में प्रत्येक सत्र की AI द्वारा गुणवत्ता आश्वासन और वित्तीय अखंडता के लिए निगरानी की जाती है।", specialists: "सत्यापित विशेषज्ञ", fees: "प्लेटफ़ॉर्म सेवा शुल्क", support: "AI मध्यस्थता समर्थन" } },
  hero: { title: "शीर्ष सेवा विशेषज्ञों को खोजें", subtitle: "अपने क्षेत्र के प्रमाणित पेशेवरों से जुड़ें।", searchPlaceholder: "आपको क्या सेवा चाहिए?", badge: "यूके का नंबर 1 सेवा बुकिंग प्लेटफॉर्म" },
  faq: {
    title: "अक्सर पूछे जाने वाले प्रश्न",
    subtitle: "यूके सेवा बुकिंग प्लेटफॉर्म के बारे में सब कुछ।",
    categories: { payments: "भुगतान", disputes: "विवाद", bookings: "बुकिंग" },
    aura: { title: "Aura AI सहायक", subtitle: "तत्काल सहायता चाहिए? सिफारिशों के लिए Aura से बात करें।", cta: "Aura से बात करें" },
    questions: {
      payments: [
        { q: "मैं सेवा के लिए भुगतान कैसे करूँ?", a: "Stripe के माध्यम से भुगतान सुरक्षित रूप से संसाधित किए जाते हैं। हम काम पूरा होने तक राशि को एस्क्रो खाते में रखते हैं।" },
        { q: "क्या कोई छिपे हुए शुल्क हैं?", a: "नहीं। प्लेटफॉर्म ग्राहकों से कोई सेवा शुल्क नहीं लेता है। आप केवल तकनीशियन के काम और स्वीकृत सामग्रियों के लिए भुगतान करते हैं।" }
      ],
      disputes: [
        { q: "यदि काम संतोषजनक नहीं है तो क्या होगा?", a: "हमारे AI मध्यस्थ निष्पक्ष समाधान सुनिश्चित करने के लिए मूल कार्य के आधार पर तस्वीरों की समीक्षा करते हैं।" },
        { q: "मैं रिफंड का अनुरोध कैसे करूँ?", a: "यदि विशेषज्ञ सहमत शर्तों को पूरा नहीं करता है, तो आप अपने डैशबोर्ड के माध्यम से विवाद खोल सकते हैं।" }
      ],
      bookings: [
        { q: "क्या मैं बुकिंग रद्द कर सकता हूँ?", a: "हाँ, आप पूर्ण वापसी के लिए निर्धारित समय से 24 घंटे पहले रद्द कर सकते हैं।" },
        { q: "मैं अपने विशेषज्ञ से कैसे संपर्क करूँ?", a: "एक बार बुकिंग की पुष्टि हो जाने के बाद, आपको एक सुरक्षित चैट चैनल तक पहुंच प्राप्त होगी।" }
      ]
    }
  },
  aura: {
    welcome: "नमस्ते! मैं Aura हूँ, आपकी यूके सेवा समन्वयक। आज मैं आपकी क्या सहायता कर सकती हूँ?",
    offline: "ऑफ़लाइन",
    ready: "ऑनलाइन - सहायता के लिए तैयार",
    placeholder: "Aura से कुछ भी पूछें...",
    error: "क्षमा करें, मुझे अभी कनेक्शन समस्या हो रही है। कृपया बाद में प्रयास करें।",
    footer: "सुरक्षित AI सहायता • प्लेटफॉर्म संस्करण 1.2",
    suggestions: {
      refund: "रिफंड कैसे लें?",
      dispute: "मरम्मत विवाद?",
      warranty: "वारंटी शर्तें",
      booking: "बुकिंग के बारे में",
      refundQuery: "मैं रिफंड का अनुरोध कैसे कर सकता हूँ? प्रक्रिया क्या है?",
      disputeQuery: "यदि मैं मरम्मत की गुणवत्ता या कीमत से खुश नहीं हूँ तो मुझे क्या करना चाहिए?",
      warrantyQuery: "क्या प्लेटफॉर्म के माध्यम से दी जाने वाली सेवाओं पर कोई वारंटी है?",
      bookingQuery: "मैं अपने पास किसी तकनीशियन को कैसे बुक कर सकता हूँ?"
    }
  },
  footer: { 
    tagline: "यूके के शीर्ष प्रमाणित विशेषज्ञों से जुड़ें।", 
    explore: "खोजें", 
    legal: "कानूनी", 
    support: "सहायता", 
    rights: "सर्वाधिकार सुरक्षित।", 
    terms: "सेवा की शर्तें", 
    privacy: "गोपनीयता नीति", 
    cookies: "कुकी नीति", 
    help: "सहायता केंद्र", 
    contact: "संपर्क करें", 
    aiDiagnosis: "AI निदान", 
    homeCleaning: "घर की सफाई", 
    plumbingServices: "प्लंबिंग सेवाएं", 
    automotiveServices: "ऑटोमोटिव सेवाएं", 
    trustSignal: "Trustpilot पर उत्कृष्ट",
    address: "London, UK",
    phone: "+44 20 1234 5678",
    email: "support@conciergeai.uk",
    aboutUs: "ConciergeAI यूके के घर मालिकों को शीर्ष 1% प्रमाणित सेवा विशेषज्ञों से जोड़ता है।",
    companyNo: "12345678",
    vatNo: "GB123456789",
    social: {
      facebook: "https://facebook.com/conciergeai",
      twitter: "https://twitter.com/conciergeai",
      instagram: "https://instagram.com/conciergeai",
      linkedin: "https://linkedin.com/company/conciergeai"
    }
  },
  search: { 
    filters: "फिल्टर", keyword: "कीवर्ड", location: "स्थान", category: "श्रेणी", minRating: "न्यूनतम रेटिंग", verifiedOnly: "केवल प्रमाणित", 
    apply: "लागू करें", sortBy: "क्रमबद्ध करें", sortRating: "शीर्ष रेटिंग", sortJobs: "सर्वाधिक कार्य", sortDistance: "निकटतम", sortPrice: "कीमत: कम से उच्च", 
    foundCount: "{{count}} विशेषज्ञ मिले", searching: "विशेषज्ञों की खोज की जा रही है...", noResults: "आपकी खोज से मेल खाने वाले कोई विशेषज्ञ नहीं मिले", 
    noResultsHint: "फिल्टर समायोजित करने या किसी भिन्न क्षेत्र में खोजने का प्रयास करें।", clearFilters: "सभी साफ करें", 
    basePrice: "अनुमानित शुरुआती कीमत", viewDetails: "विवरण देखें", listView: "सूची दृश्य", mapView: "मानचित्र दृश्य", searchThisArea: "इस क्षेत्र में खोजें",
    verified: "प्रमाणित", insured: "बीमाकृत", priceAudit: "AI मूल्य ऑडिट: उचित", defaultDesc: "पेशेवर सेवा प्रदाता"
  },
  booking: {
    steps: { details: "विवरण", schedule: "शेड्यूल", confirmation: "पुष्टि" },
    titles: { details: "हमें अपनी आवश्यकताओं के बारे में बताएं", schedule: "एक समय चुनें", confirm: "अपनी बुकिंग की पुष्टि करें", success: "बुकिंग की पुष्टि हो गई!" },
    labels: { date: "तारीख", time: "समय", make: "ब्रांड", model: "मॉडल", address: "पता", notes: "विशेष निर्देश", agree: "मैं शर्तों से सहमत हूँ (ग्राहकों के लिए शून्य प्लेटफॉर्म शुल्क)", summary: "भुगतान सारांश", paid: "भुगतान किया गया", merchant: "विशेषज्ञ", service: "सेवा" },
    buttons: { next: "अगला", prev: "पिछला", pay: "सुरक्षित भुगतान", home: "होम", dashboard: "डैशबोर्ड" },
    messages: { finalizing: "आपकी बुकिंग को अंतिम रूप दिया जा रहा है...", wait: "कृपया पेज को रिफ्रेश न करें", contact24h: "आपका विशेषज्ञ 24 घंटे के भीतर आपसे संपर्क करेगा।", safety: "आपकी सुरक्षा के लिए, सभी भुगतान एस्क्रो खाते में रखे जाते हैं।", noReviews: "अभी तक कोई समीक्षा नहीं", recommended: "अत्यधिक अनुशंसित", replyFromMaster: "विशेषज्ञ का जवाब" } },
  merchant: {
    verified: "प्रमाणित विशेषज्ञ", background: "पृष्ठभूमि की जाँच की गई", portfolio: "कार्य पोर्टफोलियो", reviewTitle: "ग्राहक समीक्षाएं", realReviews: "प्रमाणित बुकिंग से वास्तविक समीक्षाएं", verifiedBooking: "प्रमाणित बुकिंग", pricingAnalysis: "AI मूल्य विश्लेषण", bookingChannel: "पेशेवर बुकिंग चैनल", viewServices: "सभी सेवाएं देखें", guarantee: "सेवा गारंटी", fastResponse: "त्वरित प्रतिक्रिया", contactExpert: "विशेषज्ञ से संपर्क करें", noReviews: "कोई समीक्षा नहीं", reply: "जवाब दें",
    dashboard: {
      title: "मर्चेंट डैशबोर्ड", welcome: "वापसी पर स्वागत है, ", previewProfile: "सार्वजनिक प्रोफ़ाइल देखें", manageServices: "सेवाएं प्रबंधित करें",
      stats: { totalBookings: "कुल बुकिंग", rating: "रेटिंग", pendingBalance: "लंबित शेष", availableBalance: "उपलब्ध शेष", totalJobs: "कुल कार्य", escrowHeld: "एस्क्रो में", availableNow: "अभी उपलब्ध", reviews: "समीक्षाएं" },
      syncStatus: "सिंक स्थिति",
      lastSynced: "पिछला सिंक",
      refresh: "रिफ्रेश",
      syncing: "डेटा सिंक हो रहा है...",
      syncFailed: "सिंक विफल रहा, पुनः प्रयास करें",
      wallet: {
        syncing: "वॉलेट सिंक हो रहा है...",
        synced: "वॉलेट सिंक हो गया",
        generating: "खाता सेट किया जा रहा है...",
        referralTitle: "मित्र को रेफर करें, 2% वाउचर पुरस्कार पाएं",
        referralDesc: "अपना विशिष्ट कोड साझा करें। जब आपका मित्र अपनी पहली सेवा बुक करेगा, तो आपको इलेक्ट्रॉनिक वाउचर में 2% मिलेंगे (सुपरमार्केट और रिटेल के लिए)।",
        historyTitle: "लेनदेन इतिहास",
        historyEmpty: "अभी तक कोई लेनदेन नहीं",
        type: "प्रकार",
        description: "विवरण",
        amount: "राशि",
        date: "तारीख",
        referralListTitle: "मेरे रेफ़रल",
        referralListDesc: "आमंत्रित मित्रों से अपनी निष्क्रिय आय ट्रैक करें",
        referee: "मित्र",
        earned: "कुल अर्जित",
        expiry: "कमीशन समाप्ति",
        status: "स्थिति",
        active: "सक्रिय",
        expired: "समाप्त",
        joinedAt: "जुड़ने की तिथि",
        validUntil: "तक वैध",
        availableNow: "अभी उपलब्ध",
        rewards: {
          title: "ई-वाउचर भुनाएं",
          subtitle: "* गैर-नकद निकासी। यूके के प्रमुख खुदरा विक्रेताओं (Tesco, Amazon) के लिए डिजिटल वाउचर। 24 घंटे में वितरित।",
          myVault: "मेरा वॉल्ट",
          redeemBtn: "भुनाएं",
          statusProcessing: "प्रसंस्करण...",
          statusReady: "तैयार",
          voucherDisclaimer: "प्रमुख सुपरमार्केट और भुगतान प्रणालियों पर मान्य।",
          confirmRedeem: "क्या आप वाकई पुरस्कार भुनाना चाहते हैं? 24 घंटे के भीतर जारी किया जाएगा।",
          requestSuccess: "अनुरोध सफल! आपका कोड आवंटित किया जा रहा है। कृपया बाद में अपना वॉल्ट देखें।" } },
      bookings: { title: "हालिया बुकिंग", viewAll: "सभी देखें", empty: "कोई हालिया बुकिंग नहीं", completed: "पूरा हुआ", actions: { confirm: "पुष्टि करें", complete: "पूरा हुआ", variation: "अतिरिक्त भुगतान अनुरोध" } },
      status: { pending: "लंबित", confirmed: "पुष्टि की गई", completed: "पूरा हुआ", cancelled: "रद्द" },
      variations: { label: "मूल्य परिवर्तन", status: "स्थिति", pending: "ग्राहक की प्रतीक्षा", approved: "अनुमोदित", rejected: "अस्वीकृत", arbiterActive: "AI मध्यस्थ सक्रिय" },
      arbiterReasoning: "AI मध्यस्थ विश्लेषण",
      tips: { title: "विकास सुझाव", growth: "विशिष्ट दृश्यता और निरंतर मिशन थ्रूपुट सुनिश्चित करने के लिए उच्च गुणवत्ता वाली सेवा बनाए रखें।" },
      quickLinks: { title: "त्वरित लिंक", schedule: "शेड्यूल", earnings: "कमाई", support: "सहायता" },
      modal: { title: "अतिरिक्त भुगतान अनुरोध", amount: "अतिरिक्त राशि (£)", reason: "कारण", reasonPlaceholder: "उदा: फर्श के नीचे अतिरिक्त रिसाव मिला", photo: "फोटो साक्ष्य", photoHint: "AI सत्यापन के लिए आवश्यक", submit: "अनुरोध भेजें", submitting: "अपलोड हो रहा है..." },
      avatar: { upload: "फोटो अपलोड करें", hint: "प्रोफ़ेशनल फ़ोटो या कंपनी लोगो का उपयोग करें।", success: "फ़ोटो अपडेट की गई!", errorSize: "फ़ोटो 2MB से कम होनी चाहिए" },
      accounting: {
        title: "लेखांकन और कर",
        subtitle: "स्वचालित यूके वित्तीय केंद्र: वैट निगरानी और कर पूर्वानुमान।",
        statusActive: "सदस्यता सक्रिय",
        statusInactive: "सदस्यता निष्क्रिय",
        grossRevenue: "सकल राजस्व",
        grossRevenueDesc: "ConciergeAI प्लेटफॉर्म्स से कुल अंतर्वाह",
        taxPayable: "अनुमानित कर देय",
        taxPayableDesc: "24/25 यूके आयकर बैंड्स के आधार पर गणना की गई।",
        vatRadar: "वैट पंजीकरण रडार",
        vatRadarDesc: "£90,000 थ्रेशोल्ड के निकटता को ट्रैक करना।",
        monthlyBreakdown: "मासिक प्रदर्शन ऑडिट",
        revenue: "राजस्व",
        fees: "प्लेटफॉर्म शुल्क",
        netProfit: "शुद्ध लाभ",
        exportCsv: "CSV ऑडिट लॉग निर्यात करें",
        upgradeTitle: "विशेषज्ञ लेखांकन अनलॉक करें",
        upgradeDesc: "स्वचालित बहीखाता, कर वर्ष सारांश, और CSV डेटा निर्यात।",
        upgradeCost: "£4.99 / माह",
        upgradeBtn: "प्रीमियम एक्सेस सक्रिय करें",
        taxYear: "कर वर्ष",
        regNumber: "पंजीकरण संख्या (UTR/CRN)"
      }
    },
    portfolio_mgr: {
      title: "कार्य पोर्टफोलियो", subtitle: "अधिक बुकिंग जीतने के लिए अपना सर्वश्रेष्ठ कार्य दिखाएं।", addBtn: "कार्य जोड़ें", emptyTitle: "कोई कार्य नहीं", emptyDesc: "विश्वास बनाने के लिए अपनी पिछली परियोजनाओं की तस्वीरें जोड़ें।",
      modal: { title: "कार्य जोड़ें", itemTitle: "शीर्षक", itemTitlePlaceholder: "उदा: लंदन में बॉयलर स्थापना", category: "श्रेणी", uploadPhoto: "प्रोजेक्ट फोटो अपलोड करें", errorSize: "फ़ोटो 5MB से कम होनी चाहिए", details: "विवरण", aiBtn: "AI जनरेट करें", aiGenerating: "लिखा जा रहा है...", detailsPlaceholder: "किए गए कार्य, चुनौतियों और परिणामों का वर्णन करें।", cancel: "रद्द करें", publish: "प्रकाशित करें" },
      deleteConfirm: "क्या आप वाकई इस कार्य को हटाना चाहते हैं?", addError: "जोड़ने में विफल।", aiError: "AI विफल रहा, कृपया मैन्युअल रूप से दर्ज करें।"
    } },
  education_sec: { hero: { badge: "यूके के विशिष्ट शिक्षक", title1: "नया कौशल सीखें", title2: "विशेषज्ञों के साथ", subtitle: "अकादमिक, भाषाओं और व्यावसायिक कौशल के लिए विशिष्ट शिक्षकों से जुड़ें। आपकी सफलता के लिए व्यक्तिगत शिक्षा।", searchPlaceholder: "आप क्या सीखना चाहते हैं?", searchBtn: "शिक्षक खोजें" },
    forYou: { title: "आपके लिए सिफारिशें", match: "AI मैच", viewProfile: "प्रोफ़ाइल देखें" },
    categories: { title: "श्रेणियां खोजें", browseBtn: "सभी देखें", items: { 
      academic: { title: "Academic Excellence", desc: "GCSE, A-Levels, IB, 11+ Entrance Prep" }, 
      language: { title: "Global Languages", desc: "IELTS, Duolingo, Business English & more" }, 
      stem: { title: "STEM & AI", desc: "Python, Generative AI, Coding, Data Science" }, 
      arts: { title: "Creative Arts", desc: "Portfolio, Piano, Design, Fine Arts" }, 
      finance: { title: "Elite Certifications", desc: "CFA, ACCA, PMP, Professional Certs" }, 
      career: { title: "Career Strategy", desc: "Interview Prep, Leadership, MBA Strategy" }, 
      junior: { title: "Junior Scholars", desc: "Phonics, Logic, Talent Development" }, 
      masterclass: { title: "Knowledge Workshops", desc: "Investment, Lifestyle, Masterclasses" },
      sen: { title: "Special Education (SEN)", desc: "ADHD, Dyslexia, Autism, Mental Health" }
    } },
    search: { filters: "खोज फिल्टर", mode: "मोड", online: "ऑनलाइन", offline: "व्यक्तिगत", hybrid: "हाइब्रिड", priceRange: "मूल्य सीमा (घंटा)", level: "स्तर", student: "विश्वविद्यालय छात्र", pro: "पेशेवर शिक्षक", expert: "विशेषज्ञ (MA/PhD)", apply: "लागू करें", resultsTitle: "उपलब्ध शिक्षक", foundCount: "{{count}} शिक्षक मिले", placeholder: "विषय या नाम खोजें" },
    common: { reviews: "समीक्षाएं", hr: "घंटा", bookTrial: "ट्रायल सत्र बुक करें" },
    tutorCard: { demoDesc: "10+ वर्षों के अनुभव के साथ उत्साही पीएचडी शिक्षक, 100+ छात्रों को उनके लक्ष्य प्राप्त करने में मदद की है।" },
    tutorProfile: { 
      verified: "प्रमाणित शिक्षक", about: "शिक्षक के बारे में", education: "शिक्षा", experience: "अनुभव", portfolio: "छात्र सफलता की कहानियाँ", reviews: "छात्र समीक्षाएं", availability: "साप्ताहिक शेड्यूल", bookNow: "अभी बुक करें", 
      aiTrial: "AI मूल्यांकन", trialChallenge: "अकादमिक निदान चुनौती", startChallenge: "चुनौती शुरू करें", cancel: "अभी नहीं",
      loadingChallenge: "AI चुनौती तैयार कर रहा है...",
      analyzing: "{subject} पाठ्यक्रम का विश्लेषण किया जा रहा है",
      questionLabel: "प्रश्न",
      of: "का",
      explanation: "व्याख्या:",
      nextQuestion: "अगला प्रश्न",
      finishChallenge: "चुनौती समाप्त करें",
      scoreResult: "आपका स्कोर प्रतिशत:",
      assessment: "AI मूल्यांकन:",
      assessmentLevels: {
        excellent: "बहुत मजबूत आधार",
        progress: "विकास की अपार संभावना",
        starting: "सीखने की यात्रा की शुरुआत"
      },
      assessmentDesc: "शिक्षक को आपकी स्थिति की जानकारी दे दी गई है!",
      bookFirstLesson: "अपनी पहली कक्षा बुक करें",
      tryAgain: "पुनः प्रयास करें"
    },
    visitDashboard: "शिक्षा केंद्र का अन्वेषण करें"
  }, 
  home: { hero: { badge: "प्रमाणित स्थानीय पेशेवर", title1: "सर्वश्रेष्ठ बुक करें", title2: "स्थानीय विशेषज्ञ", subtitle: "यूके के शीर्ष 1% विशेषज्ञों तक तत्काल पहुंच। सभी प्रमाणित, बीमित और AI द्वारा गुणवत्ता की निगरानी की जाती है।", searchPlaceholder: "मुझे चाहिए...", locationPlaceholder: "लंदन, यूके", aiMatch: "स्मार्ट मैच", searchBtn: "संपर्क खोजें", suggestions: [
        "चेल्सी में गैस सेफ इंजीनियर खोजें…",
        "GCSE के लिए शीर्ष-रेटेड ट्यूटर बुक करें…",
        "आपके कार्यालय के लिए गहन सफाई की आवश्यकता है?",
        "संपत्ति विवादों हेतु विशेषज्ञ विधिक सहायता…",
        "लंदन में व्यावसायिक कर लेखाकार…"
      ], popularLabel: "लोकप्रिय", popularTags: ["घर नवीनीकरण", "कर दाखिल", "गहन सफाई", "विधिक सहायता"] },
    recommendation: { title1: "आपके लिए", title2: "अनुशंसित", subtitle: "आपकी आवश्यकताओं और स्थान के आधार पर शीर्ष पेशेवर।", browse: "सभी देखें" },
    recommendationResults: {
      trendingTitle: "{{city}} में प्रचलित: {{category}}",
      topRatedTitle: "{{city}} में शीर्ष रेटेड: {{category}}",
      ukWideTitle: "यूके विशिष्ट: {{category}}",
      professionalTitle: "{{city}} में पेशेवर सेवाएं",
      homeRepair: "घर की मरम्मत",
      deepCleaning: "गहरी सफाई",
      accounting: "लेखा और कानूनी",
      autoRepair: "ऑटो मरम्मत",
      homeSub: "आपके पास विश्वसनीय मरम्मत विशेषज्ञ",
      cleanSub: "आज उपलब्ध विशेषज्ञ",
      accountSub: "शीर्ष रेटेड एकाउंटेंट और कानूनी सहायक",
      autoSub: "आपकी कार के लिए पेशेवर मैकेनिक",
      assetMatch: "संपत्ति मिलान",
      trending: "स्थानीय स्तर पर प्रचलित"
    },
    aiCTA: { badge: "ChatGPT, Gemini & Grok द्वारा संचालित", title1: "पता नहीं क्या गलत है?", title2: "तत्काल AI निदान प्राप्त करें", subtitle: "समस्या की फोटो अपलोड करें। हमारा AI खराबी की पहचान करेगा, लागत का अनुमान लगाएगा और सेकंडों में विशेषज्ञ ढूंढ लेगा।", button: "मुफ्त AI निदान शुरू करें" },
    referralCTA: { badge: "रेफ़रल पुरस्कार", title: "2% निष्क्रिय आय कमाएं", subtitle: "मित्रों को रेफर करें और अगले 5 वर्षों के लिए उनकी सभी बुकिंग से शॉपिंग वाउचर के रूप में 2% प्राप्त करें (कैश निकासी नहीं)।", button: "अभी कमाना शुरू करें", referralLabel: "आपका रेफ़रल कोड:" , voucherDisclaimer: "* Rewards redeemable for retail vouchers only. No cash withdrawal." },
    educationCTA: "शिक्षा पर जाएं",
    eliteLocal: "क्षेत्र विशिष्ट",
    eliteBadge: "विशिष्ट विशेषज्ञ",
    defaultCategory: "सेवा विशेषज्ञ",
    noResults: "अभी इस श्रेणी में कोई विशेषज्ञ नहीं मिले।",
    trustedBy: "ब्रिटेन के निवासियों द्वारा भरोसेमंद और सत्यापित",
    categories: { plumbing: "प्लंबिंग", repairs: "मरम्मत", renovation: "नवीनीकरण", education: "शिक्षा", accounting: "एकाउंटिंग", legal: "कानूनी", commercial: "वाणिज्यिक", cleaning: "सफाई", car: "कार" },
    sections: {
      plumbing: { title: "प्लंबिंग और तकनीकी", desc: "आपातकालीन रिसाव से लेकर वायरिंग तक, हम आपको प्रमाणित तकनीशियनों से जोड़ते हैं।", items: ["रिसाव मरम्मत", "इलेक्ट्रिकल", "उपकरण स्थापना", "बॉयलर सेवा", "सॉकेट", "स्मार्ट होम"] },
      repairs: { title: "घर की मरम्मत", desc: "फर्नीचर असेंबली, दीवार की मरम्मत, ताले बदलना - घर के सभी काम।", items: ["फर्नीचर असेंबली", "बढ़ईगीरी", "दीवार पैचिंग", "शेल्फिंग", "पेंटिंग", "सामान्य मरम्मत"] },
      accounting: { title: "एकाउंटिंग और टैक्स", desc: "छात्रों और छोटे व्यवसायों के लिए। कर अनुपालन सुनिश्चित करें।", items: ["टैक्स रिटर्न", "वार्षिक खाते", "VAT रिटर्न", "पेरोल", "Xero परामर्श", "वित्तीय विश्लेषण"] },
      renovation: { title: "नवीनीकरण", desc: "रसोई विस्तार से लेकर पूर्ण नवीनीकरण तक। पारदर्शी और गुणवत्तापूर्ण।", items: ["रसोई और स्नान", "घर विस्तार", "इंटीरियर डिजाइन", "प्रो पेंटिंग", "फर्श", "उद्यान"] },
      education: { title: "शिक्षा और सीखना", desc: "पेशेवर शिक्षक और कोच। व्यक्तिगत सीखने की योजना।", items: ["भाषा शिक्षक", "IELTS/TOEFL", "कोडिंग", "संगीत और कला", "बिजनेस स्किल", "ट्यूशन"] },
      cleaning: { title: "पेशेवर सफाई", desc: "किराया समाप्ति पर गहरी सफाई या नियमित घरेलू सफाई।", items: ["नियमित सफाई", "किराया समाप्ति सफाई", "कालीन सफाई", "खिड़की की सफाई", "कार्यालय की सफाई", "कीटाणुशोधन"] },
      legal: { title: "कानूनी परामर्श", desc: "वीजा आवेदन, अनुबंध प्रारूपण आदि। अपने अधिकारों की रक्षा के लिए विशेषज्ञों से जुड़ें।", items: ["अनुबंध प्रारूपण", "वीजा", "संपत्ति कानून", "विवाद समाधान", "बिजनेस कानून", "नोटरी"] },
      commercial: { title: "वाणिज्यिक सेवाएं", desc: "व्यावसायिक स्थानों के लिए। दुकान फिटिंग, ऑफिस स्थानांतरण और रखरखाव।", items: ["शॉप फिटिंग", "ऑफिस मूव", "इंडस्ट्रियल पावर", "अग्नि सुरक्षा", "IT नेटवर्क", "सेंट्रल एसी"] }
    },
    popularTitle: "लोकप्रिय", popularIn: "में", allUK: "पूरा यूके",
    noProjects: { title: "इस श्रेणी में कोई प्रोजेक्ट नहीं", desc: "हम आपके क्षेत्र में सक्रिय रूप से विशेषज्ञों को जोड़ रहे हैं।" },
    reviews: { excellent: "उत्कृष्ट", basedOn: "आधारित", verified: "सत्यापित", countLabel: "समीक्षा" },
    howItWorks: {
      title: "यह कैसे काम करता है",
      subtitle: "यूके का सबसे उन्नत सेवा बुकिंग प्रोटोकॉल, AI द्वारा संचालित।",
      step1Title: "AI निदान",
      step1Desc: "तत्काल दोष पहचान और सटीक लागत अनुमान के लिए समस्याएं अपलोड करें।",
      step2Title: "स्मार्ट मिलान",
      step2Desc: "हमारा नेटवर्क आपकी विशिष्ट समस्या के लिए अनुकूलित शीर्ष 1% विशेषज्ञों की पहचान करता है।",
      step3Title: "एस्क्रो सुरक्षा",
      step3Desc: "जब तक आप पुष्टि नहीं करते कि कार्य सफल रहा, भुगतान सुरक्षित एस्क्रो में रखा जाता है।",
      step4Title: "सेवा गारंटी",
      step4Desc: "गुणवत्ता आश्वासन और विवाद समाधान सहायता के लिए हर सत्र की AI द्वारा निगरानी की जाती है।"
    }
  },
  location: { selectCity: "शहर चुनें", detecting: "स्थान खोजा जा रहा है...", switch: "बदलें", nearby: "निकटतम सेवाएं" },
  diagnosis: {
    badge: "ChatGPT, Gemini & Grok तकनीक द्वारा संचालित",
    title1: "विशेषज्ञ मरम्मत",
    title2: "बिजली की गति से",
    subtitle: "अनुमान लगाना बंद करें। हमारा AI आपकी तस्वीरों का विश्लेषण करता है ताकि बुकिंग से पहले तत्काल जानकारी और उचित लागत अनुमान मिल सके।",
    features: {
      instant: { title: "तत्काल जानकारी", desc: "कॉल का इंतजार करने की जरूरत नहीं। फोटो अपलोड करते ही तकनीकी विश्लेषण प्राप्त करें।" },
      pricing: { title: "उचित मूल्य निर्धारण", desc: "हम आपके क्षेत्र के लिए सटीक लागत सीमा प्रदान करने के लिए वास्तविक डेटा का उपयोग करते।" },
      verified: { title: "प्रमाणित बुकिंग", desc: "निदान के बाद, सीधे अपनी समस्या के लिए अनुकूलित शीर्ष 1% विशेषज्ञों से जुड़ें।" }
    },
    cta: "सभी सेवाएं देखें",
    tool: {
      title: "तत्काल AI निदान",
      subtitle: "एक फोटो अपलोड करें और AI को लागत और कार्यक्षेत्र का अनुमान लगाने दें।",
      step1: "1. साक्ष्य फोटो अपलोड करें",
      step2: "2. श्रेणी चुनें",
      step3: "3. समस्या का वर्णन करें (वैकल्पिक)",
      uploadHint: "तस्वीर लें या अपलोड करें",
      replaceHint: "फोटो बदलने के लिए क्लिक करें",
      submit: "मुफ्त AI निदान जनरेट करें",
      loading: "डेटा का विश्लेषण किया जा रहा है...",
      disclaimer: "AI अनुमान केवल सूचना के लिए हैं। अंतिम उद्धरण विशेषज्ञ द्वारा दिया जाएगा।",
      newDiagnosis: "नया निदान",
      categories: { plumbing: "प्लंबिंग", auto: "ऑटो", renovation: "नवीनीकरण", electrical: "इलेक्ट्रिकल", cleaning: "सफाई" },
      resultTitle: "AI विश्लेषण परिणाम",
      detectedIssue: "पहचानी गई समस्या",
      recommendedSolution: "अनुशंसित समाधान",
      estimatedCostLabel: "अनुमानित लागत सीमा",
      ukStandard: "यूके मानक आधार", clinicalStandard: "नैदानिक मानक",
      includesLabor: "श्रम और सामग्री शामिल",
      bookSpecialist: "इस विशेषज्ञ को बुक करें",
      confidence: "आत्मविश्वास स्तर",
      analyzedPhoto: "विश्लेषित फोटो",
      guaranteedRepairs: "गारंटीकृत मरम्मत",
      disputeResolution: "विवाद समाधान सहायता",
      fastTurnaround: "त्वरित समाधान",
      responseHours: "{category} विशेषज्ञ आमतौर पर 2 घंटे में जवाब देते हैं।",
      errorPhotoCategory: "कृपया फोटो अपलोड करें और श्रेणी चुनें।",
      errorUnexpected: "एक अप्रत्याशित त्रुटि हुई। पुनः प्रयास करें।",
      uploadFormatHint: "JPG, PNG समर्थित",
      descriptionPlaceholder: "समस्या के बारे में अधिक विवरण दें...",
      strictMode: "सटीक विजन मोड",
      strictModeHint: "उच्च-सटीक दृश्य तर्क (गहरा विश्लेषण)",
      authRequired: "केवल सदस्यों के लिए: AI निदान का उपयोग करने के लिए कृपया लॉगिन करें", 
      limitReached: "आपकी दैनिक सीमा (5/5) पूरी हो गई है", 
      limitReachedHint: "आप हमारे अनुशंसित विशेषज्ञों से सीधे संपर्क कर सकते हैं या कल पुनः प्रयास कर सकते हैं।", 
      remaining: "दैनिक उपयोग शेष", 
      findSpecialist: "अभी विशेषज्ञ से संपर्क करें"
    }
  },
  onboarding: {
    hero: { title: "ConciergeAI के साथ अपना व्यवसाय बढ़ाएं", subtitle: "यूके के प्रमाणित सेवा विशेषज्ञों के विशिष्ट नेटवर्क में शामिल हों।" },
    steps: { profile: "व्यावसायिक प्रोफ़ाइल", credentials: "प्रमाणपत्र", contract: "सेवा समझौता" },
    sectors: { title: "अपना क्षेत्र चुनें", professional: { title: "पेशेवर सेवाएं", desc: "एकाउंटिंग, कानूनी, परामर्श", industries: ["एकाउंटेंट", "टैक्स एक्सपर्ट", "लीगल", "रणनीतिकार"] }, education: { title: "शिक्षा क्षेत्र", desc: "शिक्षक, कोच", industries: ["अकादमिक शिक्षक", "भाषा कोच", "कौशल प्रशिक्षक", "संगीत शिक्षक"] }, technical: { title: "तकनीकी सेवाएं", desc: "शिल्पकार, रखरखाव, इंजीनियरिंग", industries: ["प्लंबर", "इलेक्ट्रीशियन", "मैकेनिक", "घर मरम्मत"] } },
    contract: { title: "मानक सेवा समझौता", scrollingNotice: "शर्तों को स्वीकार करने के लिए नीचे तक स्क्रॉल करें।", agree: "मैंने ConciergeAI मुख्य समझौते को पढ़ लिया है और सहमत हूँ।", clauses: { platform_fee: { title: "1. सेवा शुल्क", body: "प्लेटफॉर्म सफलतापूर्वक पूरे किए गए कार्यों पर 9% कमीशन लेता है।" }, payments: { title: "2. एस्क्रो और निपटान", body: "ग्राहक भुगतान सुरक्षित एस्क्रो में रखे जाते हैं। कार्य पूरा होने की पुष्टि के 48 घंटे बाद राशि जारी की जाती है।" }, conduct: { title: "3. पेशेवर आचरण", body: "विशेषज्ञों को 4.0 से ऊपर की रेटिंग बनाए रखनी चाहिए। सुरक्षा प्रोटोकॉल का पालन न करने पर खाता बंद किया जा सकता है।" } } },
    buttons: { start: "अभी शुरू करें", next: "अगला", back: "वापस", submit: "बोर्डिंग पूर्ण करें" }
  },
  admin: {
    sidebar: { overview: "अवलोकन", analytics: "विश्लेषण", bookings: "बुकिंग", verifications: "सत्यापन", disputes: "विवाद", merchants: "मर्चेंट", payouts: "भुगतान", users: "उपयोगकर्ता", settings: "सेटिंग्स", terminal: "टर्मिनल" },
    header: { internal: "आंतरिक संचालन", operations: "संचालन डैशबोर्ड", node: "सक्रिय नोड" },
    stats: { gmv: "GMV", netRevenue: "शुद्ध राजस्व", bookings: "बुकिंग", dailyAvg: "दैनिक औसत", processed: "संसाधित", volume24h: "24h वॉल्यूम", syncing: "सिंक हो रहा है..." },
    analytics: { gmvTitle: "GMV", gmvSub: "राजस्व विश्लेषण", sectorDist: "क्षेत्र वितरण", volTitle: "बाजार वॉल्यूम", live: "लाइव" },
    bookings: { title: "बुकिंग", sub: "लाइव लेनदेन", search: "खोजें...", id: "ID", customer: "ग्राहक", amount: "राशि", status: "स्थिति", service: "सेवा" },
    verifications: { title: "सत्यापन", sub: "पृष्ठभूमि की जाँच", evidence: "साक्ष्य", extraction: "निष्कर्षण", passport: "पासपोर्ट", faceMatch: "फेस मैच", confidence: "विश्वास", fullName: "पूरा नाम", idNumber: "ID नंबर", expiryDate: "समाप्ति", dob: "जन्म तिथि" },
    disputes: { title: "विवाद", sub: "मध्यस्थता", reasoning: "तर्क", gallery: "गैलरी", verdict: "निर्णय", confidence: "विश्वास" },
    payouts: { title: "भुगतान", sub: "मर्चेंट निपटान", snapshot: "स्नैपशॉट", pending: "लंबित", volume: "वॉल्यूम", security: "सुरक्षा", adjudication: "निर्णय", method: "विधि" },
    users: { title: "उपयोगकर्ता", sub: "उपयोगकर्ता डेटाबेस", stats: "आंकड़े", registeredAt: "जुड़े", referrals: "रेफ़रल" },
    commissions: { title: "कमीशन", sub: "राजस्व नियंत्रण", plateformFee: "प्लेटफॉर्म शुल्क", marketplaceFee: "मार्केटप्लेस शुल्क", adminControl: "एडमिन नियंत्रण", weightedAvg: "भारित औसत", totalJobs: "कुल कार्य", deliveryVolume: "वॉल्यूम", merchantDetails: "मर्चेंट विवरण" },
    disputes_mgr: { empty: "कोई लंबित विवाद नहीं।", viewDetails: "समीक्षा करें", status: { open: "खुला", processing: "प्रगति", settled: "सुलझा हुआ" } },
    merchants_mgr: { empty: "कोई विशेषज्ञ नहीं मिले।", status: { active: "सक्रिय", suspended: "निलंबित", pending: "लंबित" } },
    settings_mgr: {
      title: "ग्लोबल मेश कॉन्फ़िगरेशन",
      sub: "ग्लोबल ब्रांडिंग, कानूनी प्रोटोकॉल और संचार को प्रबंधित करें",
      companyInfo: "कंपनी की जानकारी",
      socialLinks: "सोशल लिंक",
      legalLinks: "कानूनी दस्तावेज",
      tabs: { branding: "ब्रांडिंग", contact: "संपर्क", legal: "शासन", social: "सोशल" },
      fields: { companyName: "व्यवसाय का नाम", aboutUs: "मिशन", logoUrl: "लोगो URL", officeAddress: "पता", contactPhone: "फोन", contactEmail: "ईमेल", companyRegistration: "पंजीकरण संख्या", vatRegistration: "VAT ID", facebook: "FB", twitter: "X", instagram: "IG", linkedin: "LI" },
      save: "सेटिंग्स अपडेट करें",
      saving: "सिंक हो रहा है...",
      success: "सफलतापूर्वक सहेजा गया",
      error: "प्रोटोकॉल त्रुटि"
    }
  },
  auth: {
    login: {
      title: "अपने खाते में लॉगिन करें",
      subtitle: "अपनी सेवाओं और बुकिंग को प्रबंधित करने के लिए लॉगिन करें।",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "example@concierge.ai",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      forgotPassword: "पासवर्ड भूल गए?",
      submit: "लॉगिन करें",
      loading: "लॉगिन हो रहा है...",
      or: "या",
      google: "Google के साथ लॉगिन करें",
      navToRegister: "प्लेटफॉर्म पर नए हैं?",
      createAccount: "अभी पंजीकरण करें",
      error: "लॉगिन विफल। विवरण जाँचें।",
      success: "लॉगिन सफल।"
    },
    register: {
      title: "खाता बनाएँ",
      subtitle: "ConciergeAI विशिष्ट नेटवर्क में शामिल हों।",
      firstNameLabel: "पहला नाम",
      lastNameLabel: "अंतिम नाम",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "example@concierge.ai",
      accountTypeLabel: "भूमिका",
      passwordLabel: "पासवर्ड",
      passwordHint: "कम से कम 6 अक्षर",
      referralLabel: "रेफ़रल कोड (वैकल्पिक)",
      referralPlaceholder: "उदा ALPHA-99",
      submit: "खाता बनाएँ",
      loading: "प्रसंस्करण...",
      or: "या",
      google: "Google के साथ पंजीकरण करें",
      navToLogin: "पहले से खाता है?",
      signIn: "यहाँ लॉगिन करें",
      roles: { customer: "ग्राहक", merchant: "विशेषज्ञ" }
    },
    forgotPassword: {
      title: "खाता रिकवरी",
      subtitle: "रिकवरी लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें।",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "example@concierge.ai",
      submit: "रिकवरी लिंक भेजें",
      loading: "भेजा जा रहा है...",
      back: "लॉगिन पर वापस जाएं",
      success: "रिकवरी लिंक आपके ईमेल पर भेज दिया गया है।",
      error: "भेजना विफल रहा।",
      successDetail: "रिकवरी लिंक {email} पर भेज दिया गया है।"
    },
    resetPassword: {
      title: "पासवर्ड रीसेट",
      subtitle: "नीचे अपना नया पासवर्ड दर्ज करें।",
      passwordLabel: "नया पासवर्ड",
      confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
      submit: "अपडेट करें",
      loading: "अपडेट हो रहा है...",
      back: "लॉगिन पर वापस जाएं",
      success: "पासवर्ड अपडेट हो गया।",
      invalidToken: "लिंक अमान्य या समाप्त हो गया है।",
      notMatch: "पासवर्ड मेल नहीं खाते।",
      error: "सिस्टम त्रुटि।",
      successDetail: "पासवर्ड अपडेट हो गया। लॉगिन पर अनुप्रेषित...",
      invalidTokenDetail: "यह रीसेट लिंक समाप्त हो गया है।",
      requestNewLink: "नया लिंक अनुरोध करें"
    },
    errors: {
      missingFields: "सभी फ़ील्ड आवश्यक हैं।",
      passwordTooShort: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए।",
      emailExists: "यह ईमेल पहले से पंजीकृत है।",
      invalidCredentials: "लॉगिन विफल। विवरण जाँचें।",
      serverError: "सर्वर त्रुटि। बाद में प्रयास करें।",
      resetFailed: "अनुरोध संसाधित करने में विफल।",
      invalidReset: "अमान्य रीसेट लिंक।"
    },
    loading: {
      preparing: "सत्र तैयार किया जा रहा है...",
      initializing: "सिस्टम शुरू हो रहा है..."
    }
  }
};
