const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/lib/i18n/locales');
const targetLocales = ['ar.ts', 'hi.ts', 'ja.ts', 'ko.ts', 'pa.ts', 'pl.ts', 'ro.ts', 'ur.ts'];

const footerAdditions = {
  address: "London, UK",
  phone: "+44 20 1234 5678",
  email: "support@conciergeai.uk",
  aboutUs: "ConciergeAI connects you to the top 1% of certified professionals in the UK.",
  companyNo: "12345678",
  vatNo: "GB123456789",
  trustSignal: "Excellent on Trustpilot"
};

const settingsMgrTemplate = {
  title: "Platform Configuration",
  sub: "Manage global branding, legal info and contact details",
  tabs: { branding: "Branding", contact: "Contact", legal: "Legal", social: "Social" },
  fields: { 
    companyName: "Business Name", aboutUs: "Mission", logoUrl: "Logo URL", officeAddress: "Address", contactPhone: "Phone", contactEmail: "Email", 
    companyRegistration: "Company No", vatRegistration: "VAT ID", facebook: "Facebook", twitter: "Twitter", instagram: "Instagram", linkedin: "LinkedIn"
  },
  save: "Update Active Settings",
  success: "Settings propagated successfully",
  error: "Critical failure during propagation"
};

targetLocales.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix Footer (In-place expansion)
  // Find tagline or explore and add the missing ones before }
  if (content.includes('footer: {')) {
    const footerStart = content.indexOf('footer: {');
    const footerEnd = content.indexOf('},', footerStart);
    let footerContent = content.substring(footerStart, footerEnd);
    
    if (!footerContent.includes('address:')) {
      footerContent = footerContent.replace(/tagline: ".*?",/, (m) => m + ` address: "${footerAdditions.address}", phone: "${footerAdditions.phone}", email: "${footerAdditions.email}", aboutUs: "${footerAdditions.aboutUs}", companyNo: "${footerAdditions.companyNo}", vatNo: "${footerAdditions.vatNo}",`);
      footerContent += `, social: { facebook: "#", twitter: "#", instagram: "#", linkedin: "#" } `;
      content = content.substring(0, footerStart) + footerContent + content.substring(footerEnd);
    }
  }

  // 2. Fix Admin (Add if missing)
  if (!content.includes('admin: {')) {
     // Search for merchant_mgr: { ... } or search: { ... } and insert before auth:
     content = content.replace(/},\s*auth: \{/, `},\n  admin: {\n    settings_mgr: ${JSON.stringify(settingsMgrTemplate, null, 4).replace(/"([^"]+)":/g, '$1:')}\n  },\n  auth: {`);
  } else if (!content.includes('settings_mgr:')) {
     // Add to existing admin object
     content = content.replace(/},\n\s*auth: \{/, `,\n    settings_mgr: ${JSON.stringify(settingsMgrTemplate, null, 4).replace(/"([^"]+)":/g, '$1:')}\n    },\n  auth: {`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Secured sync for ${file}`);
});
