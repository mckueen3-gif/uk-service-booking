const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts') && f !== 'en.ts'); // skip en.ts for manual check or handle it

const translations = {
  'en.ts': 'Trusted by UK Residents & Verified by',
  'zh-TW.ts': '受到英國居民信任並經過驗證',
  'ar.ts': 'موثوق به من قبل سكان المملكة المتحدة وموثق من قبل',
  'hi.ts': 'ब्रिटेन के निवासियों द्वारा भरोसेमंद और सत्यापित',
  'ja.ts': '英国居住者に信頼され、検証済み',
  'ko.ts': '영국 거주자가 신뢰하고 검증함',
  'pa.ts': 'ਯੂਕੇ ਦੇ ਨਿਵਾਸੀਆਂ دੁਆਰਾ ਭਰੋਸੇਯੋਗ ਅਤੇ ਪ੍ਰਮਾਣਿਤ',
  'pl.ts': 'Zaufany przez mieszkańców Wielkiej Brytanii i zweryfikowany przez',
  'ro.ts': 'De încredere pentru rezidenții din Marea Britanie și verificat de',
  'ur.ts': 'یوکے کے رہائشیوں کا قابل اعتماد اور تصدیق شدہ',
};

// Also handle en.ts specifically
const allFiles = [...files, 'en.ts'];

allFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove trustedBy from search
  content = content.replace(/search:\s*{([\s\S]*?)}/, (match, inner) => {
    let newInner = inner.replace(/,\s*trustedBy:\s*"[^"]*"/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*",\s*/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*"/g, '');
    return `search: {${newInner}}`;
  });

  // 2. Remove trustedBy from home.hero
  content = content.replace(/hero:\s*{([\s\S]*?)}/, (match, inner) => {
    let newInner = inner.replace(/,\s*trustedBy:\s*"[^"]*"/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*",\s*/g, '');
    newInner = newInner.replace(/trustedBy:\s*"[^"]*"/g, '');
    return `hero: {${newInner}}`;
  });

  // 3. Ensure trustedBy is a direct child of home
  content = content.replace(/home:\s*{([\s\S]*?)}/, (match, inner) => {
    let newInner = inner.trim();
    if (newInner.includes('trustedBy:')) {
        // already there, maybe in wrong place, but if it's there as a child now after hero cleanup, it might be fine.
        // But let's be safe and re-add it at the end if it's not at the top level.
    }
    
    // Check if it's missing at top level of home
    if (!newInner.match(/^\s*trustedBy:/m) && !newInner.match(/,\s*trustedBy:/)) {
       if (newInner.endsWith(',')) newInner = newInner.slice(0, -1);
       newInner += `, trustedBy: "${translations[file]}"`;
    }
    return `home: { ${newInner} }`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`${file}: SUCCESS`);
});
