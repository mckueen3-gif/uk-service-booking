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
  'ro.ts': 'De încredere pentru rezidenții din Marea Britanie și verificat de',
  'ur.ts': 'یوکے کے رہائشیوں का قابل اعتماد اور تصدیق شدہ',
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove ALL instances of trustedBy everywhere first to reset
  content = content.replace(/,\s*trustedBy:\s*"[^"]*"/g, '');
  content = content.replace(/trustedBy:\s*"[^"]*",\s*/g, '');
  content = content.replace(/trustedBy:\s*"[^"]*"/g, '');

  const lines = content.split('\n');
  let inHome = false;
  let fixed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('home: {')) {
      inHome = true;
    }
    
    // Once in home, find the first categories: { and insert BEFORE it
    if (inHome && line.includes('categories: {')) {
      const translation = translations[file] || translations['en.ts'];
      lines[i] = `    trustedBy: "${translation}",\n${line}`;
      fixed = true;
      break; // Only once per file
    }
  }

  if (fixed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`STABILIZED: ${file}`);
  } else {
    console.log(`FAILED: ${file}`);
  }
});
