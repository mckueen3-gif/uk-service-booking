import { en } from './locales/en';
import { zhTW } from './locales/zh-TW';
import { hi } from './locales/hi';
import { ar } from './locales/ar';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { pl } from './locales/pl';
import { ro } from './locales/ro';
import { ur } from './locales/ur';
import { pa } from './locales/pa';

export interface Dictionary {
  nav: { browse: string; join: string; login: string; register: string; logout: string; dashboard: string; aiDiagnosis: string; education: string; quickActions: string; exploreServices: string };
  legal: { ui: { selectLanguage: string; close: string } };
  landing_pages: {
    [key: string]: {
      hero: {
        badge: string;
        title1: string;
        title2: string;
        subtitle: string;
        searchPlaceholder: string;
        searchBtn: string;
      };
      sub_categories: {
        [key: string]: {
          title: string;
          desc: string;
        };
      };
    };
  };
  common: { viewProfile: string; reviews: string; hr: string; copy: string; copied: string; aiMatchingSub: string; exploreSub: string; escrow: { title: string; subtitle: string; specialists: string; fees: string; support: string } };
  hero: { title: string; subtitle: string; searchPlaceholder: string; badge: string };
  faq: {
    title: string;
    subtitle: string;
    categories: { payments: string; disputes: string; bookings: string };
    aura: { title: string; subtitle: string; cta: string };
    questions: {
      payments: { q: string; a: string }[];
      disputes: { q: string; a: string }[];
      bookings: { q: string; a: string }[];
    };
  };
  aura: {
    welcome: string;
    offline: string;
    ready: string;
    placeholder: string;
    error: string;
    footer: string;
    suggestions: {
      refund: string;
      dispute: string;
      warranty: string;
      booking: string;
      refundQuery: string;
      disputeQuery: string;
      warrantyQuery: string;
      bookingQuery: string;
    };
  };
  footer: { 
    tagline: string; 
    explore: string; 
    legal: string; 
    support: string; 
    rights: string; 
    terms: string; 
    privacy: string; 
    cookies: string; 
    help: string; 
    contact: string; 
    aiDiagnosis: string; 
    homeCleaning: string; 
    plumbingServices: string; 
    automotiveServices: string; 
    trustSignal: string;
    address: string;
    phone: string;
    email: string;
    companyNo: string;
    vatNo: string;
    aboutUs: string;
    social: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    }
  };
  search: { 
    filters: string; keyword: string; location: string; category: string; minRating: string; verifiedOnly: string; 
    apply: string; sortBy: string; sortRating: string; sortJobs: string; sortDistance: string; sortPrice: string; 
    foundCount: string; searching: string; noResults: string; noResultsHint: string; clearFilters: string; 
    basePrice: string; viewDetails: string; listView: string; mapView: string; searchThisArea: string;
    verified: string; insured: string; priceAudit: string; defaultDesc: string;
  };
  booking: {
    steps: { details: string; schedule: string; confirmation: string };
    titles: { details: string; schedule: string; confirm: string; success: string };
    labels: { date: string; time: string; make: string; model: string; address: string; notes: string; agree: string; summary: string; paid: string; merchant: string; service: string };
    buttons: { next: string; prev: string; pay: string; home: string; dashboard: string };
    messages: { finalizing: string; wait: string; contact24h: string; safety: string; noReviews: string; recommended: string; replyFromMaster: string };
  };
  merchant: {
    verified: string; background: string; portfolio: string; reviewTitle: string; realReviews: string; verifiedBooking: string; pricingAnalysis: string; bookingChannel: string; viewServices: string; guarantee: string; fastResponse: string; contactExpert: string; noReviews: string; reply: string;
    dashboard: {
      title: string; welcome: string; previewProfile: string; manageServices: string;
      stats: { totalBookings: string; rating: string; pendingBalance: string; availableBalance: string; totalJobs: string; escrowHeld: string; availableNow: string; reviews: string };
      syncStatus: string;
      lastSynced: string;
      refresh: string;
      syncing: string;
      syncFailed: string;
      wallet: {
        syncing: string;
        synced: string;
        generating: string;
        referralTitle: string;
        referralDesc: string;
        historyTitle: string;
        historyEmpty: string;
        type: string;
        description: string;
        amount: string;
        date: string;
        referralListTitle: string;
        referralListDesc: string;
        referee: string;
        earned: string;
        expiry: string;
        status: string;
        active: string;
        expired: string;
        joinedAt: string;
        validUntil: string;
        availableNow: string;
        rewards: {
          title: string;
          subtitle: string;
          myVault: string;
          redeemBtn: string;
          statusProcessing: string;
          statusReady: string;
          voucherDisclaimer: string;
          confirmRedeem: string;
          requestSuccess: string;
        };
      };
      bookings: { title: string; viewAll: string; empty: string; completed: string; actions: { confirm: string; complete: string; variation: string } };
      status: { pending: string; confirmed: string; completed: string; cancelled: string };
      variations: { label: string; status: string; pending: string; approved: string; rejected: string; arbiterActive: string };
      arbiterReasoning: string;
      tips: { title: string; growth: string };
      quickLinks: { title: string; schedule: string; earnings: string; support: string };
      modal: { title: string; amount: string; reason: string; reasonPlaceholder: string; photo: string; photoHint: string; submit: string; submitting: string };
      avatar: { upload: string; hint: string; success: string; errorSize: string };
      accounting: {
        title: string;
        subtitle: string;
        statusActive: string;
        statusInactive: string;
        grossRevenue: string;
        grossRevenueDesc: string;
        taxPayable: string;
        taxPayableDesc: string;
        vatRadar: string;
        vatRadarDesc: string;
        monthlyBreakdown: string;
        revenue: string;
        fees: string;
        netProfit: string;
        exportCsv: string;
        upgradeTitle: string;
        upgradeDesc: string;
        upgradeCost: string;
        upgradeBtn: string;
        taxYear: string;
        regNumber: string;
      };
    };
    portfolio_mgr: {
      title: string; subtitle: string; addBtn: string; emptyTitle: string; emptyDesc: string;
      modal: { title: string; itemTitle: string; itemTitlePlaceholder: string; category: string; uploadPhoto: string; errorSize: string; details: string; aiBtn: string; aiGenerating: string; detailsPlaceholder: string; cancel: string; publish: string };
      deleteConfirm: string; addError: string; aiError: string;
    };
  };
  education_sec: {
    hero: { badge: string; title1: string; title2: string; subtitle: string; searchPlaceholder: string; searchBtn: string };
    forYou: { title: string; match: string; viewProfile: string };
    categories: { title: string; browseBtn: string; items: Record<string, { title: string; desc: string }> };
    search: { filters: string; mode: string; online: string; offline: string; hybrid: string; priceRange: string; level: string; student: string; pro: string; expert: string; apply: string; resultsTitle: string; foundCount: string; placeholder: string };
    common: { reviews: string; hr: string; bookTrial: string };
    tutorCard: { demoDesc: string };
    tutorProfile: { 
      verified: string; about: string; education: string; experience: string; portfolio: string; reviews: string; availability: string; bookNow: string; 
      aiTrial: string; trialChallenge: string; startChallenge: string; cancel: string;
      loadingChallenge: string; analyzing: string; questionLabel: string; of: string; explanation: string; nextQuestion: string; finishChallenge: string;
      scoreResult: string; assessment: string; 
      assessmentLevels: { excellent: string; progress: string; starting: string };
      assessmentDesc: string; bookFirstLesson: string; tryAgain: string;
    };
    visitDashboard: string;
  };
  home: {
    hero: { badge: string; title1: string; title2: string; subtitle: string; searchPlaceholder: string; locationPlaceholder: string; aiMatch: string; searchBtn: string; suggestions: string[]; popularLabel: string; popularTags: string[] };
    recommendation: { title1: string; title2: string; subtitle: string; browse: string };
    recommendationResults: {
      trendingTitle: string;
      topRatedTitle: string;
      ukWideTitle: string;
      professionalTitle: string;
      homeRepair: string;
      deepCleaning: string;
      accounting: string;
      autoRepair: string;
      homeSub: string;
      cleanSub: string;
      accountSub: string;
      autoSub: string;
      assetMatch: string;
      trending: string;
    };
    aiCTA: { badge: string; title1: string; title2: string; subtitle: string; button: string };
    referralCTA: { badge: string; title: string; subtitle: string; button: string; referralLabel: string; voucherDisclaimer: string };
    educationCTA: string;
    eliteLocal: string;
    eliteBadge: string;
    defaultCategory: string;
    noResults: string;
    trustedBy: string;
    categories: Record<string, string>;
    sections: Record<string, { title: string; desc: string; items: string[] }>;
    popularTitle: string; popularIn: string; allUK: string;
    noProjects: { title: string; desc: string };
    reviews: { excellent: string; basedOn: string; verified: string; countLabel: string };
    howItWorks: {
      title: string;
      subtitle: string;
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
      step4Title: string;
      step4Desc: string;
    };
  };
  location: { selectCity: string; detecting: string; switch: string; nearby: string };
  diagnosis: {
    badge: string; title1: string; title2: string; subtitle: string;
    features: Record<string, { title: string; desc: string }>;
    cta: string;
    tool: {
      title: string; subtitle: string; step1: string; step2: string; step3: string; uploadHint: string; replaceHint: string;
      submit: string; loading: string; disclaimer: string; newDiagnosis: string; categories: Record<string, string>;
      resultTitle: string; detectedIssue: string; recommendedSolution: string; estimatedCostLabel: string;
      ukStandard: string; includesLabor: string; bookSpecialist: string; confidence: string; analyzedPhoto: string;
      guaranteedRepairs: string; disputeResolution: string; fastTurnaround: string; responseHours: string;
      errorPhotoCategory: string; errorUnexpected: string; uploadFormatHint: string; descriptionPlaceholder: string;
      strictMode: string; strictModeHint: string;
      authRequired: string; limitReached: string; limitReachedHint: string; remaining: string; findSpecialist: string;
    };
  };
  onboarding: {
    hero: { title: string; subtitle: string };
    steps: { profile: string; credentials: string; contract: string };
    sectors: { title: string; professional: { title: string; desc: string; industries: string[] }; education: { title: string; desc: string; industries: string[] }; technical: { title: string; desc: string; industries: string[] } };
    contract: { title: string; scrollingNotice: string; agree: string; clauses: { platform_fee: { title: string; body: string }; payments: { title: string; body: string }; conduct: { title: string; body: string } } };
    buttons: { start: string; next: string; back: string; submit: string };
  };
  admin: {
    sidebar: { overview: string; analytics: string; bookings: string; verifications: string; disputes: string; merchants: string; payouts: string; users: string; settings: string; terminal: string };
    header: { internal: string; operations: string; node: string };
    stats: {
      gmv: string;
      netRevenue: string;
      bookings: string;
      dailyAvg: string;
      processed: string;
      volume24h: string;
      syncing: string;
    };
    analytics: { gmvTitle: string; gmvSub: string; sectorDist: string; volTitle: string; live: string };
    bookings: { title: string; sub: string; search: string; id: string; customer: string; amount: string; status: string; service: string };
    verifications: { 
      title: string; 
      sub: string; 
      evidence: string; 
      extraction: string; 
      passport: string; 
      faceMatch: string; 
      confidence: string;
      fullName: string;
      idNumber: string;
      expiryDate: string;
      dob: string;
    };
    disputes: { title: string; sub: string; reasoning: string; gallery: string; verdict: string; confidence: string };
    payouts: { title: string; sub: string; snapshot: string; pending: string; volume: string; security: string; adjudication: string; method: string };
    users: { title: string; sub: string; stats: string; registeredAt: string; referrals: string };
    commissions: { 
      title: string; 
      sub: string; 
      plateformFee: string; 
      marketplaceFee: string; 
      adminControl: string;
      weightedAvg: string;
      totalJobs: string;
      deliveryVolume: string;
      merchantDetails: string;
    };
    disputes_mgr: { empty: string; viewDetails: string; status: { open: string; processing: string; settled: string } };
    merchants_mgr: { empty: string; status: { active: string; suspended: string; pending: string } };
    settings_mgr: {
      title: string;
      sub: string;
      companyInfo: string;
      socialLinks: string;
      legalLinks: string;
      tabs: {
        branding: string;
        contact: string;
        legal: string;
        social: string;
      };
      fields: {
        companyName: string;
        aboutUs: string;
        logoUrl: string;
        officeAddress: string;
        contactPhone: string;
        contactEmail: string;
        companyRegistration: string;
        vatRegistration: string;
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
      };
      save: string;
      saving: string;
      success: string;
      error: string;
    };
  };
  auth: {
    login: {
      title: string;
      subtitle: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      forgotPassword: string;
      submit: string;
      loading: string;
      or: string;
      google: string;
      navToRegister: string;
      createAccount: string;
      error: string;
      success: string;
    },
    register: {
      title: string;
      subtitle: string;
      firstNameLabel: string;
      lastNameLabel: string;
      emailLabel: string;
      emailPlaceholder: string;
      accountTypeLabel: string;
      passwordLabel: string;
      passwordHint: string;
      referralLabel: string;
      referralPlaceholder: string;
      submit: string;
      loading: string;
      or: string;
      google: string;
      navToLogin: string;
      signIn: string;
      roles: { customer: string; merchant: string };
    },
    forgotPassword: {
      title: string;
      subtitle: string;
      emailLabel: string;
      emailPlaceholder: string;
      submit: string;
      loading: string;
      back: string;
      success: string;
      error: string;
      successDetail: string;
    },
    resetPassword: {
      title: string;
      subtitle: string;
      passwordLabel: string;
      confirmPasswordLabel: string;
      submit: string;
      loading: string;
      back: string;
      success: string;
      invalidToken: string;
      notMatch: string;
      error: string;
      successDetail: string;
      invalidTokenDetail: string;
      requestNewLink: string;
    },
    errors: {
      missingFields: string;
      passwordTooShort: string;
      emailExists: string;
      invalidCredentials: string;
      serverError: string;
      resetFailed: string;
      invalidReset: string;
    },
    loading: {
      preparing: string;
      initializing: string;
    }
  };
}

export const dictionaries: Record<string, Dictionary> = {
  en,
  "zh-TW": zhTW,
  hi,
  ar,
  ja,
  ko,
  pl,
  ro,
  ur,
  pa,
};

export const getDictionary = (lang: string) => {
  return dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
};

export type Locale = keyof typeof dictionaries;
