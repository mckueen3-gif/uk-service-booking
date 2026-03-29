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
    id: 'home_gas_cert',
    category: 'Plumbing',
    name: 'Landlord Gas Safety Certificate (CP12)',
    description: 'Legislative safety check for rental properties.',
    defaultPrice: 75,
    isMonthly: false
  },

  // Education & Learning
  {
    id: 'edu_academic',
    category: 'Education',
    name: '1-on-1 GCSE/A-Level Tutoring',
    description: 'Personalized academic support for UK national curriculum subjects.',
    defaultPrice: 40,
    isMonthly: false
  },
  {
    id: 'edu_ielts',
    category: 'Education',
    name: 'IELTS/TOEFL English Prep',
    description: 'Intensive English language preparation for international exams.',
    defaultPrice: 45,
    isMonthly: false
  },
  {
    id: 'edu_music',
    category: 'Education',
    name: 'Piano/Guitar Lesson (60 min)',
    description: 'Private music tuition for all levels with experienced instructors.',
    defaultPrice: 35,
    isMonthly: false
  },
  {
    id: 'edu_coding',
    category: 'Education',
    name: 'Coding Bootcamp Part-time (Monthly)',
    description: 'Guided project-based learning in Python, Java, or Web Development.',
    defaultPrice: 250,
    isMonthly: true
  }
];

export function getTemplatesByCategory(category: string) {
  return SERVICE_TEMPLATES.filter(t => t.category === category || (category === 'Accounting' && t.category === 'Accounting'));
}
