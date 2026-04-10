export interface ServiceTemplate {
  id: string;
  category: string;
  name: string;
  description: string;
  defaultPrice: number;
  isMonthly?: boolean;
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  // Accounting & Tax
  {
    id: 'tax_vat',
    category: 'Accounting',
    name: 'VAT Return Filing',
    description: 'Quarterly VAT preparation and submission via Making Tax Digital (MTD) software.',
    defaultPrice: 150,
    isMonthly: false
  },
  {
    id: 'tax_sa',
    category: 'Accounting',
    name: 'Self-Assessment Tax Return',
    description: 'Preparation and filing of your personal UK tax return for sole traders or directors.',
    defaultPrice: 200,
    isMonthly: false
  },
  {
    id: 'acc_annual',
    category: 'Accounting',
    name: 'Annual Statutory Accounts',
    description: 'Year-end accounts preparation and filing with Companies House and HMRC.',
    defaultPrice: 500,
    isMonthly: false
  },
  {
    id: 'acc_monthly',
    category: 'Accounting',
    name: 'Monthly Bookkeeping Package',
    description: 'Ongoing bank reconciliation, expense tracking, and monthly management reports.',
    defaultPrice: 80,
    isMonthly: true
  },
  {
    id: 'acc_payroll',
    category: 'Accounting',
    name: 'Payroll Management',
    description: 'Monthly PAYE, pension auto-enrolment, and payslip generation for up to 5 employees.',
    defaultPrice: 50,
    isMonthly: true
  },

  // Automotive
  {
    id: 'auto_mot',
    category: 'Automotive',
    name: 'MOT Test',
    description: 'Standard UK Ministry of Transport roadworthiness test.',
    defaultPrice: 54.85,
    isMonthly: false
  },
  {
    id: 'auto_service',
    category: 'Automotive',
    name: 'Full Vehicle Service',
    description: 'Comprehensive 50-point check including oil and filter change.',
    defaultPrice: 180,
    isMonthly: false
  },
  {
    id: 'auto_brakes',
    category: 'Automotive',
    name: 'Brake Disc & Pad Replacement',
    description: 'Professional fitting of new brake components for front or rear axle.',
    defaultPrice: 120,
    isMonthly: false
  },

  // Home Services (Plumbing/Electrical)
  {
    id: 'home_boiler',
    category: 'Plumbing',
    name: 'Boiler Annual Service',
    description: 'Gas Safe inspection and efficiency check for your domestic boiler.',
    defaultPrice: 85,
    isMonthly: false
  },
  {
    id: 'home_leak',
    category: 'Plumbing',
    name: 'Emergency Leak Repair',
    description: 'Rapid response for domestic water leaks, burst pipes, and flooding issues.',
    defaultPrice: 95,
    isMonthly: false
  },
  {
    id: 'home_plumb_install',
    category: 'Plumbing',
    name: 'Tap & Mixer Installation',
    description: 'Replacement and installation of kitchen or bathroom taps and mixers.',
    defaultPrice: 65,
    isMonthly: false
  },
  {
    id: 'home_gas_cert',
    category: 'Plumbing',
    name: 'Landlord Gas Safety Certificate (CP12)',
    description: 'Legislative safety check for rental properties.',
    defaultPrice: 75,
    isMonthly: false
  },
  {
    id: 'home_eicr',
    category: 'Electrical',
    name: 'Electrical Safety Inspection (EICR)',
    description: 'Complete inspection and testing of fixed wiring to ensure electrical safety.',
    defaultPrice: 160,
    isMonthly: false
  },
  {
    id: 'home_fusebox',
    category: 'Electrical',
    name: 'Consumer Unit (Fuse Box) Upgrade',
    description: 'Replacement of old fuse boxes with modern 18th Edition compliant consumer units.',
    defaultPrice: 450,
    isMonthly: false
  },
  {
    id: 'home_wiring',
    category: 'Electrical',
    name: 'Light Fitting & Socket Replacement',
    description: 'Installation of new light fixtures or replacement of faulty wall sockets.',
    defaultPrice: 55,
    isMonthly: false
  },
  {
    id: 'home_ev_charger',
    category: 'Electrical',
    name: 'Home EV Charger Installation',
    description: 'Installation of certified electric vehicle charging points at domestic properties.',
    defaultPrice: 750,
    isMonthly: false
  },

  // Education & Learning
  {
    id: 'edu_academic',
    category: 'Education',
    name: 'Academic Excellence: GCSE/A-Level Prep',
    description: 'Personalized 1-on-1 support for UK national curriculum subjects with subject specialists.',
    defaultPrice: 45,
    isMonthly: false
  },
  {
    id: 'edu_stem',
    category: 'Education',
    name: 'STEM & AI: Coding & Data Science',
    description: 'Expert-led technical training in Python, Generative AI, Robotics, and Computer Science.',
    defaultPrice: 60,
    isMonthly: false
  },
  {
    id: 'edu_sen',
    category: 'Education',
    name: 'Special Education (SEN): ADHD/Autism Support',
    description: 'Specialized 1-on-1 learning support for students with neurodiverse needs (ADHD, ASD, Dyslexia).',
    defaultPrice: 55,
    isMonthly: false
  },
  {
    id: 'edu_ielts',
    category: 'Education',
    name: 'Global Languages: IELTS/Business English',
    description: 'Intensive preparation for IELTS, Duolingo, or Business English with native-level experts.',
    defaultPrice: 40,
    isMonthly: false
  },
  {
    id: 'edu_career',
    category: 'Education',
    name: 'Career Strategy: Interview & MBA Prep',
    description: 'High-end coaching for investment banking, consulting, and MBA application strategies.',
    defaultPrice: 85,
    isMonthly: false
  },
  {
    id: 'edu_music',
    category: 'Education',
    name: 'Creative Arts: Instrument & Portfolio',
    description: 'Private music tuition (Piano/Guitar) or professional art portfolio development.',
    defaultPrice: 40,
    isMonthly: false
  }
];

export function getTemplatesByCategory(category: string) {
  return SERVICE_TEMPLATES.filter(t => t.category === category || (category === 'Accounting' && t.category === 'Accounting'));
}
