const fs = require('fs');
const path = require('path');

// Root is C:\Users\MCQueen\.gemini\antigravity\scratch\uk_service_booking
const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const platformMap = {
  'en.ts': 'Infrastructure',
  'zh-TW.ts': '基礎設施',
  'ar.ts': 'البنية التحتية',
  'hi.ts': 'प्लेटफॉर्म',
  'ja.ts': 'プラットフォーム',
  'ko.ts': '플랫폼',
  'ur.ts': 'انفراسٹرکچر',
  'pa.ts': 'ਪਲੇਟਫਾਰਮ',
  'pl.ts': 'Infrastruktura',
  'ro.ts': 'Infrastructură'
};

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if platform is already there
    if (content.match(/platform:\s*".*?",/)) {
        console.log(`Skipping ${file} - already updated`);
        return;
    }
    
    const platform = platformMap[file] || 'Platform';
    
    // Simple replacement after explore
    content = content.replace(/(explore:\s*".*?",)/, `$1\n    platform: "${platform}",`);
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
