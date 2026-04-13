const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const translations = {
  'en.ts': { quickActions: 'Quick Actions', exploreServices: 'Explore Services' },
  'zh-TW.ts': { quickActions: '快速操作', exploreServices: '探索服務' },
  'ar.ts': { quickActions: 'إجراءات سريعة', exploreServices: 'استكشاف الخدمات' },
  'hi.ts': { quickActions: 'त्वरित कार्रवाई', exploreServices: 'सेवाओं का पता लगाएं' },
  'ja.ts': { quickActions: 'クイックアクション', exploreServices: 'サービスを探索' },
  'ko.ts': { quickActions: '퀵 액션', exploreServices: '서비스 탐색' },
  'pa.ts': { quickActions: 'ਤੁਰੰਤ ਕਾਰਵਾਈ', exploreServices: 'ਸੇਵਾਵਾਂ ਦੀ ਪੜਚੋਲ ਕਰੋ' },
  'pl.ts': { quickActions: 'Szybkie działania', exploreServices: 'Eksploruj usługi' },
  'ro.ts': { quickActions: 'Acțiuni rapide', exploreServices: 'Explorează servicii' },
  'ur.ts': { quickActions: 'فوری کارروائیاں', exploreServices: 'خدمات دریافت کریں' },
};

files.forEach(file => {
  if (translations[file]) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the nav object
    const navPattern = /nav:\s*{([\s\S]*?)}/;
    const match = content.match(navPattern);

    if (match) {
        let inner = match[1].trim();
        // Remove trailing comma if exists
        if (inner.endsWith(',')) inner = inner.slice(0, -1);
        
        // Build new inner content, checking for existence to avoid duplicates
        let newItems = [];
        if (!inner.includes('quickActions:')) {
           newItems.push(`quickActions: "${translations[file].quickActions}"`);
        }
        if (!inner.includes('exploreServices:')) {
           newItems.push(`exploreServices: "${translations[file].exploreServices}"`);
        }
        
        if (newItems.length > 0) {
           const replacement = `nav: { ${inner}, ${newItems.join(', ')} }`;
           const newContent = content.replace(navPattern, replacement);
           fs.writeFileSync(filePath, newContent);
           console.log(`${file}: UPDATED with ${newItems.length} keys`);
        } else {
           console.log(`${file}: ALREADY UP TO DATE`);
        }
    } else {
        console.log(`${file}: FAILED to find nav section`);
    }
  }
});
