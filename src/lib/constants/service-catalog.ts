export interface ServiceItem {
  id: string;
  trade: string;
  vertical: 'utilities' | 'renovation' | 'professional' | 'home_services';
  keywords: string[];
}

export const SERVICE_CATALOG: ServiceItem[] = [
  // --- UTILITIES & INFRASTRUCTURE ---
  
  // Electrician
  { id: 'elec_rewire', trade: 'electrician', vertical: 'utilities', keywords: ['rewire', 'cables', 'circuits', 'new install'] },
  { id: 'elec_pat', trade: 'electrician', vertical: 'utilities', keywords: ['pat testing', 'appliance testing', 'safety certificate'] },
  { id: 'elec_eicr', trade: 'electrician', vertical: 'utilities', keywords: ['eicr', 'landlord certificate', 'electrical report', 'inspection'] },
  { id: 'elec_consumer_unit', trade: 'electrician', vertical: 'utilities', keywords: ['fuse box', 'consumer unit', 'breaker board'] },
  { id: 'elec_ev_charger', trade: 'electrician', vertical: 'utilities', keywords: ['ev charger', 'electric vehicle', 'tesla wallbox'] },
  { id: 'elec_lighting', trade: 'electrician', vertical: 'utilities', keywords: ['lighting', 'led', 'garden lights', 'downlights'] },
  { id: 'elec_alarms', trade: 'electrician', vertical: 'utilities', keywords: ['fire alarm', 'smoke detector', 'security alarm', 'burglar alarm'] },
  { id: 'elec_smart_home', trade: 'electrician', vertical: 'utilities', keywords: ['smart home', 'nest', 'ring', 'home automation', 'cctv'] },

  // Gas & Heating
  { id: 'gas_boiler_install', trade: 'gas_heating', vertical: 'utilities', keywords: ['boiler install', 'new boiler', 'combi boiler'] },
  { id: 'gas_boiler_service', trade: 'gas_heating', vertical: 'utilities', keywords: ['boiler service', 'boiler repair', 'annual check'] },
  { id: 'gas_safety_cp12', trade: 'gas_heating', vertical: 'utilities', keywords: ['cp12', 'gas safety', 'landlord check', 'gas certificate'] },
  { id: 'gas_power_flush', trade: 'gas_heating', vertical: 'utilities', keywords: ['power flush', 'radiator cleaning', 'sludge removal'] },
  { id: 'gas_radiators', trade: 'gas_heating', vertical: 'utilities', keywords: ['radiator', 'valves', 'heating leak'] },
  { id: 'gas_underfloor', trade: 'gas_heating', vertical: 'utilities', keywords: ['underfloor heating', 'wet system', 'heating manifolds'] },
  { id: 'gas_air_source', trade: 'gas_heating', vertical: 'utilities', keywords: ['heat pump', 'air source', 'renewable heating'] },

  // Plumbing
  { id: 'plumb_emergency', trade: 'plumbing', vertical: 'utilities', keywords: ['burst pipe', 'flood', 'emergency plumber', 'leak'] },
  { id: 'plumb_drainage', trade: 'plumbing', vertical: 'utilities', keywords: ['blocked drain', 'unblock', 'sewage', 'drain survey'] },
  { id: 'plumb_taps_toilets', trade: 'plumbing', vertical: 'utilities', keywords: ['tap repair', 'toilet flush', 'leak repair'] },
  { id: 'plumb_bathroom_fit', trade: 'plumbing', vertical: 'utilities', keywords: ['bathroom suite', 'shower install', 'bath installation'] },
  { id: 'plumb_leak_detect', trade: 'plumbing', vertical: 'utilities', keywords: ['leak detection', 'trace and access', 'hidden leak'] },
  { id: 'plumb_tanks', trade: 'plumbing', vertical: 'utilities', keywords: ['water tank', 'immersion heater', 'hot water cylinder'] },

  // AC
  { id: 'ac_install', trade: 'air_conditioning', vertical: 'utilities', keywords: ['ac install', 'air con', 'split system', 'cooling'] },
  { id: 'ac_service', trade: 'air_conditioning', vertical: 'utilities', keywords: ['ac service', 'regas', 'ac repair', 'ventilation'] },

  // --- PROPERTY RENOVATION & EXTERIOR ---

  // Roofing
  { id: 'roof_repair', trade: 'roofing', vertical: 'renovation', keywords: ['roof repair', 'tiles', 'slates', 'leak'] },
  { id: 'roof_flat', trade: 'roofing', vertical: 'renovation', keywords: ['flat roof', 'epdm', 'felt', 'rubber roof'] },
  { id: 'roof_gutters', trade: 'roofing', vertical: 'renovation', keywords: ['gutters', 'fascias', 'soffits', 'downpipe'] },
  { id: 'roof_chimney', trade: 'roofing', vertical: 'renovation', keywords: ['chimney repair', 'repointing', 'pots', 'stack'] },
  { id: 'roof_leadwork', trade: 'roofing', vertical: 'renovation', keywords: ['leadwork', 'flashing', 'valleys'] },
  { id: 'roof_cleaning', trade: 'roofing', vertical: 'renovation', keywords: ['roof cleaning', 'moss removal', 'protective coating'] },
  { id: 'roof_survey', trade: 'roofing', vertical: 'renovation', keywords: ['roof survey', 'drone inspection', 'pre-purchase'] },

  // Exterior
  { id: 'ext_cladding', trade: 'exterior', vertical: 'renovation', keywords: ['cladding', 'upvc', 'timber cladding', 'cedral'] },
  { id: 'ext_rendering', trade: 'exterior', vertical: 'renovation', keywords: ['rendering', 'k-rend', 'plastering external', 'pebble dash'] },
  { id: 'ext_repointing', trade: 'exterior', vertical: 'renovation', keywords: ['repointing', 'brickwork', 'mortar'] },
  { id: 'ext_damp', trade: 'exterior', vertical: 'renovation', keywords: ['damp proofing', 'rising damp', 'condensation'] },

  // Joinery
  { id: 'joinery_kitchen', trade: 'joinery', vertical: 'renovation', keywords: ['kitchen fit', 'cabinets', 'worktops'] },
  { id: 'joinery_wardrobe', trade: 'joinery', vertical: 'renovation', keywords: ['wardrobe', 'built in', 'storage', 'bespoke'] },
  { id: 'joinery_doors', trade: 'joinery', vertical: 'renovation', keywords: ['internal doors', 'architrave', 'skirting'] },
  { id: 'joinery_stairs', trade: 'joinery', vertical: 'renovation', keywords: ['staircase', 'bannister', 'spindles'] },

  // Windows & Doors
  { id: 'win_glazing', trade: 'windows_doors', vertical: 'renovation', keywords: ['double glazing', 'windows', 'glass repair'] },
  { id: 'win_bifold', trade: 'windows_doors', vertical: 'renovation', keywords: ['bifold doors', 'patio doors', 'french doors'] },
  { id: 'win_composite', trade: 'windows_doors', vertical: 'renovation', keywords: ['composite door', 'front door', 'upvc door'] },

  // Painting & Decorating
  { id: 'dec_interior', trade: 'decorating', vertical: 'renovation', keywords: ['interior painting', 'walls', 'ceilings', 'woodwork'] },
  { id: 'dec_exterior', trade: 'decorating', vertical: 'renovation', keywords: ['exterior painting', 'masonry', 'windows'] },
  { id: 'dec_wallpaper', trade: 'decorating', vertical: 'renovation', keywords: ['wallpaper', 'paperhanging', 'feature wall'] },
  { id: 'dec_spraying', trade: 'decorating', vertical: 'renovation', keywords: ['paint spraying', 'kitchen spray', 'uPVC spray'] },

  // Flooring
  { id: 'floor_hardwood', trade: 'flooring', vertical: 'renovation', keywords: ['hardwood', 'engineered wood', 'parquet'] },
  { id: 'floor_laminate', trade: 'flooring', vertical: 'renovation', keywords: ['laminate', 'vinyl', 'lvt'] },
  { id: 'floor_carpet', trade: 'flooring', vertical: 'renovation', keywords: ['carpet fitting', 'underlay', 'stair runner'] },
  { id: 'floor_sanding', trade: 'flooring', vertical: 'renovation', keywords: ['floor sanding', 'varnishing', 'restoration'] },
  { id: 'floor_tiles', trade: 'flooring', vertical: 'renovation', keywords: ['tiling', 'floor tiles', 'wall tiles', 'splashback'] },

  // Landscaping
  { id: 'land_paving', trade: 'landscaping', vertical: 'renovation', keywords: ['paving', 'block paving', 'patio', 'driveway'] },
  { id: 'land_fencing', trade: 'landscaping', vertical: 'renovation', keywords: ['fencing', 'panels', 'gates', 'post'] },
  { id: 'land_grass', trade: 'landscaping', vertical: 'renovation', keywords: ['turfing', 'artificial grass', 'lawn'] },
  { id: 'land_decking', trade: 'landscaping', vertical: 'renovation', keywords: ['decking', 'composite decking', 'timber'] },

  // --- BUSINESS & PROFESSIONAL ---

  // Accounting
  { id: 'acc_vat', trade: 'accounting', vertical: 'professional', keywords: ['vat', 'tax return', 'mtd'] },
  { id: 'acc_payroll', trade: 'accounting', vertical: 'professional', keywords: ['payroll', 'paye', 'pensions'] },
  { id: 'acc_self_assessment', trade: 'accounting', vertical: 'professional', keywords: ['self assessment', 'tax', 'personal tax'] },
  { id: 'acc_bookkeeping', trade: 'accounting', vertical: 'professional', keywords: ['bookkeeping', 'xero', 'quickbooks'] },
  { id: 'acc_corp_tax', trade: 'accounting', vertical: 'professional', keywords: ['corporation tax', 'accounts', 'hmrc'] },

  // Legal
  { id: 'leg_conveyancing', trade: 'legal', vertical: 'professional', keywords: ['conveyancing', 'selling house', 'buying house'] },
  { id: 'leg_wills', trade: 'legal', vertical: 'professional', keywords: ['wills', 'probate', 'inheritance'] },
  { id: 'leg_family', trade: 'legal', vertical: 'professional', keywords: ['divorce', 'family law', 'custody'] },
  { id: 'leg_business', trade: 'legal', vertical: 'professional', keywords: ['business contracts', 'terms and conditions', 'gdpr'] },

  // Digital
  { id: 'dig_seo', trade: 'digital', vertical: 'professional', keywords: ['seo', 'search engine', 'ranking', 'google'] },
  { id: 'dig_social', trade: 'digital', vertical: 'professional', keywords: ['social media', 'facebook', 'instagram', 'ads'] },
  { id: 'dig_web', trade: 'digital', vertical: 'professional', keywords: ['web design', 'website', 'shopify', 'wordpress'] },

  // --- HOME & COMMERCIAL SERVICES ---

  // Cleaning
  { id: 'clean_regular', trade: 'cleaning', vertical: 'home_services', keywords: ['cleaner', 'domestic', 'ironing', 'weekly'] },
  { id: 'clean_deep', trade: 'cleaning', vertical: 'home_services', keywords: ['deep clean', 'end of tenancy', 'move out'] },
  { id: 'clean_oven', trade: 'cleaning', vertical: 'home_services', keywords: ['oven clean', 'bbq cleaning'] },
  { id: 'clean_carpet', trade: 'cleaning', vertical: 'home_services', keywords: ['carpet cleaning', 'upholstery', 'sofa'] },
  { id: 'clean_window', trade: 'cleaning', vertical: 'home_services', keywords: ['window cleaning', 'reach and wash', 'conservatory'] },

  // Maintenance
  { id: 'maint_handyman', trade: 'handyman', vertical: 'home_services', keywords: ['handyman', 'odd jobs', 'furniture assembly', 'hanging'] },
  { id: 'maint_locksmith', trade: 'locksmith', vertical: 'home_services', keywords: ['locksmith', 'emergency entry', 'lock repair'] },
  { id: 'maint_pest', trade: 'pest_control', vertical: 'home_services', keywords: ['pest control', 'mice', 'rats', 'wasp nest'] },
  { id: 'maint_waste', trade: 'waste', vertical: 'home_services', keywords: ['waste removal', 'rubbish', 'clearance', 'licensed'] },

  // Education
  { id: 'edu_math', trade: 'education', vertical: 'home_services', keywords: ['math tutor', 'gcse math', 'alevel math'] },
  { id: 'edu_science', trade: 'education', vertical: 'home_services', keywords: ['science', 'physics', 'chemistry', 'biology'] },
  { id: 'edu_english', trade: 'education', vertical: 'home_services', keywords: ['english tutor', 'literature', 'grammar'] },
  { id: 'edu_languages', trade: 'education', vertical: 'home_services', keywords: ['spanish', 'french', 'chinese', 'ielts'] },
  { id: 'edu_ai_coding', trade: 'education', vertical: 'home_services', keywords: ['ai coding', 'python', 'scratch', 'programming'] },
];
