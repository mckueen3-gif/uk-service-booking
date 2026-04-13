const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const translations = {
  'en.ts': 'Trusted by UK residents and verified by',
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

    // Check if trustedBy already exists in search
    if (content.includes('trustedBy:')) {
      console.log(`${file}: already has trustedBy, skipping.`);
      return;
    }

    // Find the search object
    const searchPattern = /search:\s*{([\s\S]*?)}/;
    const match = content.match(searchPattern);

    if (match) {
        const inner = match[1];
        // Insert trustedBy before the closing brace of the search object
        let newInner = inner.trim();
        if (newInner.endsWith(',')) newInner = newInner.slice(0, -1);
        
        const replacement = `search: { ${newInner}, trustedBy: "${translations[file]}" }`;
        const newContent = content.replace(searchPattern, replacement);
        
        fs.writeFileSync(filePath, newContent);
        console.log(`${file}: SUCCESS`);
    } else {
        console.log(`${file}: FAILED to find search section`);
    }
  }
});
