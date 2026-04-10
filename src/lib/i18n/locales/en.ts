import { Dictionary } from '../dictionary';

export const en: Dictionary = {
  nav: {
    browse: "Browse Services",
    join: "Join as Specialist",
    login: "Log In",
    register: "Register",
    logout: "Log Out",
    dashboard: "Console",
    aiDiagnosis: "AI Diagnostics",
    education: "Education"
  },
  common: {
    viewProfile: "View Protocol",
    reviews: "reviews",
    hr: "hr",
    copy: "Copy",
    copied: "Copied!"
  },
  hero: {
    title: "Accelerate Your Service Solutions",
    subtitle: "Connect with the UK's elite certified specialists for precision maintenance and professional services.",
    searchPlaceholder: "What service protocol do you require?",
    badge: "UK's Elite Service Ecosystem"
  },
  faq: {
    title: "Operational Protocols (FAQ)",
    subtitle: "Everything you need to know about the marketplace infrastructure.",
    categories: {
      payments: "Financial Settlement",
      disputes: "Arbitration",
      bookings: "Scheduling"
    },
    aura: {
      title: "Aura AI Coordinator",
      subtitle: "Require immediate arbitration or scheduling support? Connect with Aura.",
      cta: "Initialize Aura Session"
    },
    questions: {
      payments: [
        { q: "How are financial settlements processed?", a: "Payments are processed via secure Stripe relays. Funds are held in escrow until milestone confirmation." },
        { q: "Are there hidden overheads?", a: "No. The quoted rate is the net cost. A nominal platform fee is pre-integrated into the audit." }
      ],
      disputes: [
        { q: "What is the arbitration process for unsatisfactory results?", a: "Our AI Arbiter cross-references initial scope telemetry with photographic evidence for a neutral verdict." },
        { q: "Protocol for initiating a refund?", a: "You can trigger a dispute via your console if the specialist fails to meet the agreed Service Level Agreement (SLA)." }
      ],
      bookings: [
        { q: "Can I revoke a scheduled session?", a: "Yes. Revocations initiated >24 hours before the window qualify for full liquidity return." },
        { q: "How do I communicate with my assigned specialist?", a: "A secure, encrypted comms channel is provisioned upon scheduling confirmation." }
      ]
    }
  },
  aura: {
    welcome: "Greetings. I am Aura, your UK Service Coordinator. How may I assist your operations today?",
    offline: "Node Offline",
    ready: "Operational - Systems Ready",
    placeholder: "Transmit query to Aura...",
    error: "Signal interference detected. Unable to process query. Please retry.",
    footer: "Secure AI Diagnostics • Platform v1.2",
    suggestions: {
      refund: "Refund Protocol",
      dispute: "Initiate Arbitration",
      warranty: "SLA Terms",
      booking: "System Scheduling",
      refundQuery: "How do I apply for a refund? What is the process?",
      disputeQuery: "What should I do if there is a dispute over the quality of repair or price?",
      warrantyQuery: "Do services provided through the platform have a warranty?",
      bookingQuery: "How can I book a technician in my area?"
    }
  },
  footer: {
    tagline: "Connecting the UK's top 1% certified specialists.",
    explore: "Discovery",
    legal: "Governance",
    support: "Operations",
    rights: "© 2024 ConciergeAI Ecosystem. All Rights Reserved.",
    terms: "User Agreement",
    privacy: "Data Protocol",
    cookies: "Tracker Policy",
    help: "Support Node",
    contact: "Liaison",
    aiDiagnosis: "AI Diagnostics",
    homeCleaning: "Elite Cleaning",
    plumbingServices: "Precision Plumbing",
    automotiveServices: "Auto Engineering",
    trustSignal: "Verified Elite on Trustpilot",
    address: "London, UK",
    phone: "+44 20 1234 5678",
    email: "support@conciergeai.uk",
    aboutUs: "ConciergeAI connects the top 1% of UK certified specialists with discerning property owners.",
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
    filters: "Parameters",
    keyword: "Cortex Match",
    location: "Geocode",
    category: "Sector",
    minRating: "Threshold",
    verifiedOnly: "Verified Only",
    apply: "Execute Filter",
    sortBy: "Sequence By",
    sortRating: "Reputation",
    sortJobs: "Throughput",
    sortDistance: "Proximity",
    sortPrice: "Value",
    foundCount: "{{count}} Specialists Identified",
    searching: "Scanning Provider Database...",
    noResults: "No Matching Nodes Identified",
    noResultsHint: "Adjust parameters or expand your geofence.",
    clearFilters: "Reset Array",
    basePrice: "Est. Entry Rate",
    viewDetails: "Audit specialist",
    listView: "Matrix",
    mapView: "Spatial",
    searchThisArea: "Scan Current Zone",
    verified: "Certified",
    insured: "Indemnified",
    priceAudit: "AI Value Audit: Optimized",
    defaultDesc: "Specialist Provider"
  },
  booking: {
    steps: {
      details: "Scope",
      schedule: "Window",
      confirmation: "Settlement"
    },
    titles: {
      details: "Define Operational Scope",
      schedule: "Allocate Time Window",
      confirm: "Finalize Scheduling",
      success: "Confirmation Received"
    },
    labels: {
      date: "Timeline",
      time: "Window",
      make: "Manufacturer",
      model: "Hardware Model",
      address: "Property Node",
      notes: "Tactical Instructions",
      agree: "Accept SLA and 2% Ecosystem Fee",
      summary: "Settlement Summary",
      paid: "Processed",
      merchant: "Specialist",
      service: "Protocol"
    },
    buttons: {
      next: "Proceed",
      prev: "Revert",
      pay: "Initialize Secure Settlement",
      home: "Exit to Home",
      dashboard: "Access Console"
    },
    messages: {
      finalizing: "Encrypting booking data...",
      wait: "Maintain connection...",
      contact24h: "Your specialist will initialize contact within 24 hours.",
      safety: "For security, all settlements are managed via encrypted escrow.",
      noReviews: "No reputation data available",
      recommended: "Tier 1 Selection",
      replyFromMaster: "Lead Specialist Response"
    }
  },
  merchant: {
    verified: "Verified Elite",
    background: "Compliance Cleared",
    portfolio: "Operational History",
    reviewTitle: "Reputation Log",
    realReviews: "Verified Session Feedback",
    verifiedBooking: "Secured Transaction",
    pricingAnalysis: "AI Pricing Vectors",
    bookingChannel: "Direct Scheduling",
    viewServices: "Full Service Array",
    guarantee: "Operational Warranty",
    fastResponse: "Low Latency",
    contactExpert: "Initialize Liaison",
    noReviews: "No log entries",
    reply: "Response Transmitted",
    dashboard: {
      title: "Merchant Node",
      welcome: "Welcome back,",
      previewProfile: "Audit Public Node",
      manageServices: "Sector Management",
      stats: {
        totalBookings: "Aggregate Sessions",
        rating: "Reputation Avg",
        pendingBalance: "Unsettled Liquidity",
        availableBalance: "Liquid Capital",
        totalJobs: "Total Missions",
        escrowHeld: "Capital In Escrow",
        availableNow: "Liquid Now",
        reviews: "Feedback Count"
      },
      syncStatus: "Comms Sync",
      lastSynced: "Last Uplink",
      refresh: "Recalibrate",
      syncing: "Synchronizing...",
      syncFailed: "Sync Error. Retry uplink.",
      wallet: {
        syncing: "Updating Capital Ledger...",
        synced: "Ledger Synchronized",
        generating: "Finalizing account encryption...",
        referralTitle: "Expand Network, Earn 2% Overlay",
        referralDesc: "Distribute your unique node code. Earn 2% yield on all friend bookings.",
        historyTitle: "Transaction Archive",
        historyEmpty: "No financial logs",
        type: "Vector",
        description: "Payload",
        amount: "Capital",
        date: "Timestamp",
        referralListTitle: "Network Expansion Log",
        referralListDesc: "Track passive yields from invited nodes",
        referee: "Invited Node",
        earned: "Aggregate Yield",
        expiry: "SLA Expiration",
        status: "Node Status",
        active: "Operational",
        expired: "Terminated",
        joinedAt: "Entry Time",
        validUntil: "Valid Until",
        availableNow: "Liquid Now",
        rewards: {
          title: "Convert to Liquid Voucher",
          subtitle: "* Manual audit required. Codes issued <24h.",
          myVault: "Encrypted Card Vault",
          redeemBtn: "Extract Value",
          statusProcessing: "Processing...",
          statusReady: "Ready for Deployment",
          voucherDisclaimer: "Valid across major retail and payment meshes.",
          confirmRedeem: "Execute conversion to cash voucher? Verification <24h.",
          requestSuccess: "Request successful. Allocating code to your vault.",
        }
      },
      bookings: {
        title: "Active Sessions",
        viewAll: "All Transactions",
        empty: "No active missions",
        completed: "Finalized",
        actions: { confirm: "Validate", complete: "Mark Finalized", variation: "Req Scope Drift" }
      },
      status: { pending: "Pending Audit", confirmed: "Validated", completed: "Finalized", cancelled: "Revoked" },
      variations: { label: "Additional Settlement", status: "SLA Status", pending: "Awaiting Client Payload", approved: "Authorized", rejected: "Denied", arbiterActive: "AI Arbiter Reviewing" },
      arbiterReasoning: "AI Rationalization",
      tips: { title: "Strategic Growth", growth: "Complete 5 more missions to achieve 'Gold' status and reduce overhead to 7%." },
      quickLinks: { title: "Command Links", schedule: "Duty Roster", earnings: "Capital History", support: "Specialist Support" },
      modal: { title: "Initialize Scope Drift Settlement", amount: "Additional Capital (£)", reason: "Neutral Logic for Drift", reasonPlaceholder: "E.g., Subsurface leak detected behind firewall", photo: "Evidence Payload", photoHint: "Evidence is mandatory for AI verification", submit: "Transmit Request", submitting: "Uploading Payload..." },
      avatar: { upload: "Update Node Identity", hint: "Req: Professional headshot or Corporate Branding.", success: "Identity updated", errorSize: "Payload must be <2MB" }
    },
    portfolio_mgr: {
      title: "Operational Archive",
      subtitle: "Display mission results to increase scheduling probability.",
      addBtn: "Append Entry",
      emptyTitle: "Archive Empty",
      emptyDesc: "Document previous missions to establish network trust.",
      modal: {
        title: "Append Entry",
        itemTitle: "Mission Title",
        itemTitlePlaceholder: "E.g., Boiler Integration - City Node",
        category: "Sector",
        uploadPhoto: "Evidence Upload",
        errorSize: "Payload must be <5MB",
        details: "Mission Telemetry",
        aiBtn: "AI Synthesize",
        aiGenerating: "Synthesizing...",
        detailsPlaceholder: "Describe the operational scope, obstacles, and resolution.",
        cancel: "Abort",
        publish: "Transmit to Public Node"
      },
      deleteConfirm: "Confirm permanent deletion of this archive entry?",
      addError: "Failed to append entry.",
      aiError: "AI Synthesis failure. Manual input required."
    }
  },
  education_sec: {
    hero: {
      badge: "UK Elite Tutors",
      title1: "Master New Skillsets",
      title2: "With Leading Experts",
      subtitle: "Connect with elite tutors for academics, languages, and professional crafts. Personalized 1-on-1 knowledge transfer designed for your objectives.",
      searchPlaceholder: "What skillset do you wish to acquire?",
      searchBtn: "Scan Tutors"
    },
    forYou: {
      title: "Optimized for You",
      match: "AI Match Score",
      viewProfile: "Audit Profile"
    },
    categories: {
      title: "Explore Knowledge Hexagons",
      browseBtn: "Full Spectrum",
      items: {
        academic: { title: "Academic Excellence", desc: "GCSE, A-Levels, IB, 11+ Entrance Prep" },
        language: { title: "Global Languages", desc: "IELTS, Duolingo, Business English & more" },
        stem: { title: "STEM & AI", desc: "Python, Generative AI, Coding, Data Science" },
        arts: { title: "Creative Arts", desc: "Portfolio, Piano, Design, Fine Arts" },
        finance: { title: "Elite Certifications", desc: "CFA, ACCA, PMP, Professional Certs" },
        career: { title: "Career Strategy", desc: "Interview Prep, Leadership, MBA Strategy" },
        junior: { title: "Junior Scholars", desc: "Phonics, Logic, Talent Development" },
        masterclass: { title: "Knowledge Workshops", desc: "Investment, Lifestyle, Masterclasses" },
        sen: { title: "Special Education (SEN)", desc: "ADHD, Dyslexia, Autism, Mental Health" }
      }
    },
    search: {
      filters: "Search Parameters",
      mode: "Transfer Mode",
      online: "Online",
      offline: "Local",
      hybrid: "Hybrid",
      priceRange: "Hourly Rate",
      level: "Specialist Tier",
      student: "Academic Node",
      pro: "Professional Tutor",
      expert: "Masters/PhD",
      apply: "Execute Filter",
      resultsTitle: "Available Tutors",
      foundCount: "{{count}} Tutors Identified",
      placeholder: "Scan by Subject or ID"
    },
    common: {
      reviews: "reviews",
      hr: "hr",
      bookTrial: "Schedule Diagnostics"
    },
    tutorCard: {
      demoDesc: "Passionate PhD level tutor with 10+ years experience, helping 100+ students achieve their objectives."
    },
    tutorProfile: {
      verified: "Certified Tutor",
      about: "Knowledge Profile",
      education: "Academic Lineage",
      experience: "Mission History",
      portfolio: "Success Metrics",
      reviews: "Student Feedback",
      availability: "Operational Roster",
      bookNow: "Schedule Now",
      aiTrial: "AI Assessment Matrix",
      trialChallenge: "Academic Intelligence Challenge",
      startChallenge: "Start Challenge",
      cancel: "Abort",
      loadingChallenge: "AI Synthesizing Assessment...",
      analyzing: "Analyzing syllabus for {subject}",
      questionLabel: "Query",
      of: "of",
      explanation: "AI Logic:",
      nextQuestion: "Next Vector",
      finishChallenge: "Finalize Challenge",
      scoreResult: "Score Identified:",
      assessment: "AI Assessment:",
      assessmentLevels: {
        excellent: "Elite Basis",
        progress: "Growth Potential",
        starting: "Foundational"
      },
      assessmentDesc: "Your specialist has received the telemetry and will calibrate your session accordingly.",
      bookFirstLesson: "Schedule Initial Session",
      tryAgain: "Recalibrate"
    }
  },
  home: {
    hero: {
      badge: "Verified Local Professionals",
      title1: "Schedule Top-Rated",
      title2: "Local Experts",
      subtitle: "Instant access to the top 1% of UK service specialists. Verified, indemnified, and AI-monitored for precision quality.",
      searchPlaceholder: "I require...",
      locationPlaceholder: "London, UK",
      aiMatch: "Smart Match",
      searchBtn: "Liaison Search"
    },
    recommendation: {
      title1: "Optimized",
      title2: "For You",
      subtitle: "Top specialists matched to your telemetry and recent location.",
      browse: "Full Spectrum"
    },
    recommendationResults: {
      trendingTitle: "Trending in {{city}}: {{category}}",
      topRatedTitle: "Top-Rated in {{city}}: {{category}}",
      ukWideTitle: "UK Elite: {{category}}",
      professionalTitle: "Professional Protocols in {{city}}",
      homeRepair: "Home Maintenance",
      deepCleaning: "Sanitization",
      accounting: "Ledger & Legal",
      autoRepair: "Engineering",
      homeSub: "Trusted maintenance experts near your node",
      cleanSub: "High-integrity local sanitization experts",
      accountSub: "Elite accountants and legal assistants",
      autoSub: "Master mechanics for your hardware",
      assetMatch: "Asset Match",
      trending: "Network Trending"
    },
    aiCTA: {
      badge: "Powered by GEMINI AI",
      title1: "Unsure of the issue?",
      title2: "Execute AI Diagnostics",
      subtitle: "Upload evidence of your issue. Our AI identifies the fault, estimates the payload cost, and identifies the correct specialist in seconds.",
      button: "Start Free AI Audit"
    },
    referralCTA: {
      badge: "Network Rewards",
      title: "Earn 2% Ecosystem Passive Yield",
      subtitle: "Invite a node and receive 2% of every session they schedule for the next 5 years (up to £200 per node).",
      button: "Start Earning Yield",
      referralLabel: "Your Unique Node Code:"
    },
    educationCTA: "Access Education Dashboard",
    eliteLocal: "Local Elite",
    eliteBadge: "Elite Pro",
    defaultCategory: "Service Specialist",
    noResults: "No specialist nodes detected in this sector.",
    categories: { plumbing: "Plumbing", repairs: "Repairs", renovation: "Renovation", education: "Education", accounting: "Accounting", legal: "Legal", commercial: "B2B", cleaning: "Cleaning", car: "Auto" },
    sections: {
      plumbing: { title: "Plumbing & Electrical", desc: "From emergency leaks to full rewiring, we connect you with certified nodes.", items: ["Pipe Repair", "System Rewiring", "Appliance Integration", "Boiler Audit", "Switchgear", "Smart Automation"] },
      repairs: { title: "Maintenance", desc: "Hardware assembly, structural repair, fixture replacement - all household inefficiencies resolved.", items: ["Furniture Assembly", "Structural Fixtures", "Wall Remediation", "Modular Mounting", "Coating", "General Tactics"] },
      accounting: { title: "Ledger & Governance", desc: "Tailored for expats and SMEs. Providing compliant reporting for your operations.", items: ["Income Audit", "Annual Accounts", "Tax Filing", "Payroll Meshing", "Xero Optimization", "Fiscal Analysis"] },
      renovation: { title: "Structural Renovation", desc: "From module expansion to full re-engineering. Transparent telemetry and quality assurance.", items: ["Culinary/Sanitary", "Expansion Units", "Holographic Layout", "Coating", "Floor Meshing", "Landscape Design"] },
      education: { title: "Knowledge Transfer", desc: "1-on-1 tutoring and professional coaching. Personalized growth at your fingertips.", items: ["Language Tutors", "IELTS/TOEFL", "Code Synthesis", "Music & Arts", "Business Tactics", "Academic Support"] },
      cleaning: { title: "Professional Sanitization", desc: "End-of-occupancy decontamination or regular node maintenance with attention to detail.", items: ["Recurring Hygiene", "End of Tenancy", "Textile Cleaning", "Aperture Cleaning", "Office Sanitization", "Biosecurity"] },
      legal: { title: "Governance Counsel", desc: "Compliance, visa protocols, and legal frameworks. Connect with experts to protect your rights.", items: ["SLA Drafting", "Visa Calibration", "Property Frameworks", "Arbitration", "Marketplace Law", "Public Notary"] },
      commercial: { title: "B2B Infrastructure", desc: "Tailored for business zones. Shop fitting, office migration, and industrial maintenance.", items: ["Unit Fitting", "Node Relocation", "Industrial Power", "Fire Security", "IT Mesh", "HVAC"] }
    },
    popularTitle: "Popular", popularIn: "in", allUK: "Full UK",
    noProjects: { title: "No projects detected in this sector", desc: "We are actively recruiting Tier 1 specialists in your zone." },
    reviews: { excellent: "Elite", basedOn: "indexed on", verified: "Verified", countLabel: "logs" },
    howItWorks: {
      title: "How It Works",
      subtitle: "The UK's most advanced service booking protocol, powered by AI.",
      step1Title: "AI Diagnosis",
      step1Desc: "Upload issues for instant fault identification and precise cost estimation.",
      step2Title: "Smart Matching",
      step2Desc: "Our mesh network identifies the top 1% specialists calibrated for your specific node.",
      step3Title: "Escrow Security",
      step3Desc: "Payments are held in secure escrow until you confirm the operation is successful.",
      step4Title: "Service Guarantee",
      step4Desc: "Every session is monitored by AI for quality assurance and dispute resolution support."
    }
  },
  location: { selectCity: "Select Node", detecting: "Detecting...", switch: "Modify", nearby: "Proximal Services" },
  diagnosis: {
    badge: "By GEMINI AI",
    title1: "Specialist Audit",
    title2: "In Seconds",
    subtitle: "Stop speculating. Our AI analyzes your telemetry to provide instant insights, repair variables, and fair cost models before scheduling.",
    features: {
      instant: { title: "Instant Telemetry", desc: "End latency. Get technical analysis the moment you upload evidence." },
      pricing: { title: "Fair Market Model", desc: "We use live service data to provide precise cost ranges for your geofence." },
      verified: { title: "Verified Pre-Scheduling", desc: "Post-diagnosis, connect directly with the top 1% specialists calibrated for your issue." }
    },
    cta: "Scan All Protocols",
    tool: {
      title: "Instant AI Diagnostics",
      subtitle: "Upload evidence and let our AI estimate the cost and operational scope.",
      step1: "1. Upload Evidence Payload",
      step2: "2. Select Sector",
      step3: "3. Issue Parameters (Optional)",
      uploadHint: "Capture or upload payload",
      replaceHint: "Click to modify evidence",
      submit: "Execute Free AI Diagnostics",
      loading: "Synthesizing AI Audit...",
      disclaimer: "AI estimations are for guidance only. Official quotes are provided by specialists.",
      newDiagnosis: "New Audit Session",
      categories: { plumbing: "Plumbing", auto: "Engineering", renovation: "Renovation", electrical: "Electrical", cleaning: "Sanitization" },
      resultTitle: "AI Audit Result",
      detectedIssue: "Identified Fault",
      recommendedSolution: "Calibrated Resolution",
      estimatedCostLabel: "Est. Settlement Range",
      ukStandard: "UK Standard Baseline",
      includesLabor: "Includes modules & logic",
      bookSpecialist: "Schedule this Specialist",
      confidence: "Confidence Index",
      analyzedPhoto: "Analyzed Payload",
      guaranteedRepairs: "Guaranteed Resolution",
      disputeResolution: "Arbitration Support",
      fastTurnaround: "Low Latency",
      responseHours: "{category} specialists typically initialize within 2 hours.",
      errorPhotoCategory: "Please upload evidence and define sector.",
      errorUnexpected: "Unexpected system fault. Please retry uplink.",
      uploadFormatHint: "Supports JPG, PNG",
      descriptionPlaceholder: "Provide additional fault telemetry...",
      strictMode: "High-Precision Vision Node",
      strictModeHint: "Deep-learning visual reasoning (Analytic)",
      authRequired: "Members Only: Please log in to use AI Diagnosis", 
      limitReached: "Your daily limit (5/5) has been reached", 
      limitReachedHint: "You can contact our recommended specialists directly or try again tomorrow.", 
      remaining: "Remaining daily uses", 
      findSpecialist: "Contact a Specialist Now"
    }
  },
  onboarding: {
    hero: { title: "Scale your Operations with ConciergeAI", subtitle: "Join the elite network of UK certified service specialists." },
    steps: { profile: "Operational Profile", credentials: "Acreditations", contract: "SLA Framework" },
    sectors: { title: "Select Operational Sector", professional: { title: "Professional", desc: "Governance, Audit, Strategy", industries: ["Audit", "Fiscal Strategy", "Legal Frameworks", "Business Ops"] }, education: { title: "Education", desc: "Tutors, Mentors", industries: ["Academic Transfer", "Language Calibration", "Craft Coaching", "Music Master"] }, technical: { title: "Technical", desc: "Craft, Maintenance, Engineering", industries: ["Plumbing", "Power", "Engineering", "Structural"] } },
    contract: { title: "Standard Platform SLA", scrollingNotice: "Scroll to termination point to authorize terms.", agree: "I have reviewed and authorized the ConciergeAI Master Governance Agreement.", clauses: { platform_fee: { title: "1. Ecosystem Service Overhead", body: "The platform retains a 9% yield on successfully settled missions." }, payments: { title: "2. Escrow & Settlement", body: "Client payloads are held in secure escrow. Liquidity is released 48 hours after mission finalization confirmation." }, conduct: { title: "3. Specialist Standards", body: "Specialists must maintain a >4.0 reputation score. Failure to meet safety protocols results in immediate node termination." } } },
    buttons: { start: "Initialize Boarding", next: "Next Vector", back: "Revert", submit: "Complete Uplink" }
  },
  admin: {
    sidebar: { overview: "Overview", analytics: "Analytics", bookings: "Bookings", verifications: "Verifications", disputes: "Disputes", merchants: "Merchants", payouts: "Payouts", users: "Users", settings: "Settings", terminal: "Terminal" },
    header: { internal: "Internal Ops", operations: "Operations Dashboard", node: "Active Node" },
    stats: { gmv: "GMV", netRevenue: "Net Revenue", bookings: "Bookings", dailyAvg: "Daily Avg", processed: "Processed", volume24h: "24h Volume", syncing: "Syncing..." },
    analytics: { gmvTitle: "GMV", gmvSub: "Revenue Analytics", sectorDist: "Sector Dist", volTitle: "Market Volume", live: "Live" },
    bookings: { title: "Bookings", sub: "Live Transactions", search: "Search...", id: "ID", customer: "Customer", amount: "Amount", status: "Status", service: "Service" },
    verifications: { title: "Verifications", sub: "Background Checks", evidence: "Evidence", extraction: "Extraction", passport: "Passport", faceMatch: "Face Match", confidence: "Confidence", fullName: "Full Name", idNumber: "ID Number", expiryDate: "Expiry", dob: "DOB" },
    disputes: { title: "Disputes", sub: "Arbitration", reasoning: "Reasoning", gallery: "Gallery", verdict: "Verdict", confidence: "Confidence" },
    payouts: { title: "Payouts", sub: "Merchant Settlement", snapshot: "Snapshot", pending: "Pending", volume: "Volume", security: "Security", adjudication: "Adjudication", method: "Method" },
    users: { title: "Users", sub: "User Database", stats: "Stats", registeredAt: "Joined", referrals: "Referrals" },
    commissions: { title: "Commissions", sub: "Revenue Control", plateformFee: "Platform Fee", marketplaceFee: "Marketplace Fee", adminControl: "Admin Control", weightedAvg: "Weighted Avg", totalJobs: "Total Jobs", deliveryVolume: "Volume", merchantDetails: "Merchant Details" },
    disputes_mgr: { empty: "No pending disputes.", viewDetails: "Review", status: { open: "Open", processing: "Progress", settled: "Settled" } },
    merchants_mgr: { empty: "No experts found.", status: { active: "Active", suspended: "Suspended", pending: "Pending" } },
    settings_mgr: {
      title: "Global Mesh Configuration",
      sub: "Manage global branding, legal protocols, and contact vectors",
      companyInfo: "Company Information",
      socialLinks: "Social Profiles",
      legalLinks: "Legal Documents",
      tabs: { branding: "Branding", contact: "Liaison", legal: "Governance", social: "Social" },
      fields: { companyName: "Business Name", aboutUs: "Mission", logoUrl: "Logo URL", officeAddress: "Address", contactPhone: "Phone", contactEmail: "Email", companyRegistration: "Reg No", vatRegistration: "VAT ID", facebook: "FB", twitter: "X", instagram: "IG", linkedin: "LI" },
      save: "Update Active Settings",
      saving: "Syncing Platform...",
      success: "Configuration Persistent",
      error: "Protocol Error"
    }
  },
  auth: {
    login: {
      title: "Log in to your account",
      subtitle: "Sign in to ConciergeAI to manage your services and bookings.",
      emailLabel: "Email Address",
      emailPlaceholder: "example@concierge.ai",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot password?",
      submit: "Sign In",
      loading: "Signing in...",
      or: "or",
      google: "Sign in with Google",
      navToRegister: "New to the platform?",
      createAccount: "Register Now",
      error: "Login failed. Please check your credentials.",
      success: "Login successful. Redirecting to console."
    },
    register: {
      title: "Initialize Account",
      subtitle: "Join the ConciergeAI elite network.",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      emailLabel: "Email Address",
      emailPlaceholder: "example@concierge.ai",
      accountTypeLabel: "Node Role",
      passwordLabel: "Set Cipher",
      passwordHint: "Min. 6 characters",
      referralLabel: "Protocol Code (Optional)",
      referralPlaceholder: "e.g., ALPHA-99",
      submit: "Generate Account",
      loading: "Processing...",
      or: "or",
      google: "Register with Google",
      navToLogin: "Already have a node?",
      signIn: "Log in here",
      roles: { customer: "Client (Scan Services)", merchant: "Specialist (Provide Protocols)" }
    },
    forgotPassword: {
      title: "Cipher Recovery",
      subtitle: "Enter your identifier to receive recovery telemetry.",
      emailLabel: "Email Address",
      emailPlaceholder: "example@concierge.ai",
      submit: "Transmit Recovery Link",
      loading: "Transmitting...",
      back: "Return to Login",
      success: "Recovery telemetry transmitted to your email.",
      error: "Transmission failure. Verify identifier.",
      successDetail: "Secure recovery telemetry transmitted to {email}. Check your comms."
    },
    resetPassword: {
      title: "Cipher Calibration",
      subtitle: "Synchronize your new cipher below.",
      passwordLabel: "New Cipher",
      confirmPasswordLabel: "Confirm Cipher",
      submit: "Update Cipher",
      loading: "Updating...",
      back: "Return to Login",
      success: "Cipher synchronized successfully.",
      invalidToken: "Token expired or invalid.",
      notMatch: "Ciphers do not mesh. Retry.",
      error: "Protocol error. Contact support.",
      successDetail: "Cipher persistent. Redirecting to login...",
      invalidTokenDetail: "Provided calibration token is expired or invalid.",
      requestNewLink: "Request New Token"
    },
    errors: {
      missingFields: "Incomplete dataset. All fields required.",
      passwordTooShort: "Cipher must be >6 characters.",
      emailExists: "Identifier already persistent in registry.",
      invalidCredentials: "Login failed. Verify data.",
      serverError: "Internal system fault. Retry later.",
      resetFailed: "Failed to process request.",
      invalidReset: "Invalid or expired reset protocol."
    },
    loading: {
      preparing: "Calibrating session...",
      initializing: "Initializing mesh..."
    }
  }
};
