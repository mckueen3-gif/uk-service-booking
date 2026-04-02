import { Dictionary } from '../dictionary';

export const en: Dictionary = {
  nav: { 
    browse: "Browse Services", join: "Join as Expert", login: "Sign In", logout: "Logout", 
    dashboard: "My Dashboard", aiDiagnosis: "AI Diagnosis", education: "Education" 
  },
  common: { viewProfile: "View Profile", reviews: "reviews", hr: "hr", copy: "Copy", copied: "Copied!" },
  hero: { title: "Find the Best Service Providers", subtitle: "Connect with certified professionals in your area.", searchPlaceholder: "What service do you need?", badge: "UK's #1 Service Marketplace" },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about the UK Service Booking Platform.",
    categories: { payments: "Payments", disputes: "Disputes", bookings: "Bookings" },
    aura: { title: "Aura AI Assistant", subtitle: "Need instant help? Chat with Aura for personalized advice.", cta: "Chat with Aura" },
    questions: {
      payments: [
        { q: "How do I pay for services?", a: "Payments are handled securely via Stripe. We hold funds in escrow until the job is confirmed complete." },
        { q: "Are there any hidden fees?", a: "No. You pay the quoted price. We charge a small platform fee already included in the estimate." }
      ],
      disputes: [
        { q: "What if the work is unsatisfactory?", a: "Our AI Arbiter reviews photos of the work against the initial scope to ensure fair resolution." },
        { q: "How do I request a refund?", a: "You can open a dispute through your dashboard if the merchant fails to meet the agreed terms." }
      ],
      bookings: [
        { q: "Can I cancel a booking?", a: "Yes, you can cancel up to 24 hours before the scheduled time for a full refund." },
        { q: "How do I contact my specialist?", a: "Once a booking is confirmed, you'll have access to a direct secure chat channel." }
      ]
    }
  },
  footer: { tagline: "Connect with the UK's top certified professionals.", explore: "Explore", legal: "Legal", support: "Support", rights: "© 2024 UK Service Hub. All rights reserved.", terms: "Terms of Service", privacy: "Privacy Policy", cookies: "Cookie Policy", help: "Help Center", contact: "Contact Support", aiDiagnosis: "AI Diagnostics", homeCleaning: "Home Cleaning", plumbingServices: "Plumbing Services", automotiveServices: "Automotive Services" },
  search: { 
    filters: "Filters", keyword: "Keyword", location: "Location", category: "Category", minRating: "Min Rating", verifiedOnly: "Verified Only", 
    apply: "Apply Filters", sortBy: "Sort By", sortRating: "Rating", sortJobs: "Jobs Done", sortDistance: "Distance", sortPrice: "Price", 
    foundCount: "Found {{count}} specialists", searching: "Searching professionals...", noResults: "No specialists matches", 
    noResultsHint: "Try adjusting your filters or searching in a different area.", clearFilters: "Clear all", 
    basePrice: "Est. Starting Price", viewDetails: "View Details", listView: "List", mapView: "Map", searchThisArea: "Search this area",
    verified: "Verified", insured: "Insured", priceAudit: "AI Price Audit: Fair", defaultDesc: "Professional Service Provider"
  },
  booking: {
    steps: { details: "Job Details", schedule: "Schedule", confirmation: "Review & Pay" },
    titles: { details: "Tell us about the job", schedule: "Pick a time that works", confirm: "Confirm your booking", success: "Booking Confirmed!" },
    labels: { date: "Date", time: "Time", make: "Make", model: "Model", address: "Property Address", notes: "Extra instructions", agree: "I agree to the terms and 2% platform fee", summary: "Payment Summary", paid: "Paid", merchant: "Specialist", service: "Service" },
    buttons: { next: "Continue", prev: "Go Back", pay: "Pay Securely", home: "Return Home", dashboard: "Go to Dashboard" },
    messages: { finalizing: "Finalizing your booking...", wait: "Please don't refresh the page", contact24h: "Your specialist will contact you within 24 hours.", safety: "All payments are held in escrow for your safety.", noReviews: "No reviews yet", recommended: "Top Recommended", replyFromMaster: "Reply from Master" },
  },
  merchant: {
    verified: "Verified Expert", background: "Background Checked", portfolio: "Previous Work", reviewTitle: "Customer Reviews", realReviews: "Real reviews from verified bookings", verifiedBooking: "Verified Booking", pricingAnalysis: "AI Pricing Analysis", bookingChannel: "Professional Booking Channel", viewServices: "View All Services", guarantee: "Service Guarantee", fastResponse: "Fast Response", contactExpert: "Contact Expert", noReviews: "No reviews yet", reply: "Reply",
    dashboard: {
      title: "Merchant Console", welcome: "Welcome back,", previewProfile: "Preview Public Profile", manageServices: "Manage Services",
      stats: { totalBookings: "Lifetime Bookings", rating: "Avg Rating", pendingBalance: "Pending Settlement", availableBalance: "Available for Payout", totalJobs: "Total Jobs", escrowHeld: "Held in Escrow", availableNow: "Available Now", reviews: "Reviews" },
      syncStatus: "Sync Status",
      lastSynced: "Last Synced",
      refresh: "Refresh",
      syncing: "Syncing data...",
      syncFailed: "Sync failed, please retry",
      wallet: {
        syncing: "Syncing wallet data...",
        synced: "Wallet data synced",
        generating: "Finalizing account setup...",
        referralTitle: "Refer a friend, get 2% cashback",
        referralDesc: "Share your unique code. When your friend books their first service, you'll earn 2% back.",
        historyTitle: "Transaction History",
        historyEmpty: "No transactions found",
        type: "Type",
        description: "Description",
        amount: "Amount",
        date: "Date",
        referralListTitle: "My Referral Record",
        referralListDesc: "Track your passive income from friends you've invited",
        referee: "Referred User",
        earned: "Total Earned",
        expiry: "Commission Expiry",
        status: "Status",
        active: "Active",
        expired: "Expired",
        joinedAt: "Joined at",
        validUntil: "Valid until",
        availableNow: "Available Now"
      },
      bookings: { title: "Recent Appointments", viewAll: "View All Bookings", empty: "No recent bookings", completed: "Completed", actions: { confirm: "Confirm", complete: "Mark Complete", variation: "Request Extra" } },
      status: { pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" },
      variations: { label: "Extra Work Request", status: "Status", pending: "Waiting for Customer", approved: "Approved", rejected: "Rejected", arbiterActive: "AI Arbiter Reviewing" },
      arbiterReasoning: "AI Arbiter Analysis",
      tips: { title: "Growth Tips", growth: "Complete 5 more jobs to reach 'Gold' status and reduce commission to 7%." },
      quickLinks: { title: "Quick Links", schedule: "My Schedule", earnings: "Earnings History", support: "Merchant Support" },
      modal: { title: "Request Extra Work Payment", amount: "Additional Amount (£)", reason: "Reason for variable cost", reasonPlaceholder: "e.g., Found additional leak behind wall", photo: "Photo Proof", photoHint: "A photo of the issue is mandatory for AI verification", submit: "Send Request", submitting: "Uploading Proof..." },
      avatar: { upload: "Upload Profile Photo", hint: "Recommended: Professional headshot or company logo.", success: "Avatar updated!", errorSize: "Image must be under 2MB" },
    },
    portfolio_mgr: {
      title: "Case Portfolio", subtitle: "Showcase your best work to win more bookings.", addBtn: "Add Portfolio Item", emptyTitle: "No cases added yet", emptyDesc: "Add photos of your past projects to build trust with new customers.",
      modal: { title: "Add Portfolio Case", itemTitle: "Project Title", itemTitlePlaceholder: "e.g., Combi Boiler Installation", category: "Category", uploadPhoto: "Upload Case Photo", errorSize: "Photo must be under 5MB", details: "Project Details", aiBtn: "Generate with AI", aiGenerating: "AI Writing...", detailsPlaceholder: "Describe the work done, challenges, and outcome.", cancel: "Cancel", publish: "Publish Case" },
      deleteConfirm: "Are you sure you want to delete this case?", addError: "Failed to add portfolio item.", aiError: "AI generation failed. Please type manually."
    },
  },
  education_sec: {
    hero: { badge: "UK Elite Tutors", title1: "Master New Skills", title2: "With Global Experts", subtitle: "Connect with top-tier tutors for academics, languages, and professional skills. Tailored 1-on-1 learning designed for your success.", searchPlaceholder: "What do you want to learn?", searchBtn: "Find Tutors" },
    forYou: { title: "Recommended for You", match: "AI Match Score", viewProfile: "View Profile" },
    categories: { title: "Explore Categories", browseBtn: "Browse All", items: { academic: { title: "Academic Hub", desc: "IELTS, GCSE, A-Levels & more" }, languages: { title: "Language Lab", desc: "English, Chinese, Spanish..." }, coding: { title: "Code Academy", desc: "Python, Web Dev, AI..." }, music: { title: "Music & Art", desc: "Piano, Design, Fine Arts" } } },
    search: { filters: "Search Filters", mode: "Teaching Mode", online: "Online", offline: "In-Person", hybrid: "Hybrid", priceRange: "Hourly Rate", level: "Tutor Level", student: "Student", pro: "Professional", expert: "Master/PhD", apply: "Apply Filters", resultsTitle: "Available Tutors", foundCount: "{{count}} tutors matching", placeholder: "Search by subject or name" },
    common: { reviews: "Reviews", hr: "hr", bookTrial: "Book Trial" },
    tutorCard: { demoDesc: "Passionate educator with a PhD and over 10 years of experience helping 100+ students achieve their goals." },
    tutorProfile: { verified: "Verified Educator", about: "About Me", education: "Education", experience: "Teaching Experience", portfolio: "Student Success Stories", reviews: "Student Reviews", availability: "Weekly Schedule", bookNow: "Book a Lesson", aiTrial: "AI Evaluation Trial", trialChallenge: "Attempt the AI subject challenge for a session discount!", startChallenge: "Start Challenge", cancel: "Cancel" }
  },
  home: {
    hero: { badge: "Certified UK Local Masters", title1: "Book Top-Rated", title2: "Local Experts", subtitle: "Instant access to the top 1% of UK service professionals. Verified, insured, and AI-monitored for guaranteed quality.", searchPlaceholder: "I need a...", locationPlaceholder: "London, UK", aiMatch: "Smart Match", searchBtn: "Search Experts" },
    recommendation: { title1: "Personalized", title2: "For You", subtitle: "Top specialists matching your recent needs and location.", browse: "Browse All Specialists" },
    aiCTA: { badge: "GEMINI AI POWERED", title1: "Not Sure What's wrong?", title2: "Get Instant Diagnosis", subtitle: "Upload a photo of your issue. Our AI identifies the problem, estimates costs, and finds the right specialist in seconds.", button: "Try Free AI Diagnosis" },
    referralCTA: { badge: "Referral Rewards", title: "Earn 2% Passive Income", subtitle: "Refer a friend and get 2% of every booking they make for the next 5 years (up to £200 per friend).", button: "Start Earning Commission", referralLabel: "Your Personal Referral Code:" },
    educationCTA: "Visit Education Dashboard",
    eliteLocal: "Elite Local",
    eliteBadge: "Elite Pro",
    defaultCategory: "Service Expert",
    noResults: "No specialists found in this category.",
    categories: { plumbing: "Plumbing", repairs: "Repairs", renovation: "Renovation", education: "Education", accounting: "Accounting", legal: "Legal", commercial: "Commercial", cleaning: "Cleaning", car: "Automotive" },
    sections: {
      plumbing: { title: "Plumbing & Electrical", desc: "From emergency leaks to full rewiring, we connect you with certified UK masters.", items: ["Pipe Repair", "Rewiring", "Appliance Install", "Boiler Service", "Switches", "Smart Home"] },
      repairs: { title: "Home Handyman", desc: "Assembly, wall patching, door replacement - all the annoying home tasks solved.", items: ["Furniture Assembly", "Door/Window", "Wall Patching", "Shelving", "Painting", "Handy Tasks"] },
      accounting: { title: "Accounting & Tax", desc: "Tailored for UK overseas residents and SMEs. Compliant filing for your business.", items: ["Income Tax", "Annual Accounts", "VAT Filing", "Payroll", "Xero Consult", "Tax Analysis"] },
      renovation: { title: "Home Renovation", desc: "Kitchen extensions to full renovations. Transparent progress and quality guarantee.", items: ["Kitchen/Bath", "Extensions", "Interior Design", "Painting", "Flooring", "Landscaping"] },
      education: { title: "Education & Learning", desc: "1-on-1 tutors and professional training. Tailored progress at your fingertips.", items: ["Language Tutors", "IELTS/TOEFL", "Coding", "Music & Art", "Business Skills", "Academic Help"] },
      cleaning: { title: "Professional Cleaning", desc: "End-of-tenancy deep clean or regular home cleaning with attention to detail.", items: ["Regular Clean", "End of Tenancy", "Carpet Clean", "Window Clean", "Office Clean", "Disinfection"] },
      legal: { title: "Legal Consulting", desc: "Compliance, visas, and legal documentation. Contact experts to protect your rights.", items: ["Contract Drafting", "Visa Advice", "Property Law", "Dispute Resolution", "Business Law", "Notary"] },
      commercial: { title: "Commercial Services", desc: "Built for business spaces. Shopfitting, office moves, and electrical maintenance.", items: ["Shopfitting", "Office Relocation", "Commercial Electric", "Fire Safety", "IT Networking", "HVAC"] }
    },
    popularTitle: "Popular", popularIn: "in", allUK: "All UK",
    noProjects: { title: "No projects found in this category", desc: "We are actively recruiting top experts in your area." },
    reviews: { excellent: "Excellent", basedOn: "based on", verified: "Verified", countLabel: "reviews" }
  },
  location: { selectCity: "Select City", detecting: "Detecting...", switch: "Switch", nearby: "Nearby Services" },
  diagnosis: {
    badge: "DRIVEN BY GEMINI AI",
    title1: "Expert Repair",
    title2: "In Seconds",
    subtitle: "Stop guessing. Our AI analyzes your photos to provide instant insights, repair scopes, and fair UK price estimates before you book.",
    features: {
      instant: { title: "Instant Insights", desc: "No more waiting for callbacks. Get a technical analysis immediately after uploading." },
      pricing: { title: "Fair Market Pricing", desc: "We use real-world UK service data to provide accurate price ranges for your area." },
      verified: { title: "Certified Pre-Booking", desc: "After diagnosis, connect directly with the top 1% of experts specialized in your issue." }
    },
    cta: "Browse All Services",
    tool: {
      title: "Instant AI Diagnosis",
      subtitle: "Upload a photo and let our AI estimate repair cost and scope.",
      step1: "1. Upload Photo Proof",
      step2: "2. Select Category",
      step3: "3. Describe Issue (Optional)",
      uploadHint: "Take or upload photo",
      replaceHint: "Click to replace photo",
      submit: "Generate Free AI Diagnosis",
      loading: "Generating AI Insights...",
      disclaimer: "AI estimates are for guidance only. Official quotes provided by professionals.",
      newDiagnosis: "New Diagnosis",
      categories: { plumbing: "Plumbing", auto: "Automotive", renovation: "Renovation", electrical: "Electrical", cleaning: "Professional Cleaning" },
      resultTitle: "AI Diagnosis Results",
      detectedIssue: "Detected Issue",
      recommendedSolution: "Recommended Solution",
      estimatedCostLabel: "Estimated Price Range",
      ukStandard: "UK Standard Pricing",
      includesLabor: "Includes parts & labor",
      bookSpecialist: "Book This Specialist",
      confidence: "Confidence",
      analyzedPhoto: "Analyzed Photo",
      guaranteedRepairs: "Guaranteed Repairs",
      disputeResolution: "Dispute Resolution Support",
      fastTurnaround: "Fast Turnaround",
      responseHours: "Specialists in {category} typically respond within 2 hours.",
      errorPhotoCategory: "Please upload a photo and select a category.",
      errorUnexpected: "An unexpected error occurred: ",
      uploadFormatHint: "Supported formats: JPG, PNG, WebP (Max 10MB)",
      descriptionPlaceholder: "Optional: Describe the problem to help the AI understand (e.g., 'The pipe started leaking after a heavy rain' or 'The engine makes a clicking sound')",
      strictMode: "Strict Vision Mode",
      strictModeHint: "High-fidelity visual reasoning (Deep analysis)"
    }
  },
  onboarding: {
    hero: { title: "Grow Your Business with ServiceHub", subtitle: "Join the UK's most elite network of certified service professionals." },
    steps: { profile: "Business Profile", credentials: "UK Credentials", contract: "Service Agreement" },
    sectors: { title: "Select Your Sector", professional: { title: "Professional", desc: "Accounting, Legal, Consulting", industries: ["Accounting", "Tax Consulting", "Legal Services", "Business Strategy"] }, education: { title: "Education", desc: "Tutors, Trainers, Coaches", industries: ["Academic Tutors", "Language Training", "Skill Coaching", "Music Teachers"] }, technical: { title: "Technical", desc: "Trades, Repairs, Engineering", industries: ["Plumbing", "Electrical", "Automotive", "Renovation"] } },
    contract: { title: "Standard Service Agreement", scrollingNotice: "Please scroll to the bottom to accept the terms.", agree: "I have read and agree to the ServiceHub Master Agreement.", clauses: { platform_fee: { title: "1. Platform Service Fee", body: "ServiceHub charges an 9% commission on successfully completed bookings." }, payments: { title: "2. Escrow & Payouts", body: "Customer payments are held in secure escrow. Payouts are triggered 48 hours after the customer confirms job completion." }, conduct: { title: "3. Professional Standards", body: "Experts must maintain a minimum 4.0-star rating. Failure to meet UK safety standards may result in immediate account suspension." } } },
    buttons: { start: "Get Started", next: "Next Step", back: "Prev Step", submit: "Complete Onboarding" }
  }
};
