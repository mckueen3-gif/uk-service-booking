export type Locale = 'en' | 'zh-TW' | 'hi' | 'ar' | 'ja' | 'ko';

export interface Dictionary {
  nav: { browse: string; join: string; login: string; logout: string; dashboard: string; };
  hero: { title: string; subtitle: string; searchPlaceholder: string; badge: string; };
  faq: { 
    title: string; 
    subtitle: string; 
    categories: { payments: string; disputes: string; bookings: string; }; 
    aura: { title: string; subtitle: string; cta: string; };
    questions: {
      payments: { q: string; a: string; }[];
      disputes: { q: string; a: string; }[];
      bookings: { q: string; a: string; }[];
    }
  };
  footer: { tagline: string; explore: string; legal: string; support: string; rights: string; terms: string; privacy: string; cookies: string; help: string; contact: string; };
  search: { filters: string; keyword: string; location: string; category: string; minRating: string; verifiedOnly: string; apply: string; sortBy: string; sortRating: string; sortJobs: string; sortDistance: string; sortPrice: string; foundCount: string; searching: string; noResults: string; clearFilters: string; basePrice: string; viewDetails: string; listView: string; mapView: string; };
  booking: {
    steps: { details: string; schedule: string; confirmation: string; };
    titles: { details: string; schedule: string; confirm: string; success: string; };
    labels: { date: string; time: string; make: string; model: string; address: string; notes: string; agree: string; summary: string; paid: string; merchant: string; service: string; };
    buttons: { next: string; prev: string; pay: string; home: string; dashboard: string; };
    messages: { finalizing: string; wait: string; contact24h: string; safety: string; noReviews: string; recommended: string; replyFromMaster: string; };
  };
  merchant: {
    verified: string; background: string; portfolio: string; reviewTitle: string; realReviews: string; verifiedBooking: string; pricingAnalysis: string; bookingChannel: string; viewServices: string; guarantee: string; fastResponse: string; contactExpert: string; noReviews: string; reply: string;
  };
  home: {
    hero: {
      badge: string; title1: string; title2: string; subtitle: string; searchPlaceholder: string; locationPlaceholder: string; aiMatch: string; searchBtn: string;
    };
    recommendation: {
      title1: string; title2: string; subtitle: string; browse: string;
    };
    categories: {
      plumbing: string; repairs: string; renovation: string; education: string; accounting: string; legal: string; commercial: string; cleaning: string; car: string;
    };
    sections: {
      plumbing: { title: string; desc: string; items: string[]; };
      repairs: { title: string; desc: string; items: string[]; };
      accounting: { title: string; desc: string; items: string[]; };
      renovation: { title: string; desc: string; items: string[]; };
      education: { title: string; desc: string; items: string[]; };
      cleaning: { title: string; desc: string; items: string[]; };
      legal: { title: string; desc: string; items: string[]; };
      commercial: { title: string; desc: string; items: string[]; };
    };
    popularTitle: string;
    popularIn: string;
    allUK: string;
    noProjects: { title: string; desc: string; };
    reviews: { excellent: string; basedOn: string; verified: string; };
  };
  location: {
    selectCity: string;
    detecting: string;
    switch: string;
    nearby: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: { browse: "Browse Services", join: "Join as Expert", login: "Login", logout: "Logout", dashboard: "Dashboard" },
    hero: { title: "How can we help you?", subtitle: "Search the FAQ or get instant support from our Aura AI assistant.", searchPlaceholder: "Search refunds, disputes, booking issues...", badge: "Help Center" },
    faq: { 
      title: "Smart FAQ", subtitle: "Official answers on payments, safety, and disputes.", categories: { payments: "Payments", disputes: "Disputes", bookings: "Bookings" }, 
      aura: { title: "Need further help?", subtitle: "Aura AI provides 1-on-1 legal & service guidance.", cta: "Chat Now" },
      questions: {
        payments: [
          { q: "Can I pay by credit card?", a: "Yes, we support all major credit/debit cards." },
          { q: "How to apply for a refund?", a: "You can apply via the system within 24 hours of job completion." }
        ],
        disputes: [
          { q: "What if the pro is a no-show?", a: "Click 'Merchant No-show' on order page to trigger a refund." },
          { q: "Are variation costs mandatory?", a: "No. Extra costs must be submitted via system and confirmed by you." }
        ],
        bookings: [
          { q: "How to reschedule?", a: "Reschedule for free 48h in advance." }
        ]
      }
    },
    footer: { tagline: "Premium UK service marketplace connecting you with verified local experts.", explore: "Explore Services", legal: "Legal & Compliance", support: "Customer Support", rights: "All rights reserved. Premium Service Architecture.", terms: "Terms", privacy: "Privacy", cookies: "Cookies", help: "Help Center", contact: "Contact Us" },
    search: { filters: "Filters", keyword: "Keyword", location: "Location", category: "Category", minRating: "Min Rating", verifiedOnly: "Verified Pros Only", apply: "Apply Filters", sortBy: "Sort by", sortRating: "Rating", sortJobs: "Jobs Done", sortDistance: "Distance", sortPrice: "Price: Low to High", foundCount: "experts found", searching: "Searching...", noResults: "No matching merchants found", clearFilters: "Clear all filters", basePrice: "From", viewDetails: "View Details", listView: "List View", mapView: "Map View" },
    booking: {
      steps: { details: "Details", schedule: "Schedule", confirmation: "Review" },
      titles: { details: "Booking Details", schedule: "Schedule Appointment", confirm: "Confirm & Pay", success: "Booking Confirmed!" },
      labels: { date: "Select Date", time: "Select Time", make: "Make", model: "Model", address: "Address", notes: "Notes", agree: "I agree to the Terms of Service", summary: "Booking Summary", paid: "Paid", merchant: "Merchant", service: "Service" },
      buttons: { next: "Next Step", prev: "Previous", pay: "Pay and Book Now", home: "Back to Home", dashboard: "View My Bookings" },
      messages: { finalizing: "Finalizing your booking...", wait: "Please wait while we sync with the payment system.", contact24h: "The expert will contact you within 24 hours to confirm details.", safety: "Platform Supervised · Secure Payment Guarantee", noReviews: "No reviews yet. Be the first to book!", recommended: "Highly Recommended", replyFromMaster: "Response from Master" }
    },
    merchant: {
      verified: "Verified", background: "Professional Background", portfolio: "Portfolio", reviewTitle: "Customer Reviews", realReviews: "Real client feedback", verifiedBooking: "Verified Appointment", pricingAnalysis: "Service Highlights", bookingChannel: "Quick Booking Channel", viewServices: "View Services Now", guarantee: "Platform Guarantee", fastResponse: "Fast Response", contactExpert: "Ask Expert", noReviews: "No detailed reviews yet. Be the first to book!", reply: "Official Response"
    },
    home: {
      hero: {
        badge: "UK's Most Trusted Service Marketplace", title1: "Find & Book Local Experts", title2: "In Seconds.", subtitle: "From emergency car repairs to home renovations—verified professionals, transparent pricing, and real-time tracking.", searchPlaceholder: "What service do you need?", locationPlaceholder: "City or Postcode", aiMatch: "AI Match", searchBtn: "Search"
      },
      recommendation: { title1: "Smart Recommendations", title2: "AI Discovery", subtitle: "Precisely match professional services based on your assets and needs", browse: "Browse Now" },
      categories: { plumbing: "Plumbing", repairs: "Repairs", renovation: "Renovation", education: "Education", accounting: "Accounting", legal: "Legal", commercial: "Commercial", cleaning: "Cleaning", car: "Car Services" },
      sections: {
        plumbing: { title: "Plumbing & Electrical", desc: "From emergency leaks to full rewiring, we connect you with UK-certified experts.", items: ["Pipe Repair", "Rewiring", "Installation", "Boiler Service", "Switches", "Smart Home"] },
        repairs: { title: "Home Handyman", desc: "Furniture assembly, wall repairs, and door fixes. One-stop solution for home tasks.", items: ["Assembly", "Door/Window", "Wall Patching", "Shelving", "Painting", "Misc Fixes"] },
        accounting: { title: "Accounting & Tax", desc: "Tailored for SMEs and residents. HMRC compliance, VAT, and bookkeeping.", items: ["Tax Return", "Yearly Accounts", "VAT Filing", "Payroll", "Xero Consult", "R&D Tax"] },
        renovation: { title: "House Renovation", desc: "Old house refurbishing, extensions, and interior design with quality guarantee.", items: ["Kitchen/Bath", "Extension", "Interior Design", "Painting", "Flooring", "Landscaping"] },
        education: { title: "Education & Learning", desc: "1-on-1 language tutoring, skill training, and exam prep at your fingertips.", items: ["Language Tutors", "IELTS/TOEFL", "Programming", "Music & Art", "Business Skills", "Academic Help"] },
        cleaning: { title: "General Cleaning", desc: "Daily cleaning, end-of-tenancy deep clean, and commercial disinfection services.", items: ["House Cleaning", "End of Tenancy", "Carpet Clean", "Window Clean", "Office Clean", "Disinfection"] },
        legal: { title: "Legal Consulting", desc: "Contract reviews, visa advice, and legal documentation with certified experts.", items: ["Contracts", "Visas", "Property Law", "Disputes", "Business Law", "Notary"] },
        commercial: { title: "Commercial Services", desc: "Professional services for business spaces. Renovation, moving, and maintenance.", items: ["Shop Design", "Office Move", "Commercial Elec", "Fire Safety", "IT/Network", "HVAC Maint"] }
      },
      popularTitle: "Popular Projects", popularIn: "in", allUK: "All UK",
      noProjects: { title: "No projects found in this category", desc: "We are currently onboarding top experts in this area." },
      reviews: { excellent: "Excellent", basedOn: "Based on", verified: "Verified" }
    },
    location: { selectCity: "Select City", detecting: "Detecting...", switch: "Switch", nearby: "Nearby" }
  },
  'zh-TW': {
    nav: { browse: "找服務", join: "成為專家", login: "登入", logout: "登出", dashboard: "控制台" },
    hero: { title: "我們能為您提供什麼幫助？", subtitle: "搜尋常見問題，或透過下方的 Aura AI 助手獲取即時支援。", searchPlaceholder: "搜尋退款、爭議、預約問題...", badge: "幫助中心" },
    faq: { 
      title: "常見問題 Smart FAQ", subtitle: "關於支付、安全與爭議的權威解答。", categories: { payments: "付款相關", disputes: "糾紛處理", bookings: "預約問題" }, 
      aura: { title: "還需要進一步協助？", subtitle: "我們的 AI 助手 Aura 隨時為您提供 1 對 1 諮詢。", cta: "立即對談" },
      questions: {
        payments: [
          { q: "我可以用信用卡支付嗎？", a: "是的，我們支援所有主要的信用卡和金融卡。" },
          { q: "如何申請退款？", a: "您可以通過系統申請退款。" }
        ],
        disputes: [
          { q: "如果師傅沒有按時到達怎麼辦？", a: "點擊『商家未到』，系統將自動啟動退款。" },
          { q: "追加零件費用是強制接受的嗎？", a: "不是。必須經由您確認後才生效。" }
        ],
        bookings: [
          { q: "如何修改預約時間？", a: "提前 48 小時免費修改。" }
        ]
      }
    },
    footer: { tagline: "優質英國居家與汽車維修預約平台。", explore: "探索服務", legal: "法律與合規", support: "客戶支援", rights: "保留所有權利。", terms: "服務條款", privacy: "隱私政策", cookies: "Cookie 政策", help: "幫助中心", contact: "聯繫我們" },
    search: { filters: "搜索過濾", keyword: "關鍵字", location: "地點", category: "服務分類", minRating: "最低評分", verifiedOnly: "僅看認證職人", apply: "應用過濾器", sortBy: "排序方式", sortRating: "按評分", sortJobs: "按完工數", sortDistance: "按距離", sortPrice: "按價格", foundCount: "個匹配的商家", searching: "搜尋中...", noResults: "找不到匹配的商戶", clearFilters: "清除所有過濾條件", basePrice: "起步價", viewDetails: "查看詳情", listView: "列表模式", mapView: "地圖模式" },
    booking: {
      steps: { details: "詳情", schedule: "預約", confirmation: "確認" },
      titles: { details: "填寫預約詳情", schedule: "選擇預約時間", confirm: "確認並支付", success: "預約成功！" },
      labels: { date: "選擇日期", time: "選擇時段", make: "品牌", model: "型號", address: "地址", notes: "備註", agree: "我已閱讀並同意服務條款", summary: "預約摘要", paid: "已付金額", merchant: "商家", service: "服務項目" },
      buttons: { next: "下一步", prev: "上一步", pay: "立即支付預約", home: "返回首頁", dashboard: "查看預約" },
      messages: { finalizing: "正在確認您的預約狀態...", wait: "正在同步。", contact24h: "大師將會喺 24 小時內聯絡你。", safety: "平台全程監管 · 資金安全保障", noReviews: "目前尚無評價。", recommended: "高度推薦", replyFromMaster: "師傅回覆" }
    },
    merchant: {
      verified: "已認證", background: "專業背景", portfolio: "作品集案例", reviewTitle: "客戶口碑評價", realReviews: "則真實評價", verifiedBooking: "已核實預約", pricingAnalysis: "服務亮點分析", bookingChannel: "快速預約通道", viewServices: "立即查看服務", guarantee: "商家資質認證", fastResponse: "極速回覆", contactExpert: "聯繫專家", noReviews: "暫時還沒有詳細評價內容", reply: "官方回覆"
    },
    home: {
      hero: { badge: "全英最值得信賴的服務市場", title1: "找尋並預約在地專家", title2: "就在彈指之間。", subtitle: "從緊急汽車維修到房屋裝修——認證專業人士、透明價格及實時追蹤。", searchPlaceholder: "您需要什麼服務？", locationPlaceholder: "城市或郵遞區號", aiMatch: "AI 匹配", searchBtn: "立即搜尋" },
      recommendation: { title1: "智能推薦", title2: "AI Discovery", subtitle: "根據您的資產與需求精準匹配專業服務", browse: "立即瀏覽" },
      categories: { plumbing: "水電工程", repairs: "居家維修", renovation: "房屋裝修", education: "教育學習", accounting: "會計稅務", legal: "法律諮詢", commercial: "商用服務", cleaning: "清潔打掃", car: "汽車服務" },
      sections: {
        plumbing: { title: "水電工程 (Plumbing)", desc: "從緊急水管漏水、馬桶換修到全屋電路重拉，我們連結全英認證的專業師傅。", items: ["水管維修", "電路重拉", "安裝電器", "熱水器修繕", "開關插座", "智能家居"] },
        repairs: { title: "居家維修 (Handyman)", desc: "小到組裝家具、修補牆面，大到門窗更換，解決所有煩人的居家瑣事。", items: ["家具組裝", "門窗修繕", "牆面補土", "層架安裝", "掛畫服務", "雜項維修"] },
        accounting: { title: "會計稅務 (Accounting)", desc: "專為留英華人與中小企業量身打造。合規申報，讓您專注於事業發展。", items: ["個人所得稅", "公司年帳", "VAT 申報", "薪酬運算", "Xero 諮詢", "稅務分析"] },
        renovation: { title: "房屋裝修 (Renovation)", desc: "舊房翻新、廚房擴建到室內設計。提供透明的進度管理與品質保證。", items: ["廚衛翻新", "閣養擴建", "室內設計", "油漆粉刷", "地板鋪設", "庭院景觀"] },
        education: { title: "教育學習 (Education)", desc: "一對一語言家教、專業技能培訓。量身定制的學習進度，讓知識觸手可及。", items: ["語言家教", "雅思/托福", "程式開發", "音樂藝術", "商學職能", "學術指導"] },
        cleaning: { title: "清潔打掃 (Cleaning)", desc: "居家清潔、退租深層掃描，還是商業空間消毒，提供最細緻的專業服務。", items: ["居家打掃", "退租清潔", "地毯清洗", "窗戶清潔", "辦公室清潔", "除蟲消毒"] },
        legal: { title: "法律諮詢 (Legal)", desc: "合規審查、簽證諮詢到各類法律文書。對接專業專家，保障您的權益。", items: ["合約草擬", "簽證諮詢", "房屋法律", "糾紛調解", "商業法律", "法律公證"] },
        commercial: { title: "商用服務 (Commercial)", desc: "專為商家提供。包含店面裝修、辦公室遷移、機電維護等。", items: ["店面設計", "辦公室遷移", "商業用電", "消防安檢", "通訊網路", "空調維護"] }
      },
      popularTitle: "熱門專案", popularIn: "在", allUK: "全英國",
      noProjects: { title: "此分類目前尚無發布的服務專案", desc: "我們正在尋找各城市的頂尖專家加入。" },
      reviews: { excellent: "優異", basedOn: "基於", verified: "已驗證" }
    },
    location: { selectCity: "選擇城市", detecting: "正在定位...", switch: "切換城市", nearby: "附近服務" }
  },
  hi: {
    nav: { browse: "सेवाएं खोजें", join: "विशेषज्ञ बनें", login: "लॉगिन", logout: "लॉगआउट", dashboard: "डैशबोर्ड" },
    hero: { title: "हम आपकी क्या सहायता कर सकते हैं?", subtitle: "FAQ खोजें।", searchPlaceholder: "खोजें...", badge: "सहायता केंद्र" },
    faq: { 
      title: "स्मार्ट FAQ", subtitle: "आधिकारिक उत्तर।", categories: { payments: "भुगतान", disputes: "विवाद", bookings: "बुकिंग" }, 
      aura: { title: "सहायता चाहिए?", subtitle: "Aura AI सहायता करता है।", cta: "चैट करें" },
      questions: {
        payments: [{ q: "क्रेडिट कार्ड?", a: "हाँ।" }, { q: "धनवापसी?", a: "24 घंटों में आवेदन करें।" }],
        disputes: [{ q: "विशेषज्ञ नहीं आया?", a: "रिफंड मांगें।" }, { q: "अतिरिक्त लागत?", a: "अनिवार्य नहीं।" }],
        bookings: [{ q: "रीशेड्यूल?", a: "48 घंटे पहले।" }]
      }
    },
    footer: { tagline: "सत्यापित विशेषज्ञों से जुड़ें।", explore: "सेवाएं", legal: "कानूनी", support: "सहायता", rights: "सर्वाधिकार सुरक्षित।", terms: "नियम", privacy: "गोपनीयता", cookies: "कुकीज़", help: "सहायता केंद्र", contact: "संपर्क" },
    search: { filters: "फ़िल्टर", keyword: "कीवर्ड", location: "स्थान", category: "श्रेणी", minRating: "रेटिंग", verifiedOnly: "सत्यापित", apply: "लागू करें", sortBy: "क्रमबद्ध करें", sortRating: "रेटिंग", sortJobs: "कार्य", sortDistance: "दूरी", sortPrice: "कीमत", foundCount: "विशेषज्ञ मिले", searching: "खोज...", noResults: "नहीं मिला", clearFilters: "साफ़ करें", basePrice: "से", viewDetails: "विवरण", listView: "सूची दृश्य", mapView: "मानचित्र दृश्य" },
    booking: {
      steps: { details: "विवरण", schedule: "शेड्यूल", confirmation: "समीक्षा" },
      titles: { details: "बुकिंग विवरण", schedule: "समय चुनें", confirm: "पुष्टि करें", success: "पुष्टि हो गई!" },
      labels: { date: "तारीख", time: "समय", make: "मेक", model: "मॉडल", address: "पता", notes: "नोट्स", agree: "सहमत हूँ", summary: "सारांश", paid: "भुगतान", merchant: "मर्चेंट", service: "सेवा" },
      buttons: { next: "अगला", prev: "पिछला", pay: "भुगतान करें", home: "होम", dashboard: "बुकिंग देखें" },
      messages: { finalizing: "अंतिम रूप...", wait: "प्रतीक्षा करें।", contact24h: "24 घंटों में संपर्क।", safety: "सुरक्षित भुगतान", noReviews: "कोई समीक्षा नहीं।", recommended: "अनुशंसित", replyFromMaster: "उत्तर" }
    },
    merchant: {
      verified: "सत्यापित", background: "पेशेवर पृष्ठभूमि", portfolio: "पोर्टफोलियो", reviewTitle: "समीक्षा", realReviews: "प्रतिक्रिया", verifiedBooking: "सत्यापित", pricingAnalysis: "मुख्य विशेषताएं", bookingChannel: "बुकिंग चैनल", viewServices: "सेवाएं देखें", guarantee: "गारंटी", fastResponse: "तेजी से प्रतिक्रिया", contactExpert: "विशेषज्ञ से पूछें", noReviews: "कोई समीक्षा नहीं", reply: "प्रतिक्रिया"
    },
    home: {
      hero: { badge: "यूके का सबसे भरोसेमंद सर्विस मार्केटप्लेस", title1: "स्थानीय विशेषज्ञों को खोजें", title2: "सेकंड में।", subtitle: "इमरजेंसी कार रिपेयर से लेकर होम रिनोवेशन तक।", searchPlaceholder: "आपको क्या सेवा चाहिए?", locationPlaceholder: "शहर या पिनकोड", aiMatch: "AI मैच", searchBtn: "खोजें" },
      recommendation: { title1: "स्मार्ट सिफारिश", title2: "AI डिस्कवरी", subtitle: "सेवाओं का सटीक मिलान", browse: "अभी देखें" },
      categories: { plumbing: "प्लंबिंग", repairs: "मरम्मत", renovation: "नवीनीकरण", education: "शिक्षा", accounting: "लेखांकन", legal: "कानूनी", commercial: "वाणिज्यिक", cleaning: "सफाई", car: "ऑटोमोबाइल" },
      sections: {
        plumbing: { title: "प्लंबिंग और बिजली", desc: "विशेषज्ञ सेवाएं।", items: ["मरम्मत", "वायरिंग", "स्थापना", "बॉयलर", "स्विच", "स्मार्ट होम"] },
        repairs: { title: "होम हैंडिमैन", desc: "घर के कामों के लिए।", items: ["असेंबली", "दरवाजे", "दीवार", "शेल्फिंग", "पेंटिंग", "विविध"] },
        accounting: { title: "लेखा और कर", desc: "वित्तीय सेवाएं।", items: ["टैक्स रिटर्न", "खाते", "वैट", "पेरोल", "परामर्श", "विश्लेषण"] },
        renovation: { title: "घर का नवीनीकरण", desc: "गुणवत्ता गारंटी।", items: ["रसोई", "विस्तार", "डिजाइन", "पेंटिंग", "फर्श", "लैंडस्केपिंग"] },
        education: { title: "शिक्षा", desc: "सीखने के लिए।", items: ["ट्यूटर", "IELTS", "प्रोग्रामिंग", "कला", "व्यापार", "अकादमिक"] },
        cleaning: { title: "सफाई", desc: "पेशेवर सफाई।", items: ["घर", "टेनेंसी", "कालीन", "खिड़की", "कार्यालय", "कीटाणुशोधन"] },
        legal: { title: "कानूनी", desc: "कानूनी सलाह।", items: ["अनुबंध", "वीजा", "संपत्ति", "विवाद", "व्यापार", "नोटरी"] },
        commercial: { title: "वाणिज्यिक", desc: "व्यापार सेवाओं के लिए।", items: ["दुकान", "कार्यालय", "बिजली", "सुरक्षा", "आईटी", "एसी"] }
      },
      popularTitle: "लोकप्रिय परियोजनाएं", popularIn: "में", allUK: "पूरा यूके",
      noProjects: { title: "कोई परियोजना नहीं मिली", desc: "हम विशेषज्ञों को जोड़ रहे हैं।" },
      reviews: { excellent: "उत्कृष्ट", basedOn: "आधारित", verified: "सत्यापित" }
    },
    location: { selectCity: "शहर चुनें", detecting: "खोज रहा है...", switch: "बदलें", nearby: "पास की सेवाएं" }
  },
  ar: {
    nav: { browse: "تصفح الخدمات", join: "انضم كخبير", login: "تسجيل الدخول", logout: "تسجيل الخروج", dashboard: "لوحة التحكم" },
    hero: { title: "كيف نساعدك؟", subtitle: "ابحث في الأسئلة.", searchPlaceholder: "بحث...", badge: "مركز المساعدة" },
    faq: { 
      title: "الأسئلة الشائعة", subtitle: "إجابات رسمية.", categories: { payments: "المدفوعات", disputes: "النزاعات", bookings: "الحجوزات" }, 
      aura: { title: "مساعدة؟", subtitle: "Aura AI يساعدك.", cta: "تحدث الآن" },
      questions: {
        payments: [{ q: "بطاقة ائتمان؟", a: "نعم." }, { q: "استرداد؟", a: "خلال 24 ساعة." }],
        disputes: [{ q: "لم يحضر؟", a: "اطلب استرداد." }, { q: "تكاليف؟", a: "ليست إلزامية." }],
        bookings: [{ q: "إعادة جدولة؟", a: "قبل 48 ساعة." }]
      }
    },
    footer: { tagline: "خبراء محليون.", explore: "استكشاف", legal: "قانوني", support: "دعم", rights: "حقوق محفوظة.", terms: "شروط", privacy: "خصوصية", cookies: "ملفات التعريف", help: "مساعدة", contact: "اتصل بنا" },
    search: { filters: "فلاتر", keyword: "كلمة", location: "موقع", category: "فئة", minRating: "تقييم", verifiedOnly: "معتمد", apply: "تطبيق", sortBy: "فرز", sortRating: "تقييم", sortJobs: "وظائف", sortDistance: "مسافة", sortPrice: "سعر", foundCount: "خبراء", searching: "بحث...", noResults: "لا يوجد", clearFilters: "مسح", basePrice: "من", viewDetails: "تفاصيل", listView: "عرض القائمة", mapView: "عرض الخريطة" },
    booking: {
      steps: { details: "تفاصيل", schedule: "جدول", confirmation: "مراجعة" },
      titles: { details: "تفاصيل الحجز", schedule: "اختر وقت", confirm: "تأكيد", success: "تم بنجاح!" },
      labels: { date: "تاريخ", time: "وقت", make: "ماركة", model: "موديل", address: "عنوان", notes: "ملاحظات", agree: "أوافق", summary: "ملخص", paid: "مدفوع", merchant: "تاجر", service: "خدمة" },
      buttons: { next: "التالي", prev: "سابق", pay: "ادفع", home: "رئيسية", dashboard: "حجوزاتي" },
      messages: { finalizing: "إنهاء...", wait: "انتظر.", contact24h: "خلال 24 ساعة.", safety: "دفع آمن", noReviews: "لا تقييمات.", recommended: "موصى به", replyFromMaster: "رد" }
    },
    merchant: {
      verified: "معتمد", background: "خلفية", portfolio: "أعمال", reviewTitle: "تقييمات", realReviews: "تعليقات", verifiedBooking: "مؤكد", pricingAnalysis: "مميزات", bookingChannel: "حجز سريع", viewServices: "خدمات", guarantee: "ضمان", fastResponse: "استجابة", contactExpert: "اسأل", noReviews: "لا يوجد", reply: "رد رسمي"
    },
    home: {
      hero: { badge: "سوق الخدمات الأكثر ثقة", title1: "ابحث واحجز خبراء", title2: "في ثوانٍ.", subtitle: "من إصلاح السيارات إلى تجديد المنازل.", searchPlaceholder: "الخدمة المطلوبة؟", locationPlaceholder: "المدينة أو الرمز", aiMatch: "مطابقة AI", searchBtn: "بحث" },
      recommendation: { title1: "توصيات ذكية", title2: "اكتشاف AI", subtitle: "مطابقة الخدمات بدقة", browse: "تصفح الآن" },
      categories: { plumbing: "سباكة", repairs: "إصلاحات", renovation: "ترميم", education: "تعليم", accounting: "محاسبة", legal: "قانون", commercial: "تجاري", cleaning: "تنظيف", car: "سيارات" },
      sections: {
        plumbing: { title: "السباكة والكهرباء", desc: "خبراء معتمدون.", items: ["إصلاح الأنابيب", "توصيلات", "تركيب", "غلايات", "مفاتيح", "منزل ذكي"] },
        repairs: { title: "إصلاحات منزلية", desc: "للمهام المنزلية.", items: ["تجميع", "أبواب", "جدران", "أرفف", "طلاء", "إصلاحات"] },
        accounting: { title: "المحاسبة والضرائب", desc: "خدمات مالية.", items: ["إقرار ضريبي", "حسابات", "ضريبة", "رواتب", "استشارات", "تحليل"] },
        renovation: { title: "ترميم المنازل", desc: "ضمان الجودة.", items: ["مطبخ", "توسعة", "تصميم", "طلاء", "أرضيات", "تنسيق"] },
        education: { title: "التعليم", desc: "للمعرفة والتعلم.", items: ["لغات", "برمجة", "موسيقى", "مهارات", "مساعدة"] },
        cleaning: { title: "التنظيف", desc: "تنظيف احترافي.", items: ["منزل", "عميق", "سجاد", "نوافذ", "مكاتب", "تعقيم"] },
        legal: { title: "قانوني", desc: "استشارات قانونية.", items: ["عقود", "تأشيرة", "عقارات", "نزاعات", "أعمال", "توثيق"] },
        commercial: { title: "خدمات تجارية", desc: "للمساحات التجارية.", items: ["متاجر", "مكاتب", "كهرباء", "سلامة", "IT", "تكييف"] }
      },
      popularTitle: "المشاريع الشعبية", popularIn: "في", allUK: "كل المملكة المتحدة",
      noProjects: { title: "لا توجد مشاريع", desc: "نحن نضيف الخبراء." },
      reviews: { excellent: "ممتاز", basedOn: "بناءً على", verified: "موثق" }
    },
    location: { selectCity: "اختر مدينة", detecting: "جاري التحديد...", switch: "تبديل", nearby: "خدمات قريبة" }
  },
  ja: {
    nav: { browse: "サービスを探す", join: "参加", login: "ログイン", logout: "終了", dashboard: "ダッシュ" },
    hero: { title: "お手伝いします", subtitle: "FAQ検索", searchPlaceholder: "検索...", badge: "ヘルプ" },
    faq: { 
      title: "スマートFAQ", subtitle: "公式回答", categories: { payments: "支払い", disputes: "紛争", bookings: "予約" }, 
      aura: { title: "ヘルプ？", subtitle: "Aura AI", cta: "チャット" },
      questions: {
        payments: [{ q: "カード？", a: "はい" }, { q: "返金？", a: "24時間以内" }],
        disputes: [{ q: "来なかった？", a: "返金申請" }, { q: "追加料金？", a: "不要" }],
        bookings: [{ q: "変更？", a: "48時間前" }]
      }
    },
    footer: { tagline: "エキスパート", explore: "探索", legal: "法的事項", support: "サポート", rights: "All rights reserved.", terms: "規約", privacy: "プライバシー", cookies: "Cookie", help: "ヘルプ", contact: "連絡" },
    search: { filters: "フィルタ", keyword: "ワード", location: "場所", category: "カテゴリ", minRating: "評価", verifiedOnly: "認定済", apply: "適用", sortBy: "順序", sortRating: "評価", sortJobs: "実績", sortDistance: "距離", sortPrice: "価格", foundCount: "件", searching: "検索中...", noResults: "なし", clearFilters: "クリア", basePrice: "から", viewDetails: "詳細", listView: "リスト表示", mapView: "マップ表示" },
    booking: {
      steps: { details: "詳細", schedule: "予約", confirmation: "確認" },
      titles: { details: "詳細入力", schedule: "日時選択", confirm: "確認", success: "完了！" },
      labels: { date: "日付", time: "時間", make: "メーカー", model: "モデル", address: "住所", notes: "備考", agree: "同意", summary: "要約", paid: "支払", merchant: "店", service: "名" },
      buttons: { next: "次へ", prev: "戻る", pay: "予約", home: "ホーム", dashboard: "状況" },
      messages: { finalizing: "確定中...", wait: "待機", contact24h: "24時間以内", safety: "保証", noReviews: "なし", recommended: "推奨", replyFromMaster: "返信" }
    },
    merchant: {
      verified: "認証", background: "背景", portfolio: "事例", reviewTitle: "レビュー", realReviews: "件", verifiedBooking: "認証済", pricingAnalysis: "ハイライト", bookingChannel: "予約", viewServices: "一覧", guarantee: "保証", fastResponse: "迅速", contactExpert: "相談", noReviews: "なし", reply: "返信"
    },
    home: {
      hero: { badge: "英国で最も信頼されている市場", title1: "地元の専門家を予約", title2: "今すぐ。", subtitle: "車の修理からリフォームまで。", searchPlaceholder: "サービスを検索", locationPlaceholder: "都市または郵便番号", aiMatch: "AIマッチ", searchBtn: "検索" },
      recommendation: { title1: "スマート推薦", title2: "AI Discovery", subtitle: "ニーズに合わせてマッチング", browse: "今すぐ見る" },
      categories: { plumbing: "水道・電気", repairs: "修理", renovation: "リフォーム", education: "教育", accounting: "会計", legal: "法律", commercial: "商用", cleaning: "掃除", car: "自動車" },
      sections: {
        plumbing: { title: "水道と電気", desc: "認証済みの専門家。", items: ["配管修理", "配線", "設置", "ボイラー", "スイッチ", "スマートホーム"] },
        repairs: { title: "修理代行", desc: "家庭の用事に。", items: ["組立", "窓", "壁", "棚", "塗装", "雑用"] },
        accounting: { title: "会計と税務", desc: "財務サービス。", items: ["確定申告", "決算", "VAT", "給与", "相談", "分析"] },
        renovation: { title: "住宅リフォーム", desc: "品質保証。", items: ["キッチン", "増築", "デザイン", "塗装", "床", "造園"] },
        education: { title: "教育", desc: "学びのために。", items: ["講師", "語学", "プログラム", "芸術", "ビジネス", "学術"] },
        cleaning: { title: "清掃", desc: "プロの掃除。", items: ["住宅掃除", "退去時", "絨毯", "窓", "オフィス", "消毒"] },
        legal: { title: "法律諮問", desc: "法的助言。", items: ["契約", "ビザ", "不動産", "紛争", "ビジネス", "公証"] },
        commercial: { title: "商用サービス", desc: "ビジネス空間。", items: ["店舗設計", "移転", "電気", "火災安全", "IT", "空調"] }
      },
      popularTitle: "人気のプロジェクト", popularIn: "の", allUK: "全英",
      noProjects: { title: "見つかりません", desc: "専門家を募集しています。" },
      reviews: { excellent: "素晴らしい", basedOn: "に基づく", verified: "認証済" }
    },
    location: { selectCity: "都市を選択", detecting: "検出中...", switch: "切換", nearby: "近隣のサービス" }
  },
  ko: {
    nav: { browse: "서비스 찾기", join: "가입", login: "로그인", logout: "종료", dashboard: "대시보드" },
    hero: { title: "도와드릴까요?", subtitle: "FAQ 검색", searchPlaceholder: "검색...", badge: "센터" },
    faq: { 
      title: "스마트 FAQ", subtitle: "공식 답변", categories: { payments: "결제", disputes: "분쟁", bookings: "예약" }, 
      aura: { title: "도움?", subtitle: "Aura AI", cta: "채팅" },
      questions: {
        payments: [{ q: "카드?", a: "네" }, { q: "환불?", a: "24시간" }],
        disputes: [{ q: "안옴?", a: "환불" }, { q: "추가비?", a: "아님" }],
        bookings: [{ q: "변경?", a: "48시간" }]
      }
    },
    footer: { tagline: "전문가", explore: "탐색", legal: "법률", support: "지원", rights: "Rights reserved.", terms: "약관", privacy: "개인정보", cookies: "쿠키", help: "센터", contact: "문의" },
    search: { filters: "필터", keyword: "단어", location: "위치", category: "범주", minRating: "평점", verifiedOnly: "인증", apply: "적용", sortBy: "정렬", sortRating: "평점", sortJobs: "완료", sortDistance: "거리", sortPrice: "가격", foundCount: "명", searching: "검색중...", noResults: "없음", clearFilters: "초기화", basePrice: "부터", viewDetails: "상세", listView: "목록 보기", mapView: "지도 보기" },
    booking: {
      steps: { details: "상세", schedule: "일정", confirmation: "검토" },
      titles: { details: "정보입력", schedule: "시간선택", confirm: "확인", success: "확정!" },
      labels: { date: "날짜", time: "시간", make: "브랜드", model: "모델", address: "주소", notes: "비고", agree: "동의", summary: "요약", paid: "결제", merchant: "업체", service: "명" },
      buttons: { next: "다음", prev: "이전", pay: "예약", home: "홈", dashboard: "보기" },
      messages: { finalizing: "확정중...", wait: "대기", contact24h: "24시간", safety: "보장", noReviews: "없음", recommended: "추천", replyFromMaster: "답글" }
    },
    merchant: {
      verified: "인증", background: "배경", portfolio: "사례", reviewTitle: "리뷰", realReviews: "개", verifiedBooking: "인증", pricingAnalysis: "특징", bookingChannel: "채널", viewServices: "보기", guarantee: "보증", fastResponse: "응답", contactExpert: "문의", noReviews: "없음", reply: "답변"
    },
    home: {
      hero: { badge: "영국 최고의 서비스 마켓", title1: "현지 전문가 예약", title2: "순식간에.", subtitle: "자동차 수리부터 리모델링까지.", searchPlaceholder: "서비스 검색", locationPlaceholder: "도시 또는 우편번호", aiMatch: "AI 매칭", searchBtn: "검색" },
      recommendation: { title1: "스마트 추천", title2: "AI Discovery", subtitle: "자산 및 니즈에 따른 매칭", browse: "지금 보기" },
      categories: { plumbing: "배관·전기", repairs: "수리", renovation: "리모델링", education: "교육", accounting: "회계", legal: "법률", commercial: "상업", cleaning: "청소", car: "자동차" },
      sections: {
        plumbing: { title: "배관 및 전기", desc: "공인된 전문가 서비스.", items: ["수리", "배선", "설치", "보일러", "스위치", "스마트홈"] },
        repairs: { title: "홈 리페어", desc: "집안일을 위해.", items: ["조립", "창문", "벽 보수", "선반", "페인팅", "수리"] },
        accounting: { title: "회계 및 세금", desc: "금융 서비스.", items: ["세금 신고", "장부", "VAT", "급여", "상담", "분석"] },
        renovation: { title: "인테리어 리모델링", desc: "품질 보증.", items: ["주방", "증축", "디자인", "페인팅", "바닥재", "조경"] },
        education: { title: "교육", desc: "배움을 위해.", items: ["과외", "IELTS", "코딩", "예술", "비즈니스", "지도"] },
        cleaning: { title: "청소", desc: "전문 청소.", items: ["가정", "퇴거", "카페트", "창문", "사무실", "방역"] },
        legal: { title: "법률 상담", desc: "법률 상담.", items: ["계약", "비자", "부동산", "분쟁", "상법", "공증"] },
        commercial: { title: "상업 서비스", desc: "비즈니스 공간.", items: ["인테리어", "이전", "전기", "소방", "IT", "공조"] }
      },
      popularTitle: "인기 프로젝트", popularIn: "의", allUK: "영국 전체",
      noProjects: { title: "결과 없음", desc: "전문가를 모집 중입니다." },
      reviews: { excellent: "탁월함", basedOn: "기준", verified: "인증됨" }
    },
    location: { selectCity: "도시 선택", detecting: "감지 중...", switch: "변경", nearby: "주변 서비스" }
  }
};
