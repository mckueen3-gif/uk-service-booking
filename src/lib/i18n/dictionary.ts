export type Locale = 'en' | 'zh-TW' | 'hi' | 'ar' | 'ja' | 'ko' | 'pl' | 'ro' | 'ur' | 'pa';

export interface Dictionary {
  nav: { browse: string; join: string; login: string; logout: string; dashboard: string; aiDiagnosis: string; };
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
  footer: { tagline: string; explore: string; legal: string; support: string; rights: string; terms: string; privacy: string; cookies: string; help: string; contact: string; aiDiagnosis: string; homeCleaning: string; plumbingServices: string; automotiveServices: string; };
  search: { filters: string; keyword: string; location: string; category: string; minRating: string; verifiedOnly: string; apply: string; sortBy: string; sortRating: string; sortJobs: string; sortDistance: string; sortPrice: string; foundCount: string; searching: string; noResults: string; clearFilters: string; basePrice: string; viewDetails: string; listView: string; mapView: string; searchThisArea: string; };
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
    aiCTA: {
      badge: string; title1: string; title2: string; subtitle: string; button: string;
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
  diagnosis: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    features: {
      instant: { title: string; desc: string; };
      pricing: { title: string; desc: string; };
      verified: { title: string; desc: string; };
    };
    cta: string;
    tool: {
      title: string;
      subtitle: string;
      step1: string;
      step2: string;
      step3: string;
      uploadHint: string;
      replaceHint: string;
      submit: string;
      loading: string;
      disclaimer: string;
      newDiagnosis: string;
      categories: {
        plumbing: string;
        auto: string;
        renovation: string;
        electrical: string;
        cleaning: string;
      };
      resultTitle: string;
      detectedIssue: string;
      recommendedSolution: string;
      estimatedCostLabel: string;
      ukStandard: string;
      includesLabor: string;
      bookSpecialist: string;
      confidence: string;
      analyzedPhoto: string;
      guaranteedRepairs: string;
      disputeResolution: string;
      fastTurnaround: string;
      responseHours: string;
      errorPhotoCategory: string;
      errorUnexpected: string;
      uploadFormatHint: string;
      descriptionPlaceholder: string;
    };
  };
  onboarding: {
    hero: { title: string; subtitle: string; };
    steps: { profile: string; credentials: string; contract: string; };
    sectors: {
      title: string;
      professional: { title: string; desc: string; industries: string[]; };
      education: { title: string; desc: string; industries: string[]; };
      technical: { title: string; desc: string; industries: string[]; };
    };
    contract: {
      title: string;
      scrollingNotice: string;
      agree: string;
      clauses: {
        commission: { title: string; body: string; };
        service: { title: string; body: string; };
        disputes: { title: string; body: string; };
      };
    };
    buttons: { start: string; next: string; back: string; submit: string; };
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: { browse: "Browse Services", join: "Join as Expert", login: "Login", logout: "Logout", dashboard: "Dashboard", aiDiagnosis: "AI Diagnosis" },
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
    footer: { tagline: "Premium UK service marketplace connecting you with verified local experts.", explore: "Explore Services", legal: "Legal & Compliance", support: "Customer Support", rights: "All rights reserved. Premium Service Architecture.", terms: "Terms", privacy: "Privacy", cookies: "Cookies", help: "Help Center", contact: "Contact Us", aiDiagnosis: "AI Diagnosis", homeCleaning: "Home Cleaning", plumbingServices: "Plumbing Services", automotiveServices: "Automotive Services" },
    search: { filters: "Filters", keyword: "Keyword", location: "Location", category: "Category", minRating: "Min Rating", verifiedOnly: "Verified Pros Only", apply: "Apply Filters", sortBy: "Sort by", sortRating: "Rating", sortJobs: "Jobs Done", sortDistance: "Distance", sortPrice: "Price: Low to High", foundCount: "experts found", searching: "Searching...", noResults: "No matching merchants found", clearFilters: "Clear all filters", basePrice: "From", viewDetails: "View Details", listView: "List View", mapView: "Map View", searchThisArea: "Search this area" },
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
      aiCTA: {
        badge: "NEW: AI POWERED",
        title1: "Got a Repair?",
        title2: "Get an Instant Diagnosis.",
        subtitle: "Upload a photo of your problem and our AI will identify the issue and give you a UK price estimate in seconds.",
        button: "Try AI Diagnosis Free"
      },
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
    location: { selectCity: "Select City", detecting: "Detecting...", switch: "Switch", nearby: "Nearby" },
    diagnosis: {
      badge: "POWERED BY GEMINI AI",
      title1: "Professional Repairs",
      title2: "Identified In Seconds",
      subtitle: "Skip the guesswork. Our AI analyzes your photos to provide instant insights, repair scopes, and fair UK price estimates before you book.",
      features: {
        instant: { title: "Instant Insights", desc: "No more waiting for callbacks. Get a technical breakdown of the issue immediately after uploading." },
        pricing: { title: "Fair Market Pricing", desc: "We use real-time UK service data to give you an accurate price range for your specific region." },
        verified: { title: "Verified Booking", desc: "Once diagnosed, connect with the top 1% of UK experts who are specialized in your exact problem." }
      },
      cta: "Browse All Services",
      tool: {
        title: "Instant AI Diagnosis",
        subtitle: "Upload a photo and let our AI estimate the repair cost & scope.",
        step1: "1. Upload Photo Proof",
        step2: "2. Select Category",
        step3: "3. Describe the issue (Optional)",
        uploadHint: "Take a photo or upload",
        replaceHint: "Click to replace photo",
        submit: "Generate Free AI Diagnosis",
        loading: "Generating AI Insights...",
        disclaimer: "AI estimates are provided for guidance. Verified quotes are provided by specialists.",
        newDiagnosis: "New Diagnosis",
        categories: {
          plumbing: "Plumbing & Heating",
          auto: "Car Repair & Service",
          renovation: "Home Renovation",
          electrical: "Electrical Work",
          cleaning: "Professional Cleaning"
        },
        resultTitle: "AI Repair Insight",
        detectedIssue: "Detected Issue",
        recommendedSolution: "Recommended Solution",
        estimatedCostLabel: "Estimated Cost",
        ukStandard: "UK Service Standard",
        includesLabor: "Includes Labor & Parts",
        bookSpecialist: "Book Verified Specialist",
        confidence: "Confidence",
        analyzedPhoto: "Analyzed Photo",
        guaranteedRepairs: "Guaranteed Repairs",
        disputeResolution: "All bookings include our AI-driven dispute resolution for peace of mind.",
        fastTurnaround: "Fast Turnaround",
        responseHours: "Most {category} specialists respond within 2 hours.",
        errorPhotoCategory: "Please upload a photo and select a category.",
        errorUnexpected: "An unexpected error occurred: ",
        uploadFormatHint: "Supports high-quality JPG, PNG (Max 5MB)",
        descriptionPlaceholder: "e.g. My kitchen sink has been dripping since yesterday morning..."
      }
    },
    onboarding: {
      hero: { title: "Grow Your Business with ServiceHub", subtitle: "Join the UK's leading marketplace for professionals in Education, Accounting, Repairs, and more." },
      steps: { profile: "Business Profile", credentials: "Qualifications", contract: "Review Contract" },
      sectors: {
        title: "Choose Your Expertise",
        professional: { title: "Professional Services", desc: "For certified experts handling complex documentation & advice.", industries: ["Accounting", "Legal", "Financial Advice"] },
        education: { title: "Education & Tutors", desc: "For teachers, skill trainers, and academic mentors.", industries: ["Language Tutors", "Exam Prep", "Skill Training"] },
        technical: { title: "Technical & Maintenance", desc: "For skilled tradespeople and essential home/car services.", industries: ["Plumbing", "Electrical", "Auto Repair", "Renovation"] }
      },
      contract: {
        title: "Expert Services Agreement",
        scrollingNotice: "Please scroll to the bottom of the agreement to confirm your acceptance.",
        agree: "I have read and agree to the Expert Services Agreement",
        clauses: {
          commission: { title: "1. Platform Service Fees & Growth Incentives", body: "ServiceHub applies a competitive 8% platform access fee on successful bookings. To support your business growth, your first 5 orders are 100% commission-free. Fees are automatically deducted from the final payout." },
          service: { title: "2. Service Excellence & UK Compliance", body: "Partners must maintain a minimum rating of 4.2 and respond to inquiries within 24 hours. You certify that you hold all valid UK licenses and insurance relevant to your trade." },
          disputes: { title: "3. AI-Powered Dispute Resolution & Smart Matching", body: "Our proprietary AI Arbiter provides instant and impartial resolution. Through AI Smart Matching technology, we ensure you receive the most accurate local instant booking orders." }
        }
      },
      buttons: { start: "Get Started", next: "Continue", back: "Go Back", submit: "Sign and Join" }
    }
  },
  'zh-TW': {
    nav: { browse: "找服務", join: "成為專家", login: "登入", logout: "登出", dashboard: "控制台", aiDiagnosis: "AI 診斷" },
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
    footer: { tagline: "優質英國居家與汽車維修預約平台。", explore: "探索服務", legal: "法律與合規", support: "客戶支援", rights: "保留所有權利。", terms: "服務條款", privacy: "隱私政策", cookies: "Cookie 政策", help: "幫助中心", contact: "聯繫我們", aiDiagnosis: "AI 診斷", homeCleaning: "居家清潔", plumbingServices: "水電維修", automotiveServices: "汽車維修" },
    search: { filters: "搜索過濾", keyword: "關鍵字", location: "地點", category: "服務分類", minRating: "最低評分", verifiedOnly: "僅看認證職人", apply: "應用過濾器", sortBy: "排序方式", sortRating: "按評分", sortJobs: "按完工數", sortDistance: "按距離", sortPrice: "按價格", foundCount: "個匹配的商家", searching: "搜尋中...", noResults: "找不到匹配的商戶", clearFilters: "清除所有過濾條件", basePrice: "起步價", viewDetails: "查看詳情", listView: "列表模式", mapView: "地圖模式", searchThisArea: "搜尋此區域" },
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
      aiCTA: {
        badge: "全新：AI 驅動",
        title1: "需要維修嗎？",
        title2: "獲取即時 AI 診斷。",
        subtitle: "上傳您的問題照片，我們的 AI 將在幾秒鐘內識別問題並為您提供英國市場價格預估。",
        button: "免費體驗 AI 診斷"
      },
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
    location: { selectCity: "選擇城市", detecting: "正在定位...", switch: "切換城市", nearby: "附近服務" },
    diagnosis: {
      badge: "由 GEMINI AI 驅動",
      title1: "專業維修",
      title2: "秒速識別",
      subtitle: "告別瞎猜。我們的 AI 分析您的照片，在您預約前提供即時見解、維修範圍和公平的英國價格估算。",
      features: {
        instant: { title: "即時見解", desc: "不再需要等待回電。上傳後立即獲得問題的技術分析。" },
        pricing: { title: "公平市場定價", desc: "我們使用即時英國服務數據，為您的特定地區提供準確的價格範圍。" },
        verified: { title: "認證預約", desc: "診斷完成後，即可聯繫專精於您問題的英國前 1% 頂尖專家。" }
      },
      cta: "瀏覽所有服務",
      tool: {
        title: "即時 AI 診斷",
        subtitle: "上傳照片，讓我們的 AI 估算維修成本與範圍。",
        step1: "1. 上傳照片憑證",
        step2: "2. 選擇分類",
        step3: "3. 描述問題（可選）",
        uploadHint: "拍攝照片或上傳",
        replaceHint: "點擊更換照片",
        submit: "生成免費 AI 診斷",
        loading: "正在生成 AI 見解...",
        disclaimer: "AI 估算僅供參考。正式報價由專業人士提供。",
        newDiagnosis: "重新診斷",
        categories: {
          plumbing: "水電暖通",
          auto: "汽車維修與保養",
          renovation: "裝修工程",
          electrical: "電力工程",
          cleaning: "專業清潔"
        },
        resultTitle: "AI 維修見解",
        detectedIssue: "檢測到的問題",
        recommendedSolution: "推薦解決方案",
        estimatedCostLabel: "預估費用",
        ukStandard: "英國服務標準",
        includesLabor: "包含人工與零件",
        bookSpecialist: "預約認證專家",
        confidence: "信心指數",
        analyzedPhoto: "已分析的照片",
        guaranteedRepairs: "維修保障",
        disputeResolution: "所有預約均包含我們的 AI 驅動爭議解決方案，讓您安心。",
        fastTurnaround: "快速響應",
        responseHours: "大多數 {category} 專家會在 2 小時內回覆。",
        errorPhotoCategory: "請上傳照片並選擇分類。",
        errorUnexpected: "發生預期外的錯誤：",
        uploadFormatHint: "支援高畫質 JPG, PNG (最大 5MB)",
        descriptionPlaceholder: "例如：我的廚房水槽從昨天早上開始一直滴水..."
      }
    },
    onboarding: {
      hero: { title: "在 ServiceHub 擴展您的業務", subtitle: "加入全英領先的專業人才市場，涵蓋教育、會計、維修等多元行業。" },
      steps: { profile: "商家檔案", credentials: "資質驗證", contract: "審閱合約" },
      sectors: {
        title: "選擇您的專業領域",
        professional: { title: "專業服務", desc: "適用於處理複雜文件與諮詢的認證專家。", industries: ["會計稅務", "法律諮詢", "財務建議"] },
        education: { title: "教育培訓", desc: "適用於老師、技能培訓師與學術導師。", industries: ["語言家教", "考試準備", "技能訓練"] },
        technical: { title: "技術與維修", desc: "適用於技師及各類居家、汽車維修專家。", industries: ["水電工程", "電力工程", "汽車維修", "房屋裝修"] }
      },
      contract: {
        title: "專家服務協議",
        scrollingNotice: "請滾動至合約底部以確認接受條款。",
        agree: "我已閱讀並同意專家服務協議",
        clauses: {
          commission: { title: "1. 平台服務費與增長激勵", body: "ServiceHub 對成功的預約收取具競爭力的 8% 平台訪問費。為了支持您的業務成長，您的前 5 筆訂單 100% 免佣金。費用將從最終結算中自動扣除。" },
          service: { title: "2. 卓越服務與英國合規性", body: "合作夥伴必須保持 4.2 以上的評分，並在 24 小時內回覆諮詢。您證明您持有與您的行業相關的所有有效英國執照與保險。" },
          disputes: { title: "3. AI 驅動的糾紛解決與智能匹配", body: "我們專有的 AI 裁決器提供即時且公正的調解。透過 AI 智能匹配技術，我們確保您收到最精確的在地即時預約訂單。" }
        }
      },
      buttons: { start: "立即開始", next: "繼續下一步", back: "返回", submit: "簽署並入駐" }
    }
  },
  // Other languages will be added via separate calls to avoid token limits
  hi: {
    nav: { browse: "सेवाएं खोजें", join: "विशेषज्ञ बनें", login: "लॉगिन", logout: "लॉगआउट", dashboard: "डैशबोर्ड", aiDiagnosis: "AI निदान" },
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
    footer: { tagline: "सत्यापित विशेषज्ञों से जुड़ें।", explore: "सेवाएं", legal: "कानूनी", support: "सहायता", rights: "सर्वाधिकार सुरक्षित।", terms: "नियम", privacy: "गोपनीयता", cookies: "कुकीज़", help: "सहायता केंद्र", contact: "संपرك", aiDiagnosis: "AI निदान", homeCleaning: "घर की सफाई", plumbingServices: "प्लंबिंग सेवाएं", automotiveServices: "ऑटोमोबाइल सेवाएं" },
    search: { filters: "फ़िल्टर", keyword: "कीवर्ड", location: "स्थान", category: "श्रेणी", minRating: "रेटिंग", verifiedOnly: "सत्यापित", apply: "लागू करें", sortBy: "क्रमबद्ध करें", sortRating: "रेटिंग", sortJobs: "कार्य", sortDistance: "दूरी", sortPrice: "कीमत", foundCount: "विशेषज्ञ मिले", searching: "खोज...", noResults: "नहीं मिला", clearFilters: "साफ़ करें", basePrice: "से", viewDetails: "विवरण", listView: "सूची दृश्य", mapView: "मानचित्र दृश्य", searchThisArea: "इस क्षेत्र में खोजें" },
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
      hero: { badge: "यूके का सबसे भरोसेमंद सर्विस मार्केटप्लेस", title1: "स्थानीय विशेषज्ञों को खोजें", title2: "सेकंड में।", subtitle: "इमरजेंसी कार रिपेयर से लेकर घर के नवीनीकरण तक।", searchPlaceholder: "आपको क्या सेवा चाहिए?", locationPlaceholder: "शहर या पिनकोड", aiMatch: "AI मैच", searchBtn: "खोजें" },
      recommendation: { title1: "स्मार्ट सिफारिश", title2: "AI डिस्कवरी", subtitle: "सेवाओं का सटीक मिलान", browse: "अभी देखें" },
      aiCTA: {
        badge: "नया: AI संचालित",
        title1: "मरम्मत चाहिए?",
        title2: "त्वरित निदान प्राप्त करें।",
        subtitle: "अपनी समस्या की फोटो अपलोड करें और हमारा AI सेकंडों में समस्या की पहचान करेगा और आपको कीमत का अनुमान देगा।",
        button: "मुफ्त AI निदान आजमाएं"
      },
      categories: { plumbing: "प्लंबिंग", repairs: "मरम्मत", renovation: "नवीनीकरण", education: "शिक्षा", accounting: "लेखांकन", legal: "कानूनी", commercial: "वाणिज्यिक", cleaning: "सफाई", car: "ऑटोमोबाइल" },
      sections: {
        plumbing: { title: "प्लंबिंग और बिजली", desc: "विशेषज्ञ सेवाएं।", items: ["मरम्मत", "वायरिंग", "स्थापना", "बॉयलर", "स्विच", "स्मार्ट होम"] },
        repairs: { title: "होम हैंडिमَن", desc: "घर के कामों के लिए।", items: ["असेंबली", "दरवाजे", "दीवार", "शेल्फिंग", "पेंटिंग", "विविध"] },
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
    location: { selectCity: "शहर चुनें", detecting: "खोज रहा है...", switch: "बदलें", nearby: "पास की सेवाएं" },
    diagnosis: {
      badge: "GEMINI AI द्वारा संचालित",
      title1: "पेशेवर मरम्मत",
      title2: "सेकंड में पहचान",
      subtitle: "फोटो खींचें और AI को विश्लेषण करने दें। बुक करने से पहले त्वरित जानकारी और मूल्य अनुमान प्राप्त करें।",
      features: {
        instant: { title: "त्वरित जानकारी", desc: "कॉल बैक का इंतजार नहीं। अपलोड के तुरंत बाद तकनीकी विवरण प्राप्त करें।" },
        pricing: { title: "उचित बाजार मूल्य", desc: "हम सटीक मूल्य सीमा देने के लिए रीयल-टाइम यूके डेटा का इस्तेमाल करते हैं।" },
        verified: { title: "सत्यापित बुकिंग", desc: "निदान के बाद, यूके के विशेषज्ञों से सीधा संपर्क करें।" }
      },
      cta: "सभी सेवाएं देखें",
      tool: {
        title: "त्वरित AI निदान",
        subtitle: "फोटो अपलोड करें और AI को लागत का अनुमान लगाने दें।",
        step1: "1. फोटो अपलोड करें",
        step2: "2. श्रेणी चुनें",
        step3: "3. समस्या का वर्णन करें (वैकल्पिक)",
        uploadHint: "फोटो लें या अपलोड करें",
        replaceHint: "फोटो बदलने के लिए क्लिक करें",
        submit: "मुफ्त AI निदान उत्पन्न करें",
        loading: "AI जानकारी उत्पन्न हो रही है...",
        disclaimer: "AI अनुमान केवल मार्गदर्शन के लिए हैं। प्रमाणित उद्धरण विशेषज्ञों द्वारा प्रदान किए जाते हैं।",
        newDiagnosis: "नया निदान",
        categories: {
          plumbing: "प्लंबिंग",
          auto: "ऑटोमोबाइल",
          renovation: "नवीनीकरण",
          electrical: "बिजली",
          cleaning: "सफाई"
        },
        resultTitle: "AI मरम्मत अंतर्दृष्टि",
        detectedIssue: "पहचानी गई समस्या",
        recommendedSolution: "अनुशंसित समाधान",
        estimatedCostLabel: "अनुमानित लागत",
        ukStandard: "यूके सर्विस स्टैंडर्ड",
        includesLabor: "लेबर और पार्ट्स शामिल हैं",
        bookSpecialist: "सत्यापित विशेषज्ञ बुक करें",
        confidence: "आत्मविश्वास",
        analyzedPhoto: "विश्लेषण की गई फोटो",
        guaranteedRepairs: "गारंटीकृत मरम्मत",
        disputeResolution: "मन की शांति के लिए सभी बुकिंग में हमारे AI-संचालित विवाद समाधान शामिल हैं।",
        fastTurnaround: "तेजी से बदलाव",
        responseHours: "अधिकांश {category} विशेषज्ञ 2 घंटे के भीतर जवाब देते हैं।",
        errorPhotoCategory: "कृपया एक फोटो अपलोड करें और श्रेणी चुनें।",
        errorUnexpected: "एक अप्रत्याशित त्रुटि हुई: ",
        uploadFormatHint: "उच्च गुणवत्ता वाले JPG, PNG (अधिकतम 5MB) का समर्थन करता है",
        descriptionPlaceholder: "जैसे: सिंक कल सुबह से टपक रहा है..."
      }
    },
    onboarding: {
      hero: { title: "ServiceHub के साथ अपना व्यवसाय बढ़ाएं", subtitle: "शिक्षा, लेखा, मरम्मत और अन्य क्षेत्रों के पेशेवरों के लिए यूके के अग्रणी मार्केटप्लेस में शामिल हों।" },
      steps: { profile: "व्यवसाय प्रोफ़ाइल", credentials: "गुणवत्ता प्रमाणन", contract: "अनुबंध समीक्षा" },
      sectors: {
        title: "अपनी विशेषज्ञता चुनें",
        professional: { title: "पेशेवर सेवाएँ", desc: "जटिल दस्तावेज़ीकरण और सलाह संभालने वाले प्रमाणित विशेषज्ञों के लिए।", industries: ["लेखांकन", "कानूनी", "वित्तीय सलाह"] },
        education: { title: "शिक्षा और शिक्षक", desc: "शिक्षकों, कौशल प्रशिक्षकों और शैक्षणिक सलाहकारों के लिए।", industries: ["भाषा शिक्षक", "परीक्षा तैयारी", "कौशल प्रशिक्षण"] },
        technical: { title: "तकनीकी और रखरखाव", desc: "कुशल कारीगरों और आवश्यक घरेलू/कार सेवाओं के लिए।", industries: ["प्लंबिंग", "इलेक्ट्रिकल", "ऑटो मरम्मत", "नवीनीकरण"] }
      },
      contract: {
        title: "विशेषज्ञ सेवा अनुबंध",
        scrollingNotice: "कृपया अपनी स्वीकृति की पुष्टि करने के लिए अनुबंध के नीचे तक स्क्रॉल करें।",
        agree: "मैंने विशेषज्ञ सेवा अनुबंध पढ़ लिया है और मैं इससे सहमत हूँ",
        clauses: {
          commission: { title: "1. प्लेटफ़ॉर्म सेवा शुल्क और विकास प्रोत्साहन", body: "ServiceHub सफल बुकिंग पर प्रतिस्पर्धी 8% प्लेटफ़ॉर्म एक्सेस शुल्क लागू करता है। आपके व्यवसाय के विकास का समर्थन करने के लिए, आपके पहले 5 ऑर्डर 100% कमीशन-मुक्त हैं। शुल्क स्वचालित रूप से अंतिम भुगतान से काट लिए जाते हैं।" },
          service: { title: "2. सेवा उत्कृष्टता और यूके अनुपालन", body: "साझेदारों को न्यूनतम 4.2 की रेटिंग बनाए रखनी चाहिए और 24 घंटों के भीतर पूछताछ का जवाब देना चाहिए। आप प्रमाणित करते हैं कि आपके पास अपने व्यापार से संबंधित सभी वैध यूके लाइसेंस और बीमा हैं।" },
          disputes: { title: "3. AI-संचालित विवाद समाधान और स्मार्ट मैचिंग", body: "हमारा प्रोप्रायटरी AI मध्यस्थ त्वरित और निष्पक्ष समाधान प्रदान करता है। AI स्मार्ट मैचिंग तकनीक के माध्यम سے, हम सुनिश्चित करते हैं कि आपको सबसे सटीक स्थानीय तत्काल बुकिंग ऑर्डर प्राप्त हों।" }
        }
      },
      buttons: { start: "शुरू करें", next: "जारी रखें", back: "पीछे जाएं", submit: "हस्ताक्षर करें और शामिल हों" }
    }
  },
  ar: {
    nav: { browse: "تصفح الخدمات", join: "انضم كخبير", login: "تسجيل الدخول", logout: "تسجيل الخروج", dashboard: "لوحة التحكم", aiDiagnosis: "تشخيص الذكاء الاصطناعي" },
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
    footer: { tagline: "خبراء محليون.", explore: "استكشاف", legal: "قانوني", support: "دعم", rights: "حقوق محفوظة.", terms: "شروط", privacy: "خصوصية", cookies: "ملفات التعريف", help: "مساعدة", contact: "اتصل بنا", aiDiagnosis: "تشخيص الذكاء الاصطناعي", homeCleaning: "تنظيف المنزل", plumbingServices: "خدمات السباكة", automotiveServices: "خدمات السيارات" },
    search: { filters: "فلاتر", keyword: "كلمة", location: "موقع", category: "فئة", minRating: "تقييم", verifiedOnly: "معتمد", apply: "تطبيق", sortBy: "فرز", sortRating: "تقييم", sortJobs: "وظائف", sortDistance: "مسافة", sortPrice: "سعر", foundCount: "خبراء", searching: "بحث...", noResults: "لا يوجد", clearFilters: "مسح", basePrice: "من", viewDetails: "تفاصيل", listView: "عرض القائمة", mapView: "عرض الخريطة", searchThisArea: "البحث في هذه المنطقة" },
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
      aiCTA: {
        badge: "جديد: مدعوم بالذكاء الاصطناعي",
        title1: "هل تحتاج إلى إصلاح؟",
        title2: "احصل على تشخيص فوري.",
        subtitle: "قم بتحميل صورة لمشكلتك وسيقوم الذكاء الاصطناعي لدينا بتحديد المشكلة وإعطائك تقديرًا للسعر في ثوانٍ.",
        button: "جرب التشخيص المجاني"
      },
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
    location: { selectCity: "اختر مدينة", detecting: "جاري التحديد...", switch: "تبديل", nearby: "خدمات قريبة" },
    diagnosis: {
      badge: "مدعوم بـ GEMINI AI",
      title1: "إصلاحات احترافية",
      title2: "تحديد في ثوانٍ",
      subtitle: "تجنب التخمين. يقوم الذكاء الاصطناعي بتحليل صورك لتقديم رؤى فورية ونطاق سعر عادل في المملكة المتحدة قبل الحجز.",
      features: {
        instant: { title: "رؤى فورية", desc: "لا مزيد من الانتظار. احصل على تحليل تقني للمشكلة فور تحميل الصورة." },
        pricing: { title: "تسعير عادل", desc: "نستخدم بيانات الخدمات الحقيقية في المملكة المتحدة لإعطائك نطاق سعري دقيق لمنطقتك." },
        verified: { title: "حجز معتمد", desc: "بمجرد التشخيص، تواصل مع أفضل 1٪ من الخبراء المتخصصين في مشكلتك." }
      },
      cta: "تصفح جميع الخدمات",
      tool: {
        title: "تشخيص فوري بالذكاء الاصطناعي",
        subtitle: "حمل صورة ودع الذكاء الاصطناعي يقدر التكلفة والنطاق.",
        step1: "1. تحميل صورة كدليل",
        step2: "2. اختر الفئة",
        step3: "3. وصف المشكلة (اختياري)",
        uploadHint: "التقط صورة أو حملها",
        replaceHint: "اضغط لاستبدال الصورة",
        submit: "توليد تشخيص مجاني",
        loading: "جاري توليد الرؤى...",
        disclaimer: "تقديرات الذكاء الاصطناعي للإرشاد فقط. يتم تقديم العروض الرسمية من قبل المختصين.",
        newDiagnosis: "تشخيص جديد",
        categories: {
          plumbing: "السباكة والتدفئة",
          auto: "إصلاح وصيانة السيارات",
          renovation: "تجديد المنازل",
          electrical: "الأعمال الكهربائية",
          cleaning: "التنظيف الاحترافي"
        },
        resultTitle: "رؤية إصلاح الذكاء الاصطناعي",
        detectedIssue: "المشكلة المكتشفة",
        recommendedSolution: "الحل الموصى به",
        estimatedCostLabel: "التكلفة التقديرية",
        ukStandard: "معايير الخدمة في المملكة المتحدة",
        includesLabor: "يشمل العمالة وقطع الغيار",
        bookSpecialist: "حجز أخصائي معتمد",
        confidence: "الثقة",
        analyzedPhoto: "الصورة المحللة",
        guaranteedRepairs: "إصلاحات مضمونة",
        disputeResolution: "تشمل جميع الحجوزات حل النزاعات المدعوم بالذكاء الاصطناعي لراحة البال.",
        fastTurnaround: "سرعة الإنجاز",
        responseHours: "يستجيب معظم متخصصي {category} في غضون ساعتين.",
        errorPhotoCategory: "يرجى تحميل صورة واختيار الفئة.",
        errorUnexpected: "حدث خطأ غير متوقع: ",
        uploadFormatHint: "يدعم صور JPG و PNG عالية الجودة (بحد أقصى 5 ميجابايت)",
        descriptionPlaceholder: "مثال: صنبور المطبخ يقطر منذ صباح أمس..."
      }
    },
    onboarding: {
      hero: { title: "نمِّ أعمالك مع ServiceHub", subtitle: "انضم إلى السوق الرائدة في المملكة المتحدة للمهنيين في مجالات التعليم والمحاسبة والإصلاحات وغيرها." },
      steps: { profile: "ملف الأعمال", credentials: "المؤهلات", contract: "مراجعة العقد" },
      sectors: {
        title: "اختر خبرتك",
        professional: { title: "الخدمات المهنية", desc: "للخبراء المعتمدين الذين يتعاملون مع الوثائق والاستشارات المعقدة.", industries: ["المحاسبة", "القانون", "الاستشارات المالية"] },
        education: { title: "التعليم والمعلمون", desc: "للمدرسين ومدربي المهارات والموجهين الأكاديميين.", industries: ["مدرسي اللغات", "التحضير للامتحانات", "تدريب المهارات"] },
        technical: { title: "الخدمات الفنية والصيانة", desc: "لأصحاب المهن الماهرة وخدمات المنزل والسيارات الأساسية.", industries: ["السباكة", "الكهرباء", "إصلاح السيارات", "الترميم"] }
      },
      contract: {
        title: "اتفاقية خدمات الخبراء",
        scrollingNotice: "يرجى التمرير إلى أسفل الاتفاقية لتأكيد قبولك.",
        agree: "لقد قرأت وأوافق على اتفاقية خدمات الخبراء",
        clauses: {
          commission: { title: "1. رسوم خدمة المنصة وحوافز النمو", body: "تطبق ServiceHub رسوم وصول تنافسية بنسبة 8% على الحجوزات الناجحة. لدعم نمو عملك، تكون أول 5 طلبات لك معفية من العمولات بنسبة 100%. يتم خصم الرسوم تلقائيًا من الدفعة النهائية." },
          service: { title: "2. التميز في الخدمة والامتثال في المملكة المتحدة", body: "يجب على الشركاء الحفاظ على حد أدنى للتقييم يبلغ 4.2 والرد على الاستفسارات في غضون 24 ساعة. أنت تقر بأنك تحمل جميع التراخيص والتأمينات الصالحة في المملكة المتحدة والمتعلقة بمهنتك." },
          disputes: { title: "3. حل النزاعات المدعوم بالذكاء الاصطناعي والمطابقة الذكية", body: "يوفر محكم الذكاء الاصطناعي الخاص بنا حلاً فوريًا وغير متحيز. من خلال تقنية AI Smart Matching، نضمن حصولك على أدق طلبات الحجز الفوري المحلية." }
        }
      },
      buttons: { start: "ابدأ الآن", next: "متابعة", back: "رجوع", submit: "التوقيع والانضمام" }
    }
  },
  ja: {
    nav: { browse: "サービスを探す", join: "参加", login: "ログイン", logout: "終了", dashboard: "ダッシュ", aiDiagnosis: "AI 診断" },
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
    footer: { tagline: "エキスパート", explore: "探索", legal: "法的事項", support: "サポート", rights: "全著作権所有。", terms: "規約", privacy: "プライバシー", cookies: "Cookie", help: "ヘルプ", contact: "連絡", aiDiagnosis: "AI 診断", homeCleaning: "ハウスクリーニング", plumbingServices: "水道修理サービス", automotiveServices: "自動車修理サービス" },
    search: { filters: "フィルタ", keyword: "ワード", location: "場所", category: "カテゴリ", minRating: "評価", verifiedOnly: "認定済", apply: "適用", sortBy: "順序", sortRating: "評価", sortJobs: "実績", sortDistance: "距離", sortPrice: "価格", foundCount: "件", searching: "検索中...", noResults: "なし", clearFilters: "クリア", basePrice: "から", viewDetails: "詳細", listView: "リスト表示", mapView: "マップ表示", searchThisArea: "このエリアで検索" },
    booking: {
      steps: { details: "詳細", schedule: "予約", confirmation: "確認" },
      titles: { details: "詳細入力", schedule: "日時選択", confirm: "確認", success: "完了！" },
      labels: { date: "日付", time: "時間", make: "メーカー", model: "モデル", address: "住所", notes: "備考", agree: "同意", summary: "要約", paid: "支払", merchant: "店", service: "サービス" },
      buttons: { next: "次へ", prev: "戻る", pay: "予約", home: "ホーム", dashboard: "状況" },
      messages: { finalizing: "確定中...", wait: "待機", contact24h: "24時間以内", safety: "保証", noReviews: "なし", recommended: "推奨", replyFromMaster: "返信" }
    },
    merchant: {
      verified: "認証", background: "背景", portfolio: "事例", reviewTitle: "レビュー", realReviews: "件", verifiedBooking: "認証済", pricingAnalysis: "ハイライト", bookingChannel: "予約", viewServices: "一覧", guarantee: "保証", fastResponse: "迅速", contactExpert: "相談", noReviews: "なし", reply: "返信"
    },
    home: {
      hero: { badge: "英国で最も信頼されている市場", title1: "地元の専門家を予約", title2: "今すぐ。", subtitle: "車の修理からリフォームまで。", searchPlaceholder: "サービスを検索", locationPlaceholder: "都市または郵便番号", aiMatch: "AIマッチ", searchBtn: "検索" },
      recommendation: { title1: "スマート推薦", title2: "AI Discovery", subtitle: "ニーズに合わせてマッチング", browse: "今すぐ見る" },
      aiCTA: {
        badge: "新機能：AI診断",
        title1: "修理が必要ですか？",
        title2: "AIで即座に状況を診断。",
        subtitle: "問題を写真でアップロードするだけで、AIが原因を特定し、数秒で修理費用の目安を提示します。",
        button: "無料AI診断を試す"
      },
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
    location: { selectCity: "都市を選択", detecting: "検出中...", switch: "切換", nearby: "近隣のサービス" },
    diagnosis: {
      badge: "GEMINI AI 搭載",
      title1: "プロの診断",
      title2: "数秒で解決",
      subtitle: "推測はやめましょう。AIが写真を分析し、予約前に修理の範囲と適正な費用目安を提示します。",
      features: {
        instant: { title: "即座の分析", desc: "折り返しを待つ必要はありません。アップロード直後に技術的な分析結果を確認できます。" },
        pricing: { title: "適正な市場価格", desc: "英国のリアルタイムデータを使用し、お住まいの地域に合わせた正確な価格帯を提示します。" },
        verified: { title: "認定された予約", desc: "診断後、その問題の専門家である認定エキスパートとすぐに繋がれます。" }
      },
      cta: "すべてのサービスを見る",
      tool: {
        title: "AI即時診断",
        subtitle: "写真をアップロードして修理費用と範囲を予測します。",
        step1: "1. 写真をアップロード",
        step2: "2. カテゴリを選択",
        step3: "3. 状況を説明（任意）",
        uploadHint: "写真を撮るかアップロード",
        replaceHint: "写真をクリックして変更",
        submit: "AI診断を実行",
        loading: "診断結果を生成中...",
        disclaimer: "AIによる予測は目安です。正式な見積もりは専門家が行います。",
        newDiagnosis: "新しい診断",
        categories: {
          plumbing: "配管・暖房",
          auto: "自動車修理",
          renovation: "住宅リフォーム",
          electrical: "電気工事",
          cleaning: "プロの清掃"
        },
        resultTitle: "AI 修理のインサイト",
        detectedIssue: "検出された問題",
        recommendedSolution: "推奨される解決策",
        estimatedCostLabel: "推定費用",
        ukStandard: "英国サービス基準",
        includesLabor: "工賃と部品代を含む",
        bookSpecialist: "認定スペシャリストを予約",
        confidence: "信頼度",
        analyzedPhoto: "分析された写真",
        guaranteedRepairs: "修理保証",
        disputeResolution: "すべての予約には、安心のための AI 駆動の紛争解決が含まれています。",
        fastTurnaround: "迅速な対応",
        responseHours: "ほとんどの {category} スペシャリストは 2 時間以内に返信します。",
        errorPhotoCategory: "写真をアップロードし、カテゴリを選択してください。",
        errorUnexpected: "予期しないエラーが発生しました：",
        uploadFormatHint: "高品質な JPG, PNG (最大 5MB) をサポート",
        descriptionPlaceholder: "例：キッチンの蛇口が昨日の朝から水漏れしています..."
      }
    },
    onboarding: {
      hero: { title: "ServiceHubでビジネスを拡大しましょう", subtitle: "教育、会計、修理などの分野で英国をリードする専門家向けマーケットプレイスに参加してください。" },
      steps: { profile: "ビジネスプロフィール", credentials: "資格証明", contract: "契約書の確認" },
      sectors: {
        title: "専門分野の選択",
        professional: { title: "専門サービス", desc: "複雑な書類作成やアドバイスを行う認定専門家向け。", industries: ["会計", "法務", "財務アドバイス"] },
        education: { title: "教育・講師", desc: "教師、スキル疑トレーナー、学術メンター向け。", industries: ["語学講師", "試験対策", "スキル・トレーニング"] },
        technical: { title: "技術・メンテナンス", desc: "熟練した職人や不可欠な家庭・自動車サービス向け。", industries: ["配管", "電気", "自動車修理", "リフォーム"] }
      },
      contract: {
        title: "専門家サービス契約",
        scrollingNotice: "同意を確認するため、契約書の最後までスクロールしてください。",
        agree: "専門家サービス契約を読み、同意します",
        clauses: {
          commission: { title: "1. プラットフォーム利用料と成長支援インセンティブ", body: "ServiceHubでは、成約時に競争力のある8%のプラットフォーム利用料を適用しています。皆様のビジネス成長を支援するため、最初の5件の注文については、100%手数料無料（0%）とさせていただきます。手数料は最終的な支払いから自動的に差し引かれます。" },
          service: { title: "2. サービス品質と英国コンプライアンス", body: "パートナーは活動を継続するために、最低評価4.2を維持し、問い合わせには24時間以内に回答する必要があります。また、ご自身の職種に関連する有効な英国のライセンスと保険を保持していることを保証するものとします。" },
          disputes: { title: "3. AI仲裁とスマートマッチングによる紛争解決", body: "当社独自のAI仲裁者が、迅速かつ公平な解決策を提供します。AIスマートマッチング技術を通じて、最も正確な地元の即時予約注文を確実に受け取れるようにします。" }
        }
      },
      buttons: { start: "始める", next: "次へ", back: "戻る", submit: "署名して参加" }
    }
  },
  ko: {
    nav: { browse: "서비스 찾기", join: "가입", login: "로그인", logout: "종료", dashboard: "대시보드", aiDiagnosis: "AI 진단" },
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
    footer: { tagline: "전문가", explore: "탐색", legal: "법률", support: "지원", rights: "모든 권리 보유。", terms: "약관", privacy: "개인정보", cookies: "쿠키", help: "센터", contact: "문의", aiDiagnosis: "AI 진단", homeCleaning: "가정 청소", plumbingServices: "배관 서비스", automotiveServices: "자동차 서비스" },
    search: { filters: "필터", keyword: "단어", location: "위치", category: "범주", minRating: "평점", verifiedOnly: "인증", apply: "적용", sortBy: "정렬", sortRating: "평점", sortJobs: "완료", sortDistance: "거리", sortPrice: "가격", foundCount: "명", searching: "검색중...", noResults: "없음", clearFilters: "초기화", basePrice: "부터", viewDetails: "상세", listView: "목록 보기", mapView: "지도 보기", searchThisArea: "이 지역에서 검색" },
    booking: {
      steps: { details: "상세", schedule: "일정", confirmation: "검토" },
      titles: { details: "정보입력", schedule: "시간선택", confirm: "확인", success: "확정!" },
      labels: { date: "날짜", time: "시간", make: "브랜드", model: "모델", address: "주소", notes: "비고", agree: "동의", summary: "요약", paid: "결제", merchant: "업체", service: "서비스" },
      buttons: { next: "다음", prev: "이전", pay: "예약", home: "홈", dashboard: "보기" },
      messages: { finalizing: "확정중...", wait: "대기", contact24h: "24시간", safety: "보장", noReviews: "없음", recommended: "추천", replyFromMaster: "답글" }
    },
    merchant: {
      verified: "인증", background: "배경", portfolio: "사례", reviewTitle: "리뷰", realReviews: "개", verifiedBooking: "인증", pricingAnalysis: "특징", bookingChannel: "채널", viewServices: "보기", guarantee: "보증", fastResponse: "응답", contactExpert: "문의", noReviews: "없음", reply: "답변"
    },
    home: {
      hero: { badge: "영국 최고의 서비스 마켓", title1: "현지 전문가 예약", title2: "순식간에.", subtitle: "자동차 수리부터 리모델링까지.", searchPlaceholder: "서비스 검색", locationPlaceholder: "도시 또는 우편번호", aiMatch: "AI 매칭", searchBtn: "검색" },
      recommendation: { title1: "스마트 추천", title2: "AI Discovery", subtitle: "자산 및 니즈에 따른 매칭", browse: "지금 보기" },
      aiCTA: {
        badge: "신규: AI 기반",
        title1: "수리가 필요하신가요?",
        title2: "즉각적인 AI 진단.",
        subtitle: "사진을 업로드하면 AI가 문제를 식별하고 몇 초 안에 예상 수리 비용을 알려드립니다.",
        button: "무료 AI 진단 시작"
      },
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
    location: { selectCity: "도시 선택", detecting: "감지 중...", switch: "변경", nearby: "주변 서비스" },
    diagnosis: {
      badge: "GEMINI AI 기반",
      title1: "전문적인 수리",
      title2: "수 초 내에 진단",
      subtitle: "더 이상 추측하지 마세요. AI가 사진을 분석하여 예약 전에 수리 범위와 공정한 가격 범위를 즉시 제공합니다.",
      features: {
        instant: { title: "즉각적인 분석", desc: "콜백을 기다릴 필요가 없습니다. 업로드 직후 기술 분석 결과를 확인하세요." },
        pricing: { title: "공정한 시장 가격", desc: "영국 내 실시간 서비스 데이터를 사용하여 지역별 정확한 가격 범위를 제시합니다." },
        verified: { title: "인증된 예약", desc: "진단 후, 해당 문제의 전문가인 영국 상위 1% 전문가와 즉시 연결됩니다." }
      },
      cta: "모든 서비스 보기",
      tool: {
        title: "즉석 AI 진단",
        subtitle: "사진을 업로드하여 수리 비용과 범위를 진단해보세요.",
        step1: "1. 사진 업로드",
        step2: "2. 카테고리 선택",
        step3: "3. 문제 설명 (선택 사항)",
        uploadHint: "사진 촬영 또는 업로드",
        replaceHint: "사진 교체하려면 클릭",
        submit: "무료 AI 진단 생성",
        loading: "AI 분석 생성 중...",
        disclaimer: "AI 예측은 참고용입니다. 공식 견적은 전문가가 제공합니다.",
        newDiagnosis: "새로운 진단",
        categories: {
          plumbing: "배관 및 난방",
          auto: "자동차 수리",
          renovation: "주택 리모델링",
          electrical: "전기 공사",
          cleaning: "전문 청소"
        },
        resultTitle: "AI 수리 인사이트",
        detectedIssue: "감지된 문제",
        recommendedSolution: "권장 해결책",
        estimatedCostLabel: "예상 비용",
        ukStandard: "영국 서비스 표준",
        includesLabor: "인건비 및 부품 포함",
        bookSpecialist: "인증된 전문가 예약",
        confidence: "신뢰도",
        analyzedPhoto: "분석된 사진",
        guaranteedRepairs: "수리 보장",
        disputeResolution: "모든 예약에는 안심할 수 있는 AI 기반 분쟁 해결이 포함되어 있습니다.",
        fastTurnaround: "빠른 처리",
        responseHours: "대부분의 {category} 전문가는 2시간 이내에 응답합니다.",
        errorPhotoCategory: "사진을 업로드하고 카테고리를 선택하세요.",
        errorUnexpected: "예기치 않은 오류가 발생했습니다: ",
        uploadFormatHint: "고화질 JPG, PNG(최대 5MB) 지원",
        descriptionPlaceholder: "예: 어제 아침부터 싱크대에서 물이 샙니다..."
      }
    },
    onboarding: {
      hero: { title: "ServiceHub과 함께 비즈니스를 성장시키세요", subtitle: "영국 최고의 전문가 마켓플레이스인 교육, 회계, 수리 등에 참여하세요." },
      steps: { profile: "비즈니스 프로필", credentials: "자격 증명", contract: "계약서 검토" },
      sectors: {
        title: "전문 분야 선택",
        professional: { title: "전문 서비스", desc: "복잡한 문서 및 자문 전문가용.", industries: ["회계", "법률", "금융 자문"] },
        education: { title: "교육 및 튜터", desc: "교사, 기술 트레이너 및 학문적 멘토용.", industries: ["언어 튜터", "시험 준비", "기술 교육"] },
        technical: { title: "기술 및 유지보수", desc: "숙련된 기술자 및 필수 가정/자동차 서비스용.", industries: ["배관", "전기", "자동차 수리", "리모델링"] }
      },
      contract: {
        title: "전문가 서비스 약관",
        scrollingNotice: "동의를 확인하려면 약관의 맨 아래로 스크롤하십시오.",
        agree: "전문가 서비스 약관을 읽었으며 이에 동의합니다",
        clauses: {
          commission: { title: "1. 플랫폼 서비스 수수료 및 성장 인센티브", body: "ServiceHub은 예약 성공 시 경쟁력 있는 8%의 플랫폼 이용료를 적용합니다. 귀하의 비즈니스 성장을 지원하기 위해 처음 5개의 주문에 대해서는 수수료가 100% 면제됩니다. 수수료는 최종 지급액에서 자동으로 차감됩니다." },
          service: { title: "2. 서비스 우수성 및 영국 규정 준수", body: "파트너는 4.2점 이상의 최소 평점을 유지하고 24시간 이내에 문의에 응답해야 합니다. 귀하는 해당 업종과 관련된 모든 유효한 영국 라이선스 및 보험을 보유하고 있음을 인증해야 합니다." },
          disputes: { title: "3. AI 기반 분쟁 해결 및 스마트 매칭", body: "당사의 독점적인 AI 중재자가 즉각적이고 공정한 해결책을 제공합니다. AI 스마트 매칭 기술을 통해 가장 정확한 현지 실시간 예약 주문을 받을 수 있습니다." }
        }
      },
      buttons: { start: "시작하기", next: "계속하기", back: "뒤로 가기", submit: "서명 및 가입" }
    }
  },
  pl: {
    nav: { browse: "Przeglądaj usługi", join: "Dołącz jako ekspert", login: "Logowanie", logout: "Wyloguj", dashboard: "Panel", aiDiagnosis: "Diagnoza AI" },
    hero: { title: "Jak możemy Ci pomóc?", subtitle: "Przeszukaj FAQ lub uzyskaj natychmiastowe wsparcie od asystenta Aura AI.", searchPlaceholder: "Szukaj zwrotów, sporów...", badge: "Centrum pomocy" },
    faq: { 
      title: "Inteligentne FAQ", subtitle: "Oficjalne odpowiedzi na temat płatności i sporów.", categories: { payments: "Płatności", disputes: "Spory", bookings: "Rezerwacje" }, 
      aura: { title: "Potrzebujesz pomocy?", subtitle: "Aura AI zapewnia indywidualne doradztwo.", cta: "Rozpocznij czat" },
      questions: {
        payments: [{ q: "Karta kredytowa?", a: "Tak, obsługujemy wszystkie karty." }, { q: "Refundacja?", a: "Złóż wniosek w 24h." }],
        disputes: [{ q: "Ekspert się nie pojawił?", a: "Zgłoś to na stronie zamówienia." }, { q: "Dodatkowe koszty?", a: "Nie są obowiązkowe bez Twojej zgody." }],
        bookings: [{ q: "Zmiana terminu?", a: "Darmowa do 48h przed." }]
      }
    },
    footer: { tagline: "Platforma usługowa premium w Wielkiej Brytanii, łącząca Cię z lokalnymi ekspertami.", explore: "Eksploruj usługi", legal: "Zgodność prawna", support: "Wsparcie klienta", rights: "Wszelkie prawa zastrzeżone.", terms: "Regulamin", privacy: "Prywatność", cookies: "Cookies", help: "Centrum pomocy", contact: "Kontakt", aiDiagnosis: "Diagnoza AI", homeCleaning: "Sprzątanie domu", plumbingServices: "Usługi hydrauliczne", automotiveServices: "Usługi motoryzacyjne" },
    search: { filters: "Filtry", keyword: "Słowo kluczowe", location: "Lokalizacja", category: "Kategoria", minRating: "Min. ocena", verifiedOnly: "Tylko zweryfikowani", apply: "Zastosuj", sortBy: "Sortuj według", sortRating: "Ocena", sortJobs: "Wykonane prace", sortDistance: "Dystans", sortPrice: "Cena: rosnąco", foundCount: "znalezionych ekspertów", searching: "Szukanie...", noResults: "Nie znaleziono wykonawców", clearFilters: "Wyczyść filtry", basePrice: "Od", viewDetails: "Szczegóły", listView: "Lista", mapView: "Mapa", searchThisArea: "Szukaj w tym obszarze" },
    booking: {
      steps: { details: "Szczegóły", schedule: "Harmonogram", confirmation: "Przegląd" },
      titles: { details: "Dane rezerwacji", schedule: "Wybierz termin", confirm: "Potwierdź i zapłać", success: "Rezerwacja potwierdzona!" },
      labels: { date: "Wybierz datę", time: "Wybierz czas", make: "Marka", model: "Model", address: "Adres", notes: "Uwagi", agree: "Zgadzam się na regulamin", summary: "Podsumowanie", paid: "Zapłacono", merchant: "Wykonawca", service: "Usługa" },
      buttons: { next: "Dalej", prev: "Wstecz", pay: "Zarezerwuj teraz", home: "Powrót", dashboard: "Moje rezerwacje" },
      messages: { finalizing: "Finalizacja...", wait: "Proszę czekać.", contact24h: "Ekspert skontaktuje się w ciągu 24h.", safety: "Gwarancja bezpiecznych płatności", noReviews: "Brak recenzji.", recommended: "Polecane", replyFromMaster: "Odpowiedź eksperta" }
    },
    merchant: {
      verified: "Zweryfikowany", background: "Doświadczenie", portfolio: "Portfolio", reviewTitle: "Opinie klientów", realReviews: "Prawdziwe opinie", verifiedBooking: "Zweryfikowana rezerwacja", pricingAnalysis: "Najważniejsze cechy", bookingChannel: "Szybka rezerwacja", viewServices: "Zobacz usługi", guarantee: "Gwarancja platformy", fastResponse: "Szybka odpowiedź", contactExpert: "Zapytaj eksperta", noReviews: "Brak opinii", reply: "Odpowiedź"
    },
    home: {
      hero: { badge: "Najbardziej zaufany rynek usług w UK", title1: "Znajdź i zarezerwuj ekspertów", title2: "W kilka sekund.", subtitle: "Od naprawy samochodów po remonty domów.", searchPlaceholder: "Jakiej usługi potrzebujesz?", locationPlaceholder: "Miasto lub kod pocztowy", aiMatch: "Dopasowanie AI", searchBtn: "Szukaj" },
      recommendation: { title1: "Smart Rekomendacje", title2: "Odkrywanie AI", subtitle: "Precyzyjne dopasowanie usług", browse: "Przeglądaj" },
      aiCTA: {
        badge: "NOWOŚĆ: AI",
        title1: "Potrzebujesz naprawy?",
        title2: "Zdobądź natychmiastową diagnozę AI.",
        subtitle: "Wgraj zdjęcie, a nasza AI zidentyfikuje problem i poda szacunkowy koszt naprawy w kilka sekund.",
        button: "Wypróbuj bezpłatną diagnozę"
      },
      categories: { plumbing: "Hydraulika", repairs: "Naprawy", renovation: "Remonty", education: "Edukacja", accounting: "Księgowość", legal: "Prawo", commercial: "Komercyjne", cleaning: "Sprzątanie", car: "Samochody" },
      sections: {
        plumbing: { title: "Hydraulika i elektryka", desc: "Zweryfikowani eksperci.", items: ["Naprawa rur", "Okablowanie", "Instalacje", "Serwis bojlerów", "Włączniki", "Smart Home"] },
        repairs: { title: "Złota rączka", desc: "Do prac domowych.", items: ["Montaż mebli", "Okna/Drzwi", "Łatanie ścian", "Półki", "Malowanie", "Drobne naprawy"] },
        accounting: { title: "Księgowość i podatki", desc: "Zgodność z HMRC.", items: ["Zwrot podatku", "Księgowość", "VAT", "Lista płac", "Konsultacje", "Analiza R&D"] },
        renovation: { title: "Renowacja domów", desc: "Gwarancja jakości.", items: ["Kuchnia/Łازienka", "Rozbudowa", "Projektowanie", "Malowanie", "Podłogi", "Ogród"] },
        education: { title: "Edukacja i nauka", desc: "Korepetycje i szkolenia.", items: ["Języki obce", "IELTS/TOEFL", "Programowanie", "Sztuka", "Biznes", "Pomoc akademicka"] },
        cleaning: { title: "Sprzątanie", desc: "Profesjonalne usługi.", items: ["Domowe", "Koniec najmu", "Dywanów", "Okien", "Biur", "Dezynfekcja"] },
        legal: { title: "Porady prawne", desc: "Certyfikowani eksperci.", items: ["Kontrakty", "Wizy", "Nieruchomości", "Spory", "Prawo handlowe", "Notariusz"] },
        commercial: { title: "Usługi komercyjne", desc: "Dla firm.", items: ["Projektowanie", "Przeprowadzki", "Elektryka", "Bezpieczeństwo", "IT", "HVAC"] }
      },
      popularTitle: "Popularne projekty", popularIn: "w", allUK: "Cała UK",
      noProjects: { title: "Nie znaleziono projektów", desc: "Dodajemy nowych ekspertów." },
      reviews: { excellent: "Doskonale", basedOn: "Na podstawie", verified: "Zweryfikowane" }
    },
    location: { selectCity: "Wybierz miasto", detecting: "Wykrywanie...", switch: "Przełącz", nearby: "Usługi w pobliżu" },
    diagnosis: {
      badge: "NAPĘDZANE PRZEZ GEMINI AI",
      title1: "Profesjonalne Naprawy",
      title2: "Zdiagnozowane w sekundy",
      subtitle: "Przestań zgadywać. Nasza AI analizuje zdjęcia, dostarczając natychmiastowe informacje i szacunkowe koszty przed rezerwacją.",
      features: {
        instant: { title: "Szybka Analiza", desc: "Nie czekaj na oddzwonienie. Otrzymaj techniczny opis problemu zaraz po wgraniu zdjęcia." },
        pricing: { title: "Uczciwe Ceny", desc: "Używamy danych rynkowych z UK, aby podać dokładny zakres cenowy dla Twojego regionu." },
        verified: { title: "Pewna Rezerwacja", desc: "Po diagnozie połącz się z najlepszymi ekspertami specjalizującymi się w Twoim problemie." }
      },
      cta: "Przeglądaj usługi",
      tool: {
        title: "Natychmiastowa Diagnoza AI",
        subtitle: "Wgraj zdjęcie, aby AI oszacowało koszt i zakres naprawy.",
        step1: "1. Wgraj zdjęcie",
        step2: "2. Wybierz kategorię",
        step3: "3. Opisz problem (opcjonalnie)",
        uploadHint: "Zrób zdjęcie lub wgraj",
        replaceHint: "Kliknij, aby zmienić zdjęcie",
        submit: "Generuj Diagnozę AI",
        loading: "Generowanie analizy...",
        disclaimer: "Szacunki AI są orientacyjne. Oficjalne wyceny są dostarczane przez specjalistów.",
        newDiagnosis: "Nowa Diagnoza",
        categories: {
          plumbing: "Hydraulika i ogrzewanie",
          auto: "Naprawa samochodów",
          renovation: "Remonty domów",
          electrical: "Prace elektryczne",
          cleaning: "Profesjonalne sprzątanie"
        },
        resultTitle: "Analiza naprawy AI",
        detectedIssue: "Wykryty problem",
        recommendedSolution: "Zalecane rozwiązanie",
        estimatedCostLabel: "Szacowany koszt",
        ukStandard: "Standard usług UK",
        includesLabor: "Obejmuje robociznę i części",
        bookSpecialist: "Zarezerwuj zweryfikowanego specjalistę",
        confidence: "Pewność",
        analyzedPhoto: "Przeanalizowane zdjęcie",
        guaranteedRepairs: "Gwarantowane naprawy",
        disputeResolution: "Wszystkie rezerwacje obejmują nasze rozwiązanie sporów oparte na AI dla Twojego spokoju.",
        fastTurnaround: "Szybki czas realizacji",
        responseHours: "Większość specjalistów {category} odpowiada w ciągu 2 godzin.",
        errorPhotoCategory: "Proszę przesłać zdjęcie i wybrać kategorię.",
        errorUnexpected: "Wystąpił nieoczekiwany błąd: ",
        uploadFormatHint: "Obsługuje wysokiej jakości JPG, PNG (Max 5MB)",
        descriptionPlaceholder: "np. Mój zlew w kuchni przecieka od wczoraj rana..."
      }
    },
    onboarding: {
      hero: { title: "Rozwijaj swój biznes z ServiceHub", subtitle: "Dołącz do wiodącej platformy w Wielkiej Brytanii dla specjalistów z branży edukacji, księgowości, napraw i innych." },
      steps: { profile: "Profil Firmy", credentials: "Poświadczenia", contract: "Przegląd Umowy" },
      sectors: {
        title: "Wybierz swoją branżę",
        professional: { title: "Usługi Profesjonalne", desc: "Dla certyfikowanych ekspertów zajmujących się dokumentacją i doradztwem.", industries: ["Księgowość", "Prawo", "Doradztwo Finansowe"] },
        education: { title: "Edukacja i Korepetycje", desc: "Dla nauczycieli, trenerów umiejętności i mentorów akademickich.", industries: ["Lektorzy Języków", "Przygotowanie do Egzaminów", "Trening Umiejętności"] },
        technical: { title: "Techniczne i Konserwacja", desc: "Dla wykwalifikowanych rzemieślników i usług domowych/samochodowych.", industries: ["Hydraulika", "Elektryka", "Naprawa Aut", "Renowacja"] }
      },
      contract: {
        title: "Umowa o świadczenie usług eksperckich",
        scrollingNotice: "Przewiń do dołu umowy, aby potwierdzić akceptację.",
        agree: "Przeczytałem i zgadzam się na Umowę o świadczenie usług eksperckich",
        clauses: {
          commission: { title: "1. Opłaty serwisowe i zachęty do wzrostu", body: "ServiceHub stosuje konkurencyjną opłatę za dostęp do platformy w wysokości 8% od udanych rezerwacji. Aby wspierać rozwój Twojego biznesu, Twoje pierwsze 5 zamówień jest w 100% wolne od prowizji. Opłaty są automatycznie potrącane z ostatecznej wypłaty." },
          service: { title: "2. Doskonałość usług i zgodność z przepisami UK", body: "Partnerzy muszą utrzymywać minimalną ocenę 4,2 i odpowiadać na zapytania w ciągu 24 godzin. Potwierdzasz, że posiadasz wszystkie ważne licencje i ubezpieczenia w Wielkiej Brytanii odpowiednie dla Twojego zawodu." },
          disputes: { title: "3. Rozstrzyganie sporów wspomagane przez AI i inteligentne dopasowanie", body: "Nasz autorski arbiter AI zapewnia natychmiastowe i bezstronne rozstrzygnięcie. Dzięki technologii AI Smart Matching zapewniamy otrzymywanie najdokładniejszych lokalnych zamówień natychmiastowych." }
        }
      },
      buttons: { start: "Zacznij teraz", next: "Kontynuuj", back: "Wróć", submit: "Podpisz i dołącz" }
    }
  },
  ro: {
    nav: { browse: "Răsfoiește Servicii", join: "Alătură-te ca Expert", login: "Autentificare", logout: "Deconectare", dashboard: "Panou de Control", aiDiagnosis: "Diagnostic AI" },
    hero: { title: "Cum vă putem ajuta?", subtitle: "Căutați în FAQ sau obțineți suport instant de la asistentul Aura AI.", searchPlaceholder: "Căutare rambursări, dispute...", badge: "Centru de Ajutor" },
    faq: { 
      title: "Smart FAQ", subtitle: "Răspunsuri oficiale despre plăți și dispute.", categories: { payments: "Plăți", disputes: "Dispute", bookings: "Rezervări" }, 
      aura: { title: "Aveți nevoie de ajutor?", subtitle: "Aura AI oferă consultanță 1-la-1.", cta: "Chat Acum" },
      questions: {
        payments: [{ q: "Pot plăti cu cardul?", a: "Da, acceptăm toate cardurile majore." }, { q: "Cum aplic pentru rambursare?", a: "Puteți aplica prin sistem în 24h." }],
        disputes: [{ q: "Expertul nu a venit?", a: "Solicitați rambursarea pe pagina comenzii." }, { q: "Costuri suplimentare?", a: "Nu sunt obligatorii fără confirmarea dvs." }],
        bookings: [{ q: "Cum reprogramez?", a: "Gratuit cu 48h înainte." }]
      }
    },
    footer: { tagline: "Platformă premium de servicii în UK, conectându-vă cu experți locali verificați.", explore: "Explorați Servicii", legal: "Legal și Conformitate", support: "Suport Clienți", rights: "Toate drepturile rezervate.", terms: "Termeni", privacy: "Confidențialitate", cookies: "Cookie-uri", help: "Ajutor", contact: "Contact", aiDiagnosis: "Diagnostic AI", homeCleaning: "Curățenie Casă", plumbingServices: "Servicii Instalații", automotiveServices: "Servicii Auto" },
    search: { filters: "Filtre", keyword: "Cuvânt cheie", location: "Locație", category: "Categorie", minRating: "Rating minim", verifiedOnly: "Doar verificați", apply: "Aplică", sortBy: "Sortează după", sortRating: "Rating", sortJobs: "Lucrări", sortDistance: "Distanță", sortPrice: "Preț: mic la mare", foundCount: "experți găsiți", searching: "Căutare...", noResults: "Nu s-au găsit comercianți", clearFilters: "Șterge filtrele", basePrice: "De la", viewDetails: "Detalii", listView: "Listă", mapView: "Hartă", searchThisArea: "Caută în această zonă" },
    booking: {
      steps: { details: "Detalii", schedule: "Programare", confirmation: "Revizuire" },
      titles: { details: "Detalii Rezervare", schedule: "Programați Vizita", confirm: "Confirmă și Plătește", success: "Rezervare Confirmată!" },
      labels: { date: "Selectați Data", time: "Selectați Ora", make: "Marcă", model: "Model", address: "Adresă", notes: "Note", agree: "Sunt de acord cu Termenii Service-ului", summary: "Sumar Rezervare", paid: "Plătit", merchant: "Comerciant", service: "Serviciu" },
      buttons: { next: "Pasul Următor", prev: "Înapoi", pay: "Rezervă Acum", home: "Acasă", dashboard: "Rezervările mele" },
      messages: { finalizing: "Finalizare...", wait: "Vă rugăm așteptați.", contact24h: "Expertul vă va contacta în 24h.", safety: "Plată Securizată", noReviews: "Nicio recenzie.", recommended: "Recomandat", replyFromMaster: "Răspuns expert" }
    },
    merchant: {
      verified: "Verificat", background: "Experiență", portfolio: "Portofoliu", reviewTitle: "Recenzii Clienți", realReviews: "feedback real", verifiedBooking: "Rezervare Verificată", pricingAnalysis: "Analiza Prețului", bookingChannel: "Canal de Rezervare Rapidă", viewServices: "Vezi Servicii", guarantee: "Garanția Platformei", fastResponse: "Răspuns Rapid", contactExpert: "Întreabă Expertul", noReviews: "Fără recenzii detaliate", reply: "Răspuns Oficial"
    },
    home: {
      hero: { badge: "Cea mai de încredere piață de servicii din UK", title1: "Găsește și Rezervă Experți", title2: "În Secunde.", subtitle: "De la reparații auto de urgență la renovări - profesioniști verificați.", searchPlaceholder: "Ce serviciu aveți nevoie?", locationPlaceholder: "Oraș sau Cod Poștal", aiMatch: "Potrivire AI", searchBtn: "Căutare" },
      recommendation: { title1: "Recomandări Smart", title2: "Descoperire AI", subtitle: "Potrivire precisă a serviciilor", browse: "Răsfoiește Acum" },
      aiCTA: { badge: "NOU: AI POWERED", title1: "Aveți o Reparație?", title2: "Obțineți un Diagnostic Instant.", subtitle: "Încărcați o fotografie și AI-ul nostru va identifica problema și vă va oferi o estimare de preț în secunde.", button: "Încearcă Diagnostic AI Gratuit" },
      categories: { plumbing: "Instalații", repairs: "Reparații", renovation: "Renovări", education: "Educație", accounting: "Contabilitate", legal: "Legal", commercial: "Comercial", cleaning: "Curățenie", car: "Auto" },
      sections: {
        plumbing: { title: "Instalații și Electricitate", desc: "Experți certificați în UK.", items: ["Reparații Tevi", "Cablare", "Instalare", "Service Boiler", "Întrerupătoare", "Smart Home"] },
        repairs: { title: "Reparații Casnice", desc: "Soluție completă pentru casă.", items: ["Asamblare", "Uși/Ferestre", "Reparații Pereți", "Rafturi", "Vopsire", "Diverse"] },
        accounting: { title: "Contabilitate și Taxe", desc: "Pentru IMM-uri și rezidenți.", items: ["Declarație Taxe", "Conturi Anuale", "TVA", "Salarizare", "Consultanță Xero", "Analiza R&D"] },
        renovation: { title: "Renovare Casă", desc: "Garanție de calitate.", items: ["Bucătărie/Baie", "Extensie", "Design Interior", "Vopsire", "Pardoseală", "Peisagistică"] },
        education: { title: "Educație și Învățare", desc: "Tutori de limbi străine și cursuri.", items: ["Tutori Limbi", "IELTS/TOEFL", "Programare", "Muzică", "Business", "Ajutor Academic"] },
        cleaning: { title: "Curățenie Generală", desc: "Servicii profesionale.", items: ["Curățenie Casă", "Sfârșit Contract", "Covoare", "Ferestre", "Birou", "Dezinfectare"] },
        legal: { title: "Consultanță Legală", desc: "Experți certificați.", items: ["Contracte", "Vize", "Drept Proprietate", "Dispute", "Drept Comercial", "Notar"] },
        commercial: { title: "Servicii Comerciale", desc: "Pentru spații de afaceri.", items: ["Design Magazin", "Mutare Birou", "Electricitate Com", "Siguranță Foc", "IT/Rețea", "HVAC"] }
      },
      popularTitle: "Proiecte Populare", popularIn: "în", allUK: "Toată UK",
      noProjects: { title: "Nu s-au găsit proiecte", desc: "Înregistrăm noi experți acum." },
      reviews: { excellent: "Excelent", basedOn: "Bazat pe", verified: "Verificat" }
    },
    location: { selectCity: "Selectați Orașul", detecting: "Detectare...", switch: "Schimbă", nearby: "În Apropiere" },
    diagnosis: {
      badge: "POWERED BY GEMINI AI",
      title1: "Reparații Profesionale",
      title2: "Identificate în Secunde",
      subtitle: "AI-ul nostru analizează fotografiile pentru a oferi estimări corecte de preț înainte de a rezerva.",
      features: {
        instant: { title: "Analiză Instant", desc: "Obțineți o descriere tehnică imediat după încărcare." },
        pricing: { title: "Preț Corect", desc: "Folosim date în timp real din UK pentru estimări precise." },
        verified: { title: "Rezervare Verificată", desc: "Conectați-vă cu experți specializați pe problema dvs." }
      },
      cta: "Vezi Toate Serviciile",
      tool: {
        title: "Diagnostic Instant AI",
        subtitle: "Încarcă o poză și lasă AI-ul să estimeze costul.",
        step1: "1. Încarcă Poza",
        step2: "2. Selectează Categoria",
        step3: "3. Descrie problema (Opțional)",
        uploadHint: "Fă o poză sau încarcă",
        replaceHint: "Click pentru a înlocui poza",
        submit: "Generează Diagnostic AI Gratuit",
        loading: "Se generează analiza AI...",
        disclaimer: "Estimările AI sunt orientative. Ofertele oficiale sunt oferite de specialiști.",
        newDiagnosis: "Diagnostic Nou",
        categories: { plumbing: "Instalații", auto: "Reparații Auto", renovation: "Renovări", electrical: "Electricitate", cleaning: "Curățenie" },
        resultTitle: "Analiza de Reparație AI",
        detectedIssue: "Problema Detectată",
        recommendedSolution: "Soluție Recomandată",
        estimatedCostLabel: "Cost Estimat",
        ukStandard: "Standard Servicii UK",
        includesLabor: "Include Manoperă și Piese",
        bookSpecialist: "Rezervă Specialist Verificat",
        confidence: "Încredere",
        analyzedPhoto: "Poză Analizată",
        guaranteedRepairs: "Reparații Garantate",
        disputeResolution: "Toate rezervările includ rezolvarea disputelor prin AI.",
        fastTurnaround: "Răspuns Rapid",
        responseHours: "Majoritatea specialiștilor în {category} răspund în 2 ore.",
        errorPhotoCategory: "Vă rugăm să încărcați o fotografie și să selectați o categorie.",
        errorUnexpected: "A apărut o eroare neașteptată: ",
        uploadFormatHint: "Suportă JPG, PNG de înaltă calitate (Max 5MB)",
        descriptionPlaceholder: "ex: Chiuveta mea de bucătărie picură de ieri dimineață..."
      }
    },
    onboarding: {
      hero: { title: "Dezvoltă-ți afacerea cu ServiceHub", subtitle: "Alătură-te principalei piețe din Marea Britanie pentru profesioniști în educație, contabilitate, reparații și multe altele." },
      steps: { profile: "Profil Afacere", credentials: "Calificări", contract: "Revizuire Contract" },
      sectors: {
        title: "Alegeți specializarea",
        professional: { title: "Servicii Profesionale", desc: "Pentru experți certificați care se ocupă de documentație complexă și consultanță.", industries: ["Contabilitate", "Legal", "Consultanță Financiară"] },
        education: { title: "Educație și Tutori", desc: "Pentru profesori, instructori de abilități și mentori academici.", industries: ["Tutori Limbi", "Pregătire Examene", "Instruire Abilități"] },
        technical: { title: "Tehnic și Întreținere", desc: "For profesioniști calificați și servicii esențiale pentru casă/mașină.", industries: ["Instalații", "Electricitate", "Reparații Auto", "Renovare"] }
      },
      contract: {
        title: "Acord de Servicii pentru Experți",
        scrollingNotice: "Vă rugăm să derulați până la sfârșitul acordului pentru a confirma acceptarea.",
        agree: "Am citit și sunt de acord cu Acordul de Servicii pentru Experți",
        clauses: {
          commission: { title: "1. Taxă de acces la platformă și stimulente de creștere", body: "ServiceHub aplică o taxă de acces la platformă competitivă de 8% pentru rezervările reușite. Pentru a sprijini creșterea afacerii tale, primele 5 comenzi sunt 100% fără comision. Taxele sunt deduse automat din plata finală." },
          service: { title: "2. Excelență în servicii și conformitate cu reglementările UK", body: "Partenerii trebuie să mențină un rating minim de 4.2 și să răspundă la solicitări în termen de 24 de ore. Certifici că deții toate licențele și asigurările valabile în Regatul Unit relevante pentru profesia ta." },
          disputes: { title: "3. Rezolvarea disputelor prin AI și potrivire inteligentă", body: "Arbitrul nostru AI proprietar oferă o rezoluție instantanee și imparțială. Prin tehnologia AI Smart Matching, ne asigurăm că primești cele mai precise comenzi de rezervare instantanee la nivel local." }
        }
      },
      buttons: { start: "Începe acum", next: "Continuă", back: "Înapoi", submit: "Semnează și Alătură-te" }
    }
  },
  ur: {
    nav: { browse: "خدمات دیکھیں", join: "ماہر کے طور پر شامل ہوں", login: "لاگ ان", logout: "لاگ آؤٹ", dashboard: "ڈیش بورڈ", aiDiagnosis: "AI تشخیص" },
    hero: { title: "ہم آپ کی کیا مدد کر سکتے ہیں؟", subtitle: "مدد حاصل کریں۔", searchPlaceholder: "تلاش کریں...", badge: "امدادی مرکز" },
    faq: { 
      title: "اسمارٹ FAQ", subtitle: "سرکاری جوابات۔", categories: { payments: "ادائیگیاں", disputes: "تنازعات", bookings: "بکنگ" }, 
      aura: { title: "مدد چاہیے؟", subtitle: "Aura AI مدد فراہم کرتا ہے۔", cta: "بات کریں" },
      questions: {
        payments: [{ q: "کیا میں کارڈ سے ادائیگی کر سکتا ہوں؟", a: "جی ہاں، ہم تمام بڑے کارڈز قبول کرتے ہیں۔" }, { q: "رقم واپسی کا طریقہ؟", a: "آپ 24 گھنٹوں میں درخواست دے سکتے ہیں۔" }],
        disputes: [{ q: "ماہر نہیں آیا؟", a: "رقم واپسی کے لیے کلک کریں۔" }, { q: "اضافی اخراجات؟", a: "آپ کی تصدیق کے بغیر لازمی نہیں۔" }],
        bookings: [{ q: "تاریخ کیسے بدلیں؟", a: "48 گھنٹے پہلے مفت تبدیلی۔" }]
      }
    },
    footer: { tagline: "برطانیہ کی بہترین سروس مارکیٹ پلیس۔", explore: "خدمات", legal: "قانونی", support: "سپورٹ", rights: "جملہ حقوق محفوظ ہیں۔", terms: "شرائط", privacy: "رازداری", cookies: "کوکیز", help: "مدد", contact: "رابطہ", aiDiagnosis: "AI تشخیص", homeCleaning: "گھر کی صفائی", plumbingServices: "پلمبنگ کی خدمات", automotiveServices: "گاڑیوں کی خدمات" },
    search: { filters: "فلٹرز", keyword: "کلیدی لفظ", location: "مقام", category: "زمرہ", minRating: "کم از کم ریٹنگ", verifiedOnly: "صرف تصدیق شدہ", apply: "فلٹر لگائیں", sortBy: "ترتیب دیں", sortRating: "ریٹنگ", sortJobs: "کام", sortDistance: "فاصلہ", sortPrice: "قیمت", foundCount: "ماہرین ملے", searching: "تلاش جاری ہے...", noResults: "کوئی نہیں ملا", clearFilters: "صاف کریں", basePrice: "سے", viewDetails: "تفصیل دیکھیں", listView: "لسٹ ویو", mapView: "میپ ویو", searchThisArea: "اس علاقے میں تلاش کریں" },
    booking: {
      steps: { details: "تفصیلات", schedule: "شیڈول", confirmation: "جائزہ" },
      titles: { details: "بکنگ کی تفصیلات", schedule: "وقت کا انتخاب", confirm: "تصدیق اور ادائیگی", success: "بکنگ کی تصدیق ہوگئی!" },
      labels: { date: "تاریخ منتخب کریں", time: "وقت منتخب کریں", make: "کمپنی", model: "ماڈل", address: "پتہ", notes: "نوٹس", agree: "میں شرائط سے متفق ہوں", summary: "خلاصہ", paid: "ادا شدہ", merchant: "مرچنٹ", service: "سروس" },
      buttons: { next: "اگلا قدم", prev: "پیچھے", pay: "ابھی بک کریں", home: "ہوم", dashboard: "میری بکنگز" },
      messages: { finalizing: "آخری مرحلہ...", wait: "براہ کرم انتظار کریں۔", contact24h: "ماہر 24 گھنٹوں میں رابطہ کرے گا۔", safety: "محفوظ ادائیگی کی ضمانت", noReviews: "کوئی ریویو نہیں۔", recommended: "تجویز کردہ", replyFromMaster: "ماہر کا جواب" }
    },
    merchant: {
      verified: "تصدیق شدہ", background: "پیشہ ورانہ پس منظر", portfolio: "پورٹ فولیو", reviewTitle: "صارفین کے ریویوز", realReviews: "حقیقی فیڈ بیک", verifiedBooking: "تصدیق شدہ بکنگ", pricingAnalysis: "نمایاں خصوصیات", bookingChannel: "فوری بکنگ", viewServices: "خدمات دیکھیں", guarantee: "پلیٹ فارم گارنٹی", fastResponse: "فوری جواب", contactExpert: "ماہر سے پوچھیں", noReviews: "کوئی ریویو نہیں", reply: "سرکاری جواب"
    },
    home: {
      hero: { badge: "برطانیہ کا سب سے قابل اعتماد سروس مارکیٹ پلیس", title1: "مقامی ماہرین تلاش کریں", title2: "سیکنڈوں میں۔", subtitle: "گاڑی کی مرمت سے لے کر گھر کی تزئین و آرائش تک۔", searchPlaceholder: "آپ کو کیا سروس چاہیے؟", locationPlaceholder: "شہر یا پوسٹ کوڈ", aiMatch: "AI میچ", searchBtn: "تلاش کریں" },
      recommendation: { title1: "اسمارٹ تجاویز", title2: "AI دریافت", subtitle: "آپ کی ضروریات کے مطابق بہترین سروس", browse: "ابھی دیکھیں" },
      aiCTA: { badge: "نیا: AI سے لیس", title1: "مرمت کی ضرورت ہے؟", title2: "فوری AI تشخیص حاصل کریں۔", subtitle: "صرف ایک تصویر اپ لوڈ کریں اور ہمارا AI سیکنڈوں میں مسئلہ پہچان کر قیمت کا اندازہ دے گا۔", button: "مفت AI تشخیص آزمائیں" },
      categories: { plumbing: "پلمبنگ", repairs: "مرمت", renovation: "تزئین و آرائش", education: "تعلیم", accounting: "اکاؤنٹنگ", legal: "قانونی", commercial: "تجارتی", cleaning: "صفائی", car: "گاڑی کی سروس" },
      sections: {
        plumbing: { title: "پلمبنگ اور بجلی", desc: "تصدیق شدہ ماہرین۔", items: ["پائپ کی مرمت", "وائرنگ", "انسٹالیشن", "بوائلر سروس", "سوئچز", "اسمارٹ ہوم"] },
        repairs: { title: "ہوم ہینڈی مین", desc: "گھر کے کاموں کے لیے۔", items: ["اسمبلی", "دروازے/کھڑکیاں", "دیوار کی مرمت", "شیلفنگ", "پینٹنگ", "متفرق"] },
        accounting: { title: "اکاؤنٹنگ اور ٹیکس", desc: "کاروبار اور رہائشیوں کے لیے۔", items: ["ٹیکس ریٹرن", "سالانہ اکاؤنٹس", "VAT", "پے رول", "مشاورت", "تجزیہ"] },
        renovation: { title: "گھر کی تزئین و آرائش", desc: "معیار کی ضمانت۔", items: ["کچن/باتھ", "توسیع", "ڈیزائن", "پینٹنگ", "فلورنگ", "گارڈننگ"] },
        education: { title: "تعلیم و تربیت", desc: "زبان اور اسکلز ٹریننگ۔", items: ["زبان کے ٹیوٹرز", "IELTS/TOEFL", "پروگرامنگ", "موسیقی", "بزنس اسکلز", "اکیڈمک مدد"] },
        cleaning: { title: "صفائی ستھرائی", desc: "پیشہ ورانہ خدمات۔", items: ["گھر کی صفائی", "ڈیپ کلین", "قالین کی صفائی", "کھڑکیوں کی صفائی", "آفس کلیننگ", "جراثیم کش"] },
        legal: { title: "قانونی مشاورت", desc: "تصدیق شدہ ماہرین۔", items: ["معاہدے", "ویزہ", "پراپرٹی قانون", "تنازعات", "بزنس لا", "نوٹری"] },
        commercial: { title: "تجارتی خدمات", desc: "کاروباری جگہوں کے لیے۔", items: ["شاپ ڈیزائن", "آفس منتقلی", "بجلی کا کام", "فائر سیفٹی", "آئی ٹی نیٹ ورک", "HVAC"] }
      },
      popularTitle: "مقبول پروجیکٹس", popularIn: "میں", allUK: "پورا برطانیہ",
      noProjects: { title: "کوئی پروجیکٹ نہیں ملا", desc: "ہم نئے ماہرین شامل کر رہے ہیں۔" },
      reviews: { excellent: "بہترین", basedOn: "کی بنیاد پر", verified: "تصدیق شدہ" }
    },
    location: { selectCity: "شہر منتخب کریں", detecting: "تلاش جاری ہے...", switch: "تبدیل کریں", nearby: "قریبی خدمات" },
    diagnosis: {
      badge: "GEMINI AI سے لیس",
      title1: "پیشہ ورانہ مرمت",
      title2: "سیکنڈوں میں تشخیص",
      subtitle: "تصورات کو چھوڑیں۔ ہمارا AI آپ کی تصاویر کا تجزیہ کر کے فوری تشخیص اور قیمت کا اندازہ دیتا ہے۔",
      features: {
        instant: { title: "فوری معلومات", desc: "تصویر اپ لوڈ کرتے ہی تکنیکی تفصیلات حاصل کریں۔" },
        pricing: { title: "منصفانہ قیمت", desc: "ہم برطانیہ کے مارکیٹ ڈیٹا کی بنیاد پر درست قیمت دیتے ہیں۔" },
        verified: { title: "تصدیق شدہ بکنگ", desc: "اپنے مسئلے کے بہترین ماہر سے رابطہ کریں۔" }
      },
      cta: "تمام خدمات دیکھیں",
      tool: {
        title: "فوری AI تشخیص",
        subtitle: "تصویر اپ لوڈ کریں اور AI کو قیمت کا اندازہ لگانے دیں۔",
        step1: "1. تصویر اپ لوڈ کریں",
        step2: "2. زمرہ منتخب کریں",
        step3: "3. مسئلہ بیان کریں (اختیاری)",
        uploadHint: "تصویر لیں یا اپ لوڈ کریں",
        replaceHint: "تصویر بدلنے کے لیے کلک کریں",
        submit: "مفت AI تشخیص کریں",
        loading: "AI تجزیہ کر رہا ہے...",
        disclaimer: "AI اندازے صرف رہنمائی کے لیے ہیں۔ حتمی قیمت ماہر دے گا۔",
        newDiagnosis: "نئی تشخیص",
        categories: { plumbing: "پلمبنگ", auto: "گاڑی کی مرمت", renovation: "گھر کی تزئین و آرائش", electrical: "بجلی کا کام", cleaning: "پیشہ ورانہ صفائی" },
        resultTitle: "AI مرمت کی معلومات",
        detectedIssue: "پہچانا گیا مسئلہ",
        recommendedSolution: "تجویز کردہ حل",
        estimatedCostLabel: "تخمینی قیمت",
        ukStandard: "برطانیہ سروس معیار",
        includesLabor: "مزدوری اور پارٹس شامل ہیں",
        bookSpecialist: "تصدیق شدہ ماہر بک کریں",
        confidence: "اعتماد",
        analyzedPhoto: "تجزیہ شدہ تصویر",
        guaranteedRepairs: "ضمانت شدہ مرمت",
        disputeResolution: "تمام بکنگز میں AI کے ذریعے تنازعات کا حل شامل ہے۔",
        fastTurnaround: "فوری جواب",
        responseHours: "زیادہ تر {category} ماہرین 2 گھنٹے میں جواب دیتے ہیں۔",
        errorPhotoCategory: "براہ کرم تصویر اپ لوڈ کریں اور زمرہ منتخب کریں۔",
        errorUnexpected: "غیر متوقع غلطی ہوئی ہے: ",
        uploadFormatHint: "اعلیٰ معیار کی JPG، PNG (زیادہ سے زیادہ 5MB) کو سپورٹ کرتا ہے",
        descriptionPlaceholder: "مثال کے طور پر: میرا کچن سنک کل صبح سے ٹپک رہا ہے..."
      }
    },
    onboarding: {
      hero: { title: "ServiceHub کے ساتھ اپنے کاروبار کو وسعت دیں", subtitle: "تعلیم، اکاؤنٹنگ، مرمت اور مزید شعبوں میں برطانیہ کے معروف ماہرین کے مارکیٹ پلیس میں شامل ہوں۔" },
      steps: { profile: "بزنس پروفائل", credentials: "اہلیت", contract: "معاہدے کا جائزہ" },
      sectors: {
        title: "اپنی مہارت کا انتخاب کریں",
        professional: { title: "پیشہ ورانہ خدمات", desc: "پیچیدہ دستاویزات اور مشورے سنبھالنے والے تصدیق شدہ ماہرین کے لیے۔", industries: ["اکاؤنٹنگ", "قانونی", "مالیاتی مشورہ"] },
        education: { title: "تعلیم اور ٹیوٹرز", desc: "اساتذہ، ہنر کی تربیت دینے والوں اور تعلیمی اساتذہ کے لیے۔", industries: ["زبان کے ٹیوٹرز", "امتحان کی تیاری", "ہنر کی تربیت"] },
        technical: { title: "تکنیکی اور دیکھ بھال", desc: "ہنر مند کاریگروں اور ضروری گھر/کار خدمات کے لیے۔", industries: ["پلمبنگ", "الیکٹریکل", "آٹو مرمت", "تزئین و آرائش"] }
      },
      contract: {
        title: "ماہر سروسز کا معاہدہ",
        scrollingNotice: "براہ کرم اپنی قبولیت کی تصدیق کے لیے معاہدے کے آخر تک سکرول کریں۔",
        agree: "میں نے ماہر سروسز کا معاہدہ پڑھ لیا ہے اور میں اس سے متفق ہوں",
        clauses: {
          commission: { title: "1. پلیٹ فارم سروس فیس اور گروتھ کے مراعات", body: "سروس ہب کامیاب بکنگ پر 8 فیصد پلیٹ فارم رسائی فیس لاگو کرتا ہے۔ آپ کے کاروبار کی ترقی میں مدد کے لیے، آپ کے پہلے 5 آرڈرز 100 فیصد کمیشن سے پاک ہیں۔ فیسیں خود بخود آخری ادائیگی سے منہا کر دی جاتی ہیں۔" },
          service: { title: "2. سروس کی عمدگی اور برطانیہ کی تعمیل", body: "شراکت داروں کو کم از کم 4.2 کی درجہ بندی برقرار رکھنی چاہیے اور 24 گھنٹے کے اندر پوچھ گچھ کا جواب دینا چاہیے۔ آپ تصدیق کرتے ہیں کہ آپ کے پاس برطانیہ کے تمام درست لائسنس اور انشورنس موجود ہیں۔" },
          disputes: { title: "3. AI سے چلنے والے تنازعات کا حل اور اسمارٹ میچنگ", body: "ہمارا اپنا AI ثالث فوری اور منصفانہ حل فراہم کرتا ہے۔ AI اسمارٹ میچنگ ٹیکنالوجی کے ذریعے، ہم اس بات کو یقینی بناتے ہیں کہ آپ کو مقامی فوری بکنگ کے درست ترین آرڈرز ملیں۔" }
        }
      },
      buttons: { start: "شروع کریں", next: "جاری رکھیں", back: "پیچھے جائیں", submit: "سائن کریں اور شامل ہوں" }
    }
  },
  pa: {
    nav: { browse: "ਸੇਵਾਵਾਂ ਦੇਖੋ", join: "ਮਾਹਰ ਵਜੋਂ ਸ਼ਾਮਲ ਹੋਵੋ", login: "ਲੌਗਇਨ", logout: "ਲੌਗਆਊਟ", dashboard: "ਡੈਸ਼ਬੋਰਡ", aiDiagnosis: "AI ਨਿਦਾਨ" },
    hero: { title: "ਅਸੀਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?", subtitle: "FAQ ਖੋਜੋ ਅਤੇ ਤੁਰੰਤ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ।", searchPlaceholder: "ਰਿਫੰਡ, ਝਗੜੇ, ਬੁਕਿੰਗ ਮੁੱਦਿਆਂ ਦੀ ਖੋਜ ਕਰੋ...", badge: "ਸਹਾਇਤਾ ਕੇਂਦਰ" },
    faq: { 
      title: "ਸਮਾਰਟ FAQ", subtitle: "ਭੁਗਤਾਨਾਂ, ਸੁਰੱਖਿਆ ਅਤੇ ਝਗੜਿਆਂ ਬਾਰੇ ਅਧਿਕਾਰਤ ਜਵਾਬ।", categories: { payments: "ਭੁਗਤਾਨ", disputes: "ਝਗੜੇ", bookings: "ਬੁਕਿੰਗ" }, 
      aura: { title: "ਹੋਰ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ?", subtitle: "Aura AI 1-ਨਾਲ-1 ਕਾਨੂੰਨੀ ਅਤੇ ਸੇਵਾ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।", cta: "ਹੁਣੇ ਗੱਲ ਕਰੋ" },
      questions: {
        payments: [
          { q: "ਕੀ ਮੈਂ ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਨਾਲ ਭੁਗਤਾਨ ਕਰ ਸਕਦਾ ਹਾਂ?", a: "ਹਾਂ, ਅਸੀਂ ਸਾਰੇ ਪ੍ਰਮੁੱਖ ਕ੍ਰੈਡਿਟ/ਡੈਬਿਟ ਕਾਰਡਾਂ ਦਾ ਸਮਰਥਨ ਕਰਦੇ ਹਾਂ।" },
          { q: "ਰਿਫੰਡ ਲਈ ਕਿਵੇਂ ਅਪਲਾਈ ਕਰੀਏ?", a: "ਤੁਸੀਂ ਕੰਮ ਪੂਰਾ ਹੋਣ ਦੇ 24 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਸਿਸਟਮ ਰਾਹੀਂ ਅਪਲਾਈ ਕਰ ਸਕਦੇ ਹੋ।" }
        ],
        disputes: [
          { q: "ਜੇ ਮਾਹਰ ਨਾ ਆਵੇ ਤਾਂ ਕੀ ਕਰੀਏ?", a: "ਰਿਫੰਡ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਆਰਡਰ ਪੰਨੇ 'ਤੇ 'ਮਰਚੈਂਟ ਨੋ-ਸ਼ੋਅ' 'ਤੇ ਕਲਿੱਕ ਕਰੋ।" },
          { q: "ਕੀ ਵਾਧੂ ਲਾਗਤਾਂ ਲਾਜ਼ਮੀ ਹਨ?", a: "ਨਹੀਂ। ਵਾਧੂ ਖਰਚੇ ਸਿਸਟਮ ਰਾਹੀਂ ਜਮ੍ਹਾ ਕੀਤੇ ਜਾਣੇ ਚਾਹੀਦੇ ਹਨ ਅਤੇ ਤੁਹਾਡੇ ਦੁਆਰਾ ਪੁਸ਼ਟੀ ਕੀਤੇ ਜਾਣੇ ਚਾਹੀਦੇ ਹਨ।" }
        ],
        bookings: [
          { q: "ਬੁਕਿੰਗ ਦਾ ਸਮਾਂ ਕਿਵੇਂ ਬਦਲੀਏ?", a: "ਤੁਸੀਂ 48 ਘੰਟੇ ਪਹਿਲਾਂ ਮੁਫਤ ਵਿੱਚ ਸਮਾਂ ਬਦਲ ਸਕਦੇ ਹੋ।" }
        ]
      }
    },
    footer: { tagline: "ਯੂਕੇ ਦੀ ਪ੍ਰੀਮੀਅਮ ਸਰਵਿਸ ਮਾਰਕੀਟਪਲੇਸ।", explore: "ਸੇਵਾਵਾਂ ਦੀ ਪੜਚੋਲ ਕਰੋ", legal: "ਕਾਨੂੰਨੀ ਅਤੇ ਪਾਲਣਾ", support: "ਗਾਹਕ ਸਹਾਇਤਾ", rights: "ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।", terms: "ਸ਼ਰਤਾਂ", privacy: "ਪਰਾਈਵੇਸੀ", cookies: "ਕੂਕੀਜ਼", help: "ਸਹਾਇਤਾ ਕੇਂਦਰ", contact: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ", aiDiagnosis: "AI ਨਿਦਾਨ", homeCleaning: "ਘਰ ਦੀ ਸਫਾਈ", plumbingServices: "ਪਲੰਬਿੰਗ ਸੇਵਾਵਾਂ", automotiveServices: "ਆਟੋਮੋਟਿਵ ਸੇਵਾਵਾਂ" },
    search: { filters: "ਫਿਲਟਰ", keyword: "ਕੀਵਰਡ", location: "ਸਥਾਨ", category: "ਸ਼੍ਰੇਣੀ", minRating: "ਰੇਟਿੰਗ", verifiedOnly: "ਸਿਰਫ ਪ੍ਰਮਾਣਿਤ", apply: "ਫਿਲਟਰ ਲਾਗੂ ਕਰੋ", sortBy: "ਕ੍ਰਮਬੱਧ ਕਰੋ", sortRating: "ਰੇਟਿੰਗ", sortJobs: "ਕੰਮ", sortDistance: "ਦੂਰੀ", sortPrice: "ਕੀਮਤ", foundCount: "ਮਾਹਰ ਮਿਲੇ", searching: "ਖੋਜ ਜਾਰੀ ਹੈ...", noResults: "ਕੋਈ ਨਹੀਂ ਮਿਲਿਆ", clearFilters: "ਸਾਫ਼ ਕਰੋ", basePrice: "ਤੋਂ", viewDetails: "ਵੇਰਵੇ ਦੇਖੋ", listView: "ਸੂਚੀ ਦ੍ਰਿਸ਼", mapView: "ਨਕਸ਼ਾ ਦ੍ਰਿਸ਼", searchThisArea: "ਇਸ ਖੇਤਰ ਵਿੱਚ ਖੋਜੋ" },
    booking: {
      steps: { details: "ਵੇਰਵੇ", schedule: "ਸ਼ਡਿਊਲ", confirmation: "ਸਮੀਖਿਆ" },
      titles: { details: "ਬੁਕਿੰਗ ਵੇਰਵੇ", schedule: "ਸਮਾਂ ਚੁਣੋ", confirm: "ਪੁਸ਼ਟੀ ਅਤੇ ਭੁਗਤਾਨ", success: "ਬੁਕਿੰਗ ਦੀ ਪੁਸ਼ਟੀ ਹੋ ਗਈ!" },
      labels: { date: "ਤਾਰੀਖ ਚੁਣੋ", time: "ਸਮਾਂ ਚੁਣੋ", make: "ਕੰਪਨੀ", model: "ਮਾਡਲ", address: "ਪਤਾ", notes: "ਨੋਟਸ", agree: "ਮੈਂ ਸ਼ਰਤਾਂ ਨਾਲ ਸਹਿਮਤ ਹਾਂ", summary: "ਸਾਰ", paid: "ਭੁਗਤਾਨ ਕੀਤਾ", merchant: "ਵਪਾਰੀ", service: "ਸੇਵਾ" },
      buttons: { next: "ਅਗਲਾ ਕਦਮ", prev: "ਪਿਛਲਾ", pay: "ਹੁਣੇ ਬੁੱਕ ਕਰੋ", home: "ਹੋਮ", dashboard: "ਮੇਰੀ ਬੁਕਿੰਗ" },
      messages: { finalizing: "ਅੰਤਿਮ ਰੂਪ ਦਿੱਤਾ ਜਾ ਰਿਹਾ ਹੈ...", wait: "ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ।", contact24h: "ਮਾਹਰ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਸੰਪਰਕ ਕਰੇਗਾ।", safety: "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਦੀ ਗਾਰੰਟੀ", noReviews: "ਕੋਈ ਸਮੀਖਿਆ ਨਹੀਂ।", recommended: "ਸਿਫਾਰਸ਼ ਕੀਤੀ", replyFromMaster: "ਜਵਾਬ" }
    },
    merchant: {
      verified: "ਪ੍ਰਮਾਣਿਤ", background: "ਪੇਸ਼ੇਵਰ ਪਿਛੋਕੜ", portfolio: "ਪੋਰਟਫੋਲੀਓ", reviewTitle: "ਗਾਹਕ ਸਮੀਖਿਆਵਾਂ", realReviews: "ਅਸਲੀ ਫੀਡਬੈਕ", verifiedBooking: "ਪ੍ਰਮਾਣਿਤ ਬੁਕਿੰਗ", pricingAnalysis: "ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ", bookingChannel: "ਤੁਰੰਤ ਬੁਕਿੰਗ", viewServices: "ਸੇਵਾਵਾਂ ਦੇਖੋ", guarantee: "ਪਲੇਟਫਾਰਮ ਗਾਰੰਟੀ", fastResponse: "ਤੁਰੰਤ ਜਵਾਬ", contactExpert: "ਮਾਹਰ ਨੂੰ ਪੁੱਛੋ", noReviews: "ਕੋਈ ਸਮੀਖਿਆ ਨਹੀਂ", reply: "ਸਰਕਾਰੀ ਜਵਾਬ"
    },
    home: {
      hero: { badge: "ਯੂਕੇ ਦਾ ਸਭ ਤੋਂ ਭਰੋਸੇਮੰਦ ਸਰਵਿਸ ਮਾਰਕੀਟਪਲੇਸ", title1: "ਸਥਾਨਕ ਮਾਹਰ ਲੱਭੋ", title2: "ਸਕਿੰਟਾਂ ਵਿੱਚ।", subtitle: "ਕਾਰ ਦੀ ਮੁਰੰਮਤ ਤੋਂ ਲੈ ਕੇ ਘਰ ਦੀ ਸਜਾਵਟ ਤੱਕ।", searchPlaceholder: "ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ?", locationPlaceholder: "ਸ਼ਹਿਰ ਜਾਂ ਪੋਸਟ ਕੋਡ", aiMatch: "AI ਮੈਚ", searchBtn: "ਖੋਜ" },
      recommendation: { title1: "ਸਮਾਰਟ ਸਿਫਾਰਸ਼ਾਂ", title2: "AI ਖੋਜ", subtitle: "ਤੁਹਾਡੀਆਂ ਜ਼ਰੂਰਤਾਂ ਦੇ ਅਨੁਸਾਰ", browse: "ਹੁਣੇ ਦੇਖੋ" },
      aiCTA: { badge: "ਨਵਾਂ: AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ", title1: "ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ?", title2: "ਤੁਰੰਤ AI ਨਿਦਾਨ ਪ੍ਰਾਪਤ ਕਰੋ।", subtitle: "ਇੱਕ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਅਤੇ ਸਾਡਾ AI ਸਕਿੰਟਾਂ ਵਿੱਚ ਸਮੱਸਿਆ ਦੀ ਪਛਾਣ ਕਰੇਗਾ।", button: "ਮੁਫਤ AI ਨਿਦਾਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ" },
      categories: { plumbing: "ਪਲੰਬਿੰਗ", repairs: "ਮੁਰੰਮਤ", renovation: "ਸਜਾਵਟ", education: "ਸਿੱਖਿਆ", accounting: "ਲੇਖਾਕਾਰੀ", legal: "ਕਾਨੂੰਨੀ", commercial: "ਵਪਾਰਕ", cleaning: "ਸਫਾਈ", car: "ਕਾਰ ਸੇਵਾਵਾਂ" },
      sections: {
        plumbing: { title: "ਪਲੰਬਿੰਗ ਅਤੇ ਬਿਜਲੀ", desc: "ਪ੍ਰਮਾਣਿਤ ਮਾਹਰ।", items: ["ਮੁਰੰਮਤ", "ਵਾਇਰਿੰਗ", "ਸਥਾਪਨਾ", "ਬੋਇਲਰ", "ਸਵਿੱਚ", "ਸਮਾਰਟ ਹੋਮ"] },
        repairs: { title: "ਹੋਮ ਹੈਂਡੀਮੈਨ", desc: "ਘਰ ਦੇ ਕੰਮਾਂ ਲਈ।", items: ["ਅਸੈਂਬਲੀ", "ਦਰਵਾਜ਼ੇ/ਖਿੜਕੀਆਂ", "ਦੀਵਾਰ ਦੀ ਮੁਰੰਮਤ", "ਸ਼ੈਲਫਿੰਗ", "ਪੇਂਟਿੰਗ", "ਵਿਭਿੰਨ"] },
        accounting: { title: "ਲੇਖਾਕਾਰੀ ਅਤੇ ਟੈਕਸ", desc: "ਕਾਰੋਬਾਰੀ ਅਤੇ ਰਿਹਾਇਸ਼ੀ।", items: ["ਟੈਕਸ ਰਿਟਰਨ", "ਸਾਲਾਨਾ ਖਾਤੇ", "ਵੈਟ", "ਪੇਰੋਲ", "ਸਲਾਹ", "ਵਿਸ਼ਲੇਸ਼ਣ"] },
        renovation: { title: "ਘਰ ਦੀ ਸਜਾਵਟ", desc: "ਗੁਣਵੱਤਾ ਦੀ ਗਾਰੰਟੀ।", items: ["ਰਸੋਈ/ਬਾਥ", "ਵਿਸਤਾਰ", "ਡਿਜ਼ਾਈਨ", "ਪੇਂਟਿੰਗ", "ਫਲੋਰਿੰਗ", "ਬਾਗਬਾਨੀ"] },
        education: { title: "ਸਿੱਖਿਆ ਅਤੇ ਸਿਖਲਾਈ", desc: "ਭਾਸ਼ਾ ਅਤੇ ਹੁਨਰ ਸਿਖਲਾਈ।", items: ["ਭਾਸ਼ਾ ਟਿਊਟਰ", "IELTS/TOEFL", "ਪ੍ਰੋਗਰਾਮਿੰਗ", "ਸੰਗੀਤ", "ਬਿਜ਼ਨਸ ਸਕਿੱਲ", "ਅਕਾਦਮਿਕ ਮਦਦ"] },
        cleaning: { title: "ਸਫਾਈ ਸੇਵਾਵਾਂ", desc: "ਪੇਸ਼ੇਵਰ ਸਫਾਈ।", items: ["ਘਰ ਦੀ ਸਫਾਈ", "ਡੀਪ ਕਲੀਨ", "ਕਾਲੀਨ ਦੀ ਸਫਾਈ", "ਖਿੜਕੀਆਂ ਦੀ ਸਫਾਈ", "ਆਫਿਸ ਕਲੀਨਿੰਗ", "ਰੋਗਾਣੂ ਮੁਕਤ"] },
        legal: { title: "ਕਾਨੂੰਨੀ ਸਲਾਹ", desc: "ਪ੍ਰਮਾਣਿਤ ਮਾਹਰ।", items: ["ਕਰਾਰ", "ਵੀਜ਼ਾ", "ਪ੍ਰਾਪਰਟੀ ਕਾਨੂੰਨ", "ਝਗੜੇ", "ਬਿਜ਼ਨਸ ਲਾਅ", "ਨੋਟਰੀ"] },
        commercial: { title: "ਵਪਾਰਕ ਸੇਵਾਵਾਂ", desc: "ਵਪਾਰਕ ਸਥਾਨਾਂ ਲਈ।", items: ["ਸ਼ਾਪ ਡਿਜ਼ਾਈਨ", "ਆਫਿਸ ਤਬਦੀਲੀ", "ਬਿਜਲੀ", "ਫਾਇਰ ਸੇਫਟੀ", "ਆਈਟੀ ਨੈੱਟਵਰਕ", "HVAC"] }
      },
      popularTitle: "ਪ੍ਰਸਿੱਧ ਪ੍ਰੋਜੈਕਟ", popularIn: "ਵਿੱਚ", allUK: "ਸਾਰਾ ਯੂਕੇ",
      noProjects: { title: "ਕੋਈ ਪ੍ਰੋਜੈਕਟ ਨਹੀਂ ਮਿਲਿਆ", desc: "ਅਸੀਂ ਨਵੇਂ ਮਾਹਰ ਸ਼ਾਮਲ ਕਰ ਰਹੇ ਹਾਂ।" },
      reviews: { excellent: "ਸ਼ਾਨਦਾਰ", basedOn: "ਦੇ ਅਧਾਰ 'ਤੇ", verified: "ਪ੍ਰਮਾਣਿਤ" }
    },
    location: { selectCity: "ਸ਼ਹਿਰ ਚੁਣੋ", detecting: "ਪਛਾਣ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...", switch: "ਬਦਲੋ", nearby: "ਨੇੜਲੀ ਸੇਵਾਵਾਂ" },
    diagnosis: {
      badge: "GEMINI AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ",
      title1: "ਪੇਸ਼ੇਵਰ ਮੁਰੰਮਤ",
      title2: "ਸਕਿੰਟਾਂ ਵਿੱਚ ਪਛਾਣ",
      subtitle: "ਸਾਡਾ AI ਫੋਰਟੋਆਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਕੇ ਤੁਰੰਤ ਮੁਰੰਮਤ ਦੀ ਲਾਗਤ ਦਾ ਅੰਦਾਜ਼ਾ ਦਿੰਦਾ ਹੈ।",
      features: {
        instant: { title: "ਤੁਰੰਤ ਜਾਣਕਾਰੀ", desc: "ਅਪਲੋਡ ਕਰਨ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਤਕਨੀਕੀ ਵੇਰਵੇ ਪ੍ਰਾਪਤ ਕਰੋ।" },
        pricing: { title: "ਵਾਜਬ ਕੀਮਤ", desc: "ਅਸੀਂ ਸਹੀ ਕੀਮਤ ਦੇਣ ਲਈ ਯੂਕੇ ਦੇ ਮਾਰਕੀਟ ਡੇਟਾ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਾਂ।" },
        verified: { title: "ਪ੍ਰਮਾਣਿਤ ਬੁਕਿੰਗ", desc: "ਆਪਣੀ ਸਮੱਸਿਆ ਦੇ ਵਧੀਆ ਮਾਹਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।" }
      },
      cta: "ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ ਦੇਖੋ",
      tool: {
        title: "ਤੁਰੰਤ AI ਨਿਦਾਨ",
        subtitle: "ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਅਤੇ AI ਨੂੰ ਲਾਗਤ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਉਣ ਦਿਓ।",
        step1: "1. ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",
        step2: "2. ਸ਼੍ਰੇਣੀ ਚੁਣੋ",
        step3: "3. ਸਮੱਸਿਆ ਬਾਰੇ ਦੱਸੋ (ਵੈਕਲਪਿਕ)",
        uploadHint: "ਫੋਟੋ ਲਓ ਜਾਂ ਅਪਲੋਡ ਕਰੋ",
        replaceHint: "ਫੋਟੋ ਬਦਲਣ ਲਈ ਕਲਿੱਕ ਕਰੋ",
        submit: "ਮੁਫਤ AI ਨਿਦਾਨ ਕਰੋ",
        loading: "AI ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
        disclaimer: "AI ਅੰਦਾਜ਼ੇ ਸਿਰਫ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਹਨ। ਅੰਤਿਮ ਕੀਮਤ ਮਾਹਰ ਦੁਆਰਾ ਦਿੱਤੀ ਜਾਵੇਗੀ।",
        newDiagnosis: "ਨਵਾਂ ਨਿਦਾਨ",
        categories: { plumbing: "ਪਲੰਬਿੰਗ", auto: "ਕਾਰ ਦੀ ਮੁਰੰਮਤ", renovation: "ਘਰ ਦੀ ਸਜਾਵਟ", electrical: "ਬਿਜਲੀ ਦਾ ਕੰਮ", cleaning: "ਪੇਸ਼ੇਵਰ ਸਫਾਈ" },
        resultTitle: "AI ਮੁਰੰਮਤ ਦੀ ਜਾਣਕਾਰੀ",
        detectedIssue: "ਪਛਾਣੀ ਗਈ ਸਮੱਸਿਆ",
        recommendedSolution: "ਸਿਫਾਰਸ਼ੀ ਹੱਲ",
        estimatedCostLabel: "ਅੰਦਾਜ਼ਨ ਕੀਮਤ",
        ukStandard: "ਯੂਕੇ ਸਰਵਿਸ ਮਿਆਰ",
        includesLabor: "ਮਜ਼ਦੂਰੀ ਅਤੇ ਪਾਰਟਸ ਸ਼ਾਮਲ ਹਨ",
        bookSpecialist: "ਪ੍ਰਮਾਣਿਤ ਮਾਹਰ ਬੁੱਕ ਕਰੋ",
        confidence: "ਭਰੋਸਾ",
        analyzedPhoto: "ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤੀ ਫੋਟੋ",
        guaranteedRepairs: "ਗਾਰੰਟੀਸ਼ੁਦਾ ਮੁਰੰਮਤ",
        disputeResolution: "ਸਾਰੀਆਂ ਬੁਕਿੰਗਾਂ ਵਿੱਚ AI ਦੁਆਰਾ ਝਗੜਿਆਂ ਦਾ ਹੱਲ ਸ਼ਾਮਲ ਹੈ।",
        fastTurnaround: "ਤੁਰੰਤ ਜਵਾਬ",
        responseHours: "ਜ਼ਿਆਦਾਤਰ {category} ਮਾਹਰ 2 ਘੰਟੇ ਵਿੱਚ ਜਵਾਬ ਦਿੰਦੇ ਹਨ।",
        errorPhotoCategory: "ਕਿਰਪਾ ਕਰਕੇ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਅਤੇ ਸ਼੍ਰੇਣੀ ਚੁਣੋ।",
        errorUnexpected: "ਗਲਤੀ ਆਈ ਹੈ: ",
        uploadFormatHint: "ਉੱਚ ਗੁਣਵੱਤਾ ਵਾਲੀ JPG, PNG (ਵੱਧ ਤੋਂ ਵੱਧ 5MB) ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ",
        descriptionPlaceholder: "ਜਿਵੇਂ ਕਿ: ਮੇਰਾ ਰਸੋਈ ਸਿੰਕ ਕੱੱਲ੍ਹ ਸਵੇਰ ਤੋਂ ਟਪਕ ਰਿਹਾ ਹੈ..."
      }
    },
    onboarding: {
      hero: { title: "ServiceHub ਨਾਲ ਆਪਣਾ ਕਾਰੋਬਾਰ ਵਧਾਓ", subtitle: "ਸਿੱਖਿਆ, ਲੇਖਾਕਾਰੀ, ਮੁਰੰਮਤ ਅਤੇ ਹੋਰ ਖੇਤਰਾਂ ਵਿੱਚ ਯੂਕੇ ਦੇ ਮੋਹਰੀ ਮਾਰਕੀਟਪਲੇਸ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ।" },
      steps: { profile: "ਕਾਰੋਬਾਰੀ ਪ੍ਰੋਫਾਈਲ", credentials: "ਯੋਗਤਾਵਾਂ", contract: "ਇਕਰਾਰਨਾਮੇ ਦੀ ਸਮੀਖਿਆ" },
      sectors: {
        title: "ਆਪਣੀ ਮੁਹਾਰਤ ਚੁਣੋ",
        professional: { title: "ਪੇਸ਼ੇਵਰ ਸੇਵਾਵਾਂ", desc: "ਗੁੰਝਲਦਾਰ ਦਸਤਾਵੇਜ਼ਾਂ ਅਤੇ ਸਲਾਹਾਂ ਨੂੰ ਸੰਭਾਲਣ ਵਾਲੇ ਪ੍ਰਮਾਣਿਤ ਮਾਹਰਾਂ ਲਈ।", industries: ["ਲੇਖਾਕਾਰੀ", "ਕਾਨੂੰਨੀ", "ਵਿੱਤੀ ਸਲਾਹ"] },
        education: { title: "ਸਿੱਖਿਆ ਅਤੇ ਟਿਊਟਰ", desc: "ਅਧਿਆਪਕਾਂ, ਹੁਨਰ ਟ੍ਰੇਨਰਾਂ ਅਤੇ ਅਕਾਦਮਿਕ ਸਲਾਹਕਾਰਾਂ ਲਈ।", industries: ["ਭਾਸ਼ਾ ਟਿਊਟਰ", "ਪ੍ਰੀਖਿਆ ਦੀ ਤਿਆਰੀ", "ਹੁਨਰ ਸਿਖਲਾਈ"] },
        technical: { title: "ਤਕਨੀਕੀ ਅਤੇ ਰੱਖ-ਰਖਾਅ", desc: "ਹੁਨਰਮੰਦ ਕਾਰੀਗਰਾਂ ਅਤੇ ਜ਼ਰੂਰੀ ਘਰ/ਕਾਰ ਸੇਵਾਵਾਂ ਲਈ।", industries: ["ਪਲੰਬਿੰਗ", "ਇਲੈਕਟ੍ਰੀਕਲ", "ਆਟੋ ਮੁਰੰਮਤ", "ਨਵੀਨੀਕਰਨ"] }
      },
      contract: {
        title: "ਮਾਹਰ ਸੇਵਾਵਾਂ ਦਾ ਇਕਰਾਰਨਾਮਾ",
        scrollingNotice: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਸਵੀਕ੍ਰਿਤੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ ਇਕਰਾਰਨਾਮੇ ਦੇ ਹੇਠਾਂ ਤੱਕ ਸਕ੍ਰੋਲ ਕਰੋ।",
        agree: "ਮੈਂ ਮਾਹਰ ਸੇਵਾਵਾਂ ਦਾ ਇਕਰਾਰਨਾਮਾ ਪੜ੍ਹ ਲਿਆ ਹੈ ਅਤੇ ਮੈਂ ਇਸ ਨਾਲ ਸਹਿਮਤ ਹਾਂ",
        clauses: {
          commission: { title: "1. ਪਲੇਟਫਾਰਮ ਸੇਵਾ ਫੀਸ ਅਤੇ ਵਿਕਾਸ ਪ੍ਰੋਤਸਾਹਨ", body: "ServiceHub ਸਫਲ ਬੁਕਿੰਗਾਂ 'ਤੇ ਇਕ ਪ੍ਰਤੀਯੋਗੀ 8% ਪਲੇਟਫਾਰਮ ਪਹੁੰਚ ਫੀਸ ਲਾਗੂ ਕਰਦਾ ਹੈ। ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਦੇ ਵਿਕਾਸ ਵਿੱਚ ਸਹਾਇਤਾ ਲਈ, ਤੁਹਾਡੇ ਪਹਿਲੇ 5 ਆਰਡਰ 100% ਕਮਿਸ਼ਨ-ਮੁਕਤ ਹਨ। ਫੀਸਾਂ ਅੰਤਿਮ ਭੁਗਤਾਨ ਵਿੱਚੋਂ ਆਪਣੇ ਆਪ ਕੱਟੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।" },
          service: { title: "2. ਸੇਵਾ ਉੱਤਮਤਾ ਅਤੇ ਯੂਕੇ ਪਾਲਣਾ", body: "ਭਾਈਵਾਲਾਂ ਨੂੰ ਘੱਟੋ-ਘੱਟ 4.2 ਦੀ ਰੇਟਿੰਗ ਬਣਾਈ ਰੱਖਣੀ ਚਾਹੀਦੀ ਹੈ ਅਤੇ 24 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਪੁੱਛਗਿੱਛ ਦਾ ਜਵਾਬ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ। ਤੁਸੀਂ ਤਸਦੀਕ ਕਰਦੇ ਹੋ ਕਿ ਤੁਹਾਡੇ ਕੋਲ ਆਪਣੇ ਵਪਾਰ ਨਾਲ ਸਬੰਧਤ ਸਾਰੇ ਵੈਧ ਯੂਕੇ ਲਾਇਸੈਂਸ ਅਤੇ ਬੀਮਾ ਹਨ।" },
          disputes: { title: "3. AI-ਪਾਵਰਡ ਡਿਸਪਿਊਟ ਰੈਜ਼ੋਲੂਸ਼ਨ ਅਤੇ ਸਮਾਰਟ ਮੈਚਿੰਗ", body: "ਸਾਰੇ ਝਗੜਿਆਂ ਦੀ ਵਿਚੋਲਗੀ ਸਾਡੇ AI ਆਰਬੀਟਰ ਦੁਆرا ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਕੰਮ ਦੇ ਰਿਕਾਰਡ ਅਤੇ ਫੋਟੋਆਂ ਦੇ ਸਬੂਤ ਅੰਤਿਮ ਫੈਸਲਿਆਂ ਲਈ ਵਰਤੇ ਜਾਣਗੇ।" }
        }
      },
      buttons: { start: "ਸ਼ੁਰੂ ਕਰੋ", next: "ਜਾਰੀ ਰੱਖੋ", back: "ਪਿੱਛੇ ਜਾਓ", submit: "ਸਾਈਨ ਕਰੋ ਅਤੇ ਸ਼ਾਮਲ ਹੋਵੋ" }
    }
  }
};

