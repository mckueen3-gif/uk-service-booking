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
  'pa.ts': 'ਯੂਕੇ ਦੇ ਨਿਵਾਸੀਆਂ ਦੁਆਰਾ ਭਰੋਸੇਯੋਗ ਅਤੇ ਪ੍ਰਮਾਣਿਤ',
  'pl.ts': 'Zaufany przez mieszkańców Wielkiej Brytanii i zweryfikowany przez',
  'ro.ts': 'De încredere pentru rezidenții din Marea Brytanie și verificat de',
  'ur.ts': 'یوکے کے رہائشیوں کا قابل اعتماد اور تصدیق شدہ',
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Clean up ALL instances of trustedBy that are NOT top-level home properties
  // Specifically remove from hero objects
  content = content.replace(/hero:\s*{([\s\S]*?)}/g, (match, inner) => {
    let newInner = inner.replace(/,\s*trustedBy:\s*"[^"]*"/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*",\s*/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*"/g, '');
    return `hero: {${newInner}}`;
  });

  // Specifically remove from search objects
  content = content.replace(/search:\s*{([\s\S]*?)}/g, (match, inner) => {
    let newInner = inner.replace(/,\s*trustedBy:\s*"[^"]*"/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*",\s*/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*"/g, '');
    return `search: {${newInner}}`;
  });

  // 2. Ensure trustedBy exists exactly once as a direct child of home
  // First, remove any existing top-level home.trustedBy to re-insert it cleanly
  content = content.replace(/\n\s*trustedBy:\s*"[^"]*",?\n/g, '\n');

  // Insert before 'categories:' in the home object
  const translation = translations[file] || translations['en.ts'];
  content = content.replace(/categories:\s*{/, `trustedBy: "${translation}",\n    categories: {`);

  // 3. Final Syntax Check: Ensure no trailing commas before closing braces if we removed something
  content = content.replace(/,\s*}/g, ' }');

  fs.writeFileSync(filePath, content);
  console.log(`STABILIZED: ${file}`);
});
