const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const translations = {
  'ar.ts': 'موثوق به من قبل سكان المملكة المتحدة وموثق من قبل',
  'hi.ts': 'यूके निवासियों द्वारा विश्वसनीय और निम्न द्वारा सत्यापित',
  'ja.ts': '英国居住者に信頼され、以下によって検証されています',
  'ko.ts': '영국 거주자가 신뢰하고 다음에서 인증함',
  'pa.ts': 'ਯੂਕੇ ਨਿਵਾਸੀਆਂ ਦੁਆਰਾ ਭਰੋਸੇਮੰਦ ਅਤੇ ਦੁਆਰਾ ਪ੍ਰਮਾਣਿਤ',
  'pl.ts': 'Zaufany przez mieszkańców Wielkiej Brytanii i zweryfikowany przez',
  'ro.ts': 'De încredere pentru rezidenții din Regatul Unit și verificat de',
  'ur.ts': 'یوکے کے رہائشیوں کا قابل اعتماد اور تصدیق شدہ از',
};

files.forEach(file => {
  if (translations[file]) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if trustedBy already exists
    if (content.includes('trustedBy:')) {
      console.log(`${file}: found trustedBy, skipping.`);
      return;
    }

    // Try to find noResults or eliteBadge or similar to insert after
    const searchPattern = /noResults:\s*".*?",/;
    const match = content.match(searchPattern);

    if (match) {
      const insertion = `\n    trustedBy: "${translations[file]}",`;
      const newContent = content.replace(match[0], match[0] + insertion);
      fs.writeFileSync(filePath, newContent);
      console.log(`${file}: Added trustedBy.`);
    } else {
      console.log(`${file}: Could not find insertion point.`);
    }
  }
});
