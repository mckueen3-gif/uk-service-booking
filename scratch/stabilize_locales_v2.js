const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

const translations = {
  'en.ts': 'Trusted by UK Residents & Verified by',
  'zh-TW.ts': '受到英國居民信任並經過驗證',
  'ar.ts': 'موثوق به من قبل سكان المملكة المتحدة وموثق من قبل',
  'hi.ts': 'ब्रिटेन के निवासियों द्वारा भरोसेमंद और सत्यापित',
  'ja.ts': '英国居住者に信頼され、検証済み',
  'ko.ts': '영국 거주자가 신뢰하고 검증함',
  'pa.ts': 'ਯੂਕੇ ਦੇ ਨਿਵਾसीਆਂ ਦੁਆरा ਭਰੋਸੇਯੋਗ ਅਤੇ ਪ੍ਰਮਾਣਿਤ',
  'pl.ts': 'Zaufany przez mieszkańców Wielkiej Brytanii i zweryfikowany przez',
  'ro.ts': 'De încredere pentru rezidenții din Marea Britanie și verificat de',
  'ur.ts': 'یوکے के रहائشیوں का قابل اعتماد और تصدیق شدہ',
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove all instances of trustedBy first to avoid duplicates
  content = content.replace(/,\s*trustedBy:\s*"[^"]*"/g, '');
  content = content.replace(/trustedBy:\s*"[^"]*",\s*/g, '');
  content = content.replace(/trustedBy:\s*"[^"]*"/g, '');

  // 2. Insert into the home object specifically
  // We look for home: { and then the next categories: { within that scope
  const homeMatch = content.match(/home:\s*{([\s\S]*?)}/);
  if (homeMatch) {
    let homeInner = homeMatch[1];
    const translation = translations[file] || translations['en.ts'];
    
    // Replace the first categories: { inside the home object
    homeInner = homeInner.replace(/categories:\s*{/, `trustedBy: "${translation}",\n    categories: {`);
    
    content = content.replace(/home:\s*{[\s\S]*?}/, `home: {${homeInner}}`);
    console.log(`STABILIZED: ${file}`);
  } else {
    console.log(`FAILED: ${file} (Home not found)`);
  }

  // 3. Ensure no trailing commas in objects after our mass removal
  content = content.replace(/,\s*}/g, ' }');

  fs.writeFileSync(filePath, content);
});
