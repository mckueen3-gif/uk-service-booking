const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const translations = {
  'en.ts': 'Quick Actions',
  'zh-TW.ts': '快速操作',
  'ar.ts': 'إجراءات سريعة',
  'hi.ts': 'त्वरित कार्रवाई',
  'ja.ts': 'クイックアクション',
  'ko.ts': 'クイ액션',
  'pa.ts': 'ਤੁਰੰਤ ਕਾਰਵਾਈ',
  'pl.ts': 'Szybkie działania',
  'ro.ts': 'Acțiuni rapide',
  'ur.ts': 'فوری کارروائیاں',
};

files.forEach(file => {
  if (translations[file]) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if quickActions already exists in nav
    if (content.includes('quickActions:')) {
      console.log(`${file}: already has quickActions, skipping.`);
      return;
    }

    // Find the nav object
    const navPattern = /nav:\s*{([\s\S]*?)}/;
    const match = content.match(navPattern);

    if (match) {
        const inner = match[1];
        // Insert quickActions before the closing brace of the nav object
        // Or just replace the whole match
        let newInner = inner.trim();
        if (newInner.endsWith(',')) newInner = newInner.slice(0, -1);
        
        const replacement = `nav: { ${newInner}, quickActions: "${translations[file]}" }`;
        const newContent = content.replace(navPattern, replacement);
        
        fs.writeFileSync(filePath, newContent);
        console.log(`${file}: SUCCESS`);
    } else {
        console.log(`${file}: FAILED to find nav section`);
    }
  }
});
