const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir);

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
  'ur.ts': 'یوکے کے رہائشیوں کا قابل اعتماد اور تصدیق شدہ',
};

files.forEach(file => {
  if (translations[file]) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove trustedBy from search if it exists there
    const searchPattern = /search:\s*{([\s\S]*?)}/;
    const searchMatch = content.match(searchPattern);
    if (searchMatch) {
        let inner = searchMatch[1];
        if (inner.includes('trustedBy:')) {
            // Remove the trustedBy line or entry
            const newInner = inner.replace(/,\s*trustedBy:\s*"[^"]*"/, '').replace(/trustedBy:\s*"[^"]*",\s*/, '').replace(/trustedBy:\s*"[^"]*"/, '');
            content = content.replace(searchMatch[0], `search: {${newInner}}`);
            console.log(`${file}: REMOVED trustedBy from search`);
        }
    }

    // 2. Ensure trustedBy is in home
    const homePattern = /home:\s*{([\s\S]*?)}/;
    const homeMatch = content.match(homePattern);
    if (homeMatch) {
        let inner = homeMatch[1].trim();
        if (!inner.includes('trustedBy:')) {
            if (inner.endsWith(',')) inner = inner.slice(0, -1);
            const replacement = `home: { ${inner}, trustedBy: "${translations[file]}" }`;
            content = content.replace(homeMatch[0], replacement);
            console.log(`${file}: ADDED trustedBy to home`);
        } else {
            console.log(`${file}: trustedBy already in home`);
        }
    }

    fs.writeFileSync(filePath, content);
  }
});
